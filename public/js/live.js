/*start script for live page */
document.addEventListener("DOMContentLoaded", () => {
    loadLive();

    const params = new URLSearchParams(window.location.search);
    if (params.get("openModal") === "true") {
        openLiveModal();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    //pagination buttons
    document.getElementById("prevBtn").addEventListener("click", prevPage);
    document.getElementById("nextBtn").addEventListener("click", nextPage);
    //search
    document.getElementById("searchLive").addEventListener("input", handleSearch);
});

const liveModal = document.getElementById("liveModal");
const openModalLive = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const liveTableBody = document.getElementById("liveTableBody");
const liveForm = document.getElementById("liveForm");
const modalTitle = document.getElementById("modalLiveTitle");

let allLive = [];
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

async function loadLive() {
    try{
        const res = await fetch("/api/live", {
            headers: authHeaders()
        });
        allLive = await res.json();
        filtered = allLive;
        renderTable();
        updatePaginationButtons();
    }catch(err){
        console.error("Failed to load live", err);
    }
}
//modal controls
function openLiveModal(){
    liveForm.reset();
    document.getElementById("liveId").value = "";
    modalTitle.textContent = "Post Live";
    liveModal.classList.add("show");
}


openModalLive.onclick = openLiveModal;

closeModalBtns.forEach(btn =>{
    btn.onclick = () => liveModal.classList.remove("show");
});

//render table
function renderTable(){
    liveTableBody.innerHTML = "";

    if(!filtered.length){
        liveTableBody.innerHTML = `<tr><td colspan="3">No live streams found.</td></tr>`;
        return;
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(item =>{
        liveTableBody.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.status}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editLive('${item._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteLive('${item._id}')"><i class="fa-solid fa-eraser"></i></button>
                </td>
            </tr>
        `;
    });
}
//search functionality
function handleSearch(){
    const query = document.getElementById("searchLive").value.toLowerCase().trim();
    filtered = allLive.filter(item =>
        item.title.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderTable();
    updatePaginationButtons();
}
/* PAGINATION CONTROLS */
function prevPage(){
    if(currentPage > 1){
        currentPage--;
        renderTable();
        updatePaginationButtons();
    }
}
function nextPage(){
    const maxPage = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if(currentPage < maxPage){
        currentPage++;
        renderTable();
        updatePaginationButtons();
    }
}
/* UPDATE BUTTONS + PAGE INDICATOR */
function updatePaginationButtons(){
    const maxPage = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === maxPage;

    document.getElementById("pageIndicator").textContent =
        `Page ${currentPage} of ${maxPage}`;
}
//save live
liveForm.addEventListener("submit", async e =>{
    e.preventDefault();

    const id = document.getElementById("liveId").value;
    const title = document.getElementById("title").value;
    const embedUrl = document.getElementById("embedUrl").value;
    const status = document.getElementById("status").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/live/${id}` : "/api/live";

    try{
        await fetch(url, {
            method,
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ title, embedUrl, status })
        });
        liveModal.classList.remove("show");
        liveForm.reset();
        loadLive();
    }catch(err){
        console.error("Failed to save live:", err);
    }
});
//cancel live
liveForm.addEventListener("reset", () =>{
    liveModal.classList.remove("show");
});
//edit live
function editLive(id) {
    const item = allLive.find(n => n._id === id);

    document.getElementById("liveId").value = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("embedUrl").value = item.embedUrl;
    document.getElementById("status").value = item.status;

    modalTitle.textContent = "Edit";
    liveModal.classList.add("show");
}
//delete live
async function deleteLive(id) {
    if (!confirm("Delete this live?")) return;

    await fetch(`/api/live/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    
    loadLive();
}
/*end script for live page */
window.editLive = editLive;
window.deleteLive = deleteLive;

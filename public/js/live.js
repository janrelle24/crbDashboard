(() => {
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

if (!liveTableBody || !liveForm) {
    console.warn("Live page elements not found. Script stopped.");
    return;
}

let allLive = [];
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

async function loadLive() {
    try{
        const res = await authFetch("/api/live");

        const data = await res.json();
        if(!Array.isArray(data)){
            throw new Error("Invalid live data");
        }
        allLive = data;
        filtered = data;
        currentPage = 1;
        renderTable();
        updatePaginationButtons();
    }catch(err){
        console.error("Failed to load live", err);
        liveTableBody.innerHTML = `<tr><td colspan="5">Failed to load Live</td></tr>`;
    }
}
//modal controls
function openLiveModal(){
    liveForm.reset();
    document.getElementById("liveId").value = "";
    modalTitle.textContent = "Post Live";
    liveModal.classList.add("show");
}


openModalLive?.addEventListener("click", openLiveModal);


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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("embedUrl", embedUrl);
    formData.append("status", status);

    try{
        await authFetch(id ? `/api/live/${id}` : "/api/live", {
            method: id ? "PUT" : "POST",
            body: formData,
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
    if(!item) return;

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
    try{
        await authFetch(`/api/live/${id}`, { method: "DELETE"});
        loadLive();
    }catch(err){
        console.error("Failed to delete live:", err.message);
    }
    
}
/*end script for live page */
window.editLive = editLive;
window.deleteLive = deleteLive;

})();

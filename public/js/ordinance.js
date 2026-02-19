(() => {
/*start script for ordinance page*/
document.addEventListener("DOMContentLoaded", () => {
    loadOrdinance();
    
    const params = new URLSearchParams(window.location.search);
    if (params.get("openModal") === "true") {
        openOrdinanceModal();
    }
    //pagination buttons
    document.getElementById("prevBtn").addEventListener("click", prevPage);
    document.getElementById("nextBtn").addEventListener("click", nextPage);
    //search
    document.getElementById("searchOrdinance").addEventListener("input", handleSearch);
});

const ordinanceModal = document.getElementById("ordinanceModal");
const openModalOrdinance = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const ordinanceTableBody = document.getElementById("ordinanceTableBody");
const ordinanceForm = document.getElementById("ordinanceForm");
const modalTitle = document.getElementById("modalTitle");

if(!ordinanceTableBody || !ordinanceForm){
    console.warn("Ordinance page elements not found. Script stopped.");
    return;
}

let allOrdinance = [];
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

async function loadOrdinance() {
    try{
        const res = await authFetch("/api/ordinance");

        const data = await res.json();
        if(!Array.isArray(data)){
            throw new Error("Invalid ordinance data");
        }
        allOrdinance = data;
        filtered = data;
        currentPage = 1;
        renderTable();
        updatePaginationButtons();
    }catch(err){
        console.error("Failed to load ordinance", err);
        ordinanceTableBody.innerHTML = `<tr><td colspan="4">Failed to load ordinance</td></tr>`;
    }
}

//modal controls
function openOrdinanceModal(){
    ordinanceForm.reset();
    document.getElementById("ordinanceId").value = "";
    modalTitle.textContent = "Create";
    ordinanceModal.classList.add("show");
}

openModalOrdinance?.addEventListener("click", openOrdinanceModal);

closeModalBtns.forEach(btn =>{
    btn.onclick = () => ordinanceModal.classList.remove("show");
});
//render table
function renderTable(){
    ordinanceTableBody.innerHTML = "";

    if(!filtered.length){
        ordinanceTableBody.innerHTML = `<tr><td colspan="4">No ordinance found.</td></tr>`;
        return;
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(item =>{
        ordinanceTableBody.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.content}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editOrdinance('${item._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteOrdinance('${item._id}')"><i class="fa-solid fa-eraser"></i></button>
                </td>
            </tr>
        `;
    });
}
//setup search
function handleSearch(){
    const query = document.getElementById("searchOrdinance").value.toLowerCase().trim();

    filtered = allOrdinance.filter(item =>
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
//save ordinance
ordinanceForm.addEventListener("submit", async e =>{
    e.preventDefault();

    const id = document.getElementById("ordinanceId").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);


    try{
        await authFetch(id ? `/api/ordinance/${id}` : "/api/ordinance", {
            method: id ? "PUT" : "POST",
            body: formData,
        });
        ordinanceModal.classList.remove("show");
        ordinanceForm.reset();
        loadOrdinance();
    }catch(err){
        console.error("Failed to save ordinance:", err);
    }
});
//cancel ordinance
ordinanceForm.addEventListener("reset", () =>{
    ordinanceModal.classList.remove("show");
});
//edit ordinance
function editOrdinance(id) {
    const item = allOrdinance.find(n => n._id === id);
    if(!item) return;

    document.getElementById("ordinanceId").value = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("content").value = item.content;

    modalTitle.textContent = "Edit";
    ordinanceModal.classList.add("show");
}
//delete ordinance
async function deleteOrdinance(id) {
    if (!confirm("Delete this ordinance?")) return;

    try{
        await authFetch(`/api/ordinance/${id}`, { method: "DELETE"});
        loadOrdinance();
    }catch(err){
        console.error("Failed to delete ordinance:", err.message);
    }
    
}
/*end script for ordinance page*/
window.editOrdinance = editOrdinance;
window.deleteOrdinance = deleteOrdinance;

})();
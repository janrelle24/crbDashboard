/*start script for ordinance page*/
document.addEventListener("DOMContentLoaded", () => {
    loadOrdinance();
    
    const params = new URLSearchParams(window.location.search);
    if (params.get("openModal") === "true") {
        openOrdinanceModal();
    }
});

const ordinanceModal = document.getElementById("ordinanceModal");
const openModalOrdinance = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const ordinanceTableBody = document.getElementById("ordinanceTableBody");
const ordinanceForm = document.getElementById("ordinanceForm");
const modalTitle = document.getElementById("modalTitle");

let ordinance = [];

async function loadOrdinance() {
    try{
        const res = await fetch("/api/ordinance", {
            headers: authHeaders()
        });
        ordinance = await res.json();
        renderTable(ordinance);
        setupSearch();
    }catch(err){
        console.error("Failed to load ordinance", err);
    }
}

//modal controls
function openOrdinanceModal(){
    ordinanceForm.reset();
    document.getElementById("ordinanceId").value = "";
    modalTitle.textContent = "Create";
    ordinanceModal.classList.add("show");
}
openModalOrdinance.onclick = openOrdinanceModal;

closeModalBtns.forEach(btn =>{
    btn.onclick = () => ordinanceModal.classList.remove("show");
});
//render table
function renderTable(ordinance){
    ordinanceTableBody.innerHTML = "";

    if(!ordinance.length){
        ordinanceTableBody.innerHTML = `<tr><td colspan="4">No ordinance found.</td></tr>`;
        return;
    }
    ordinance.forEach(item =>{
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
function setupSearch(){
    const searchInput = document.getElementById("searchOrdinance");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();

        const filtered = ordinance.filter(item =>
            item.title.toLowerCase().includes(query) 
        );

        renderTable(filtered);
    });
}
//save ordinance
ordinanceForm.addEventListener("submit", async e =>{
    e.preventDefault();

    const id = document.getElementById("ordinanceId").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/ordinance/${id}` : "/api/ordinance";

    try{
        await fetch(url, {
            method,
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ title, content })
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
    const item = ordinance.find(n => n._id === id);

    document.getElementById("ordinanceId").value = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("content").value = item.content;

    modalTitle.textContent = "Edit";
    ordinanceModal.classList.add("show");
}
//delete ordinance
async function deleteOrdinance(id) {
    if (!confirm("Delete this ordinance?")) return;

    await fetch(`/api/ordinance/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    
    loadOrdinance();
}
/*end script for ordinance page*/
window.editOrdinance = editOrdinance;
window.deleteOrdinance = deleteOrdinance;
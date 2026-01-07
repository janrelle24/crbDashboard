/*start script for ordinance page*/
document.addEventListener("DOMContentLoaded", loadOrdinance);

const ordinanceModal = document.getElementById("ordinanceModal");
const openModalOrdinance = document.getElementById("openModalOrdinance");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const ordinanceTableBody = document.getElementById("ordinanceTableBody");
const ordinanceForm = document.getElementById("ordinanceForm");
const modalTitle = document.getElementById("modalTitle");

let ordinance = [];

async function loadOrdinance() {
    try{
        const res = await fetch("/api/ordinance");
        ordinance = await res.json();
        renderTable();
    }catch(err){
        console.error("Failed to load ordinance", err);
    }
}

//modal controls
openModalOrdinance.onclick = () =>{
    ordinanceForm.reset();
    document.getElementById("ordinanceId").value = "";
    modalTitle.textContent = "Create";
    ordinanceModal.classList.add("show");
};
closeModalBtns.forEach(btn =>{
    btn.onclick = () => ordinanceModal.classList.remove("show");
});
//render table
function renderTable(){
    ordinanceTableBody.innerHTML = "";
    ordinance.forEach(item =>{
        ordinanceTableBody.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.content}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editNews('${item._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteNews('${item._id}')"><i class="fa-solid fa-eraser"></i></button>
                </td>
            </tr>
        `;
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
            headers: { "Content-Type": "application/json" },
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
/*end script for ordinance page*/
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
/*end script for ordinance page*/
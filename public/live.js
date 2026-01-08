/*start script for live page */
document.addEventListener("DOMContentLoaded", loadLive);

const liveModal = document.getElementById("liveModal");
const openModalLive = document.getElementById("openModalLive");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const liveTableBody = document.getElementById("liveTableBody");
const liveForm = document.getElementById("liveForm");
const modalTitle = document.getElementById("modalTitle");

let live = [];

async function loadLive() {
    try{
        const res = await fetch("/api/live");
        live = await res.json();
        renderTable();
    }catch(err){
        console.error("Failed to load live", err);
    }
}
//modal controls
openModalLive.onclick = () =>{
    liveForm.reset();
    document.getElementById("liveId").value = "";
    modalTitle.textContent = "Post Live";
    liveModal.classList.add("show");
};
closeModalBtns.forEach(btn =>{
    btn.onclick = () => liveModal.classList.remove("show");
});
/*end script for live page */
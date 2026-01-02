/*start script for sidebar hamburger btn*/
function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.querySelector(".hamburger");
    const toggles = document.querySelectorAll("#toggleSidebar");

    if (!sidebar || !hamburger) return;

    toggles.forEach(btn => {
        btn.addEventListener("click", () => {
            sidebar.classList.toggle("closed");
    
            if (sidebar.classList.contains("closed")) {
                hamburger.style.display = "block";
            } else {
                hamburger.style.display = "none";
            }
        });
    });
}
/*end script for sidebar hamburger btn*/
/*start script for news page modal*/
const modal = document.getElementById("newsModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const tableBody = document.getElementById("newsTableBody");
const form = document.getElementById("newsForm");
const modalTitle = document.getElementById("modalTitle");

let news = JSON.parse(localStorage.getItem("news")) || [];

/* Modal controls */
openModalBtn.onclick = () =>{
    form.reset();
    document.getElementById("newsId").value = "";
    modalTitle.textContent = "Post News";
    modal.classList.add("show");
};

closeModalBtns.forEach(btn => {
    btn.onclick = () => modal.classList.remove("show");
});
/*end script for news page modal*/





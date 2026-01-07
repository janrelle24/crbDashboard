/*start script for members page */
document.addEventListener("DOMContentLoaded", loadMembers);

const membersModal = document.getElementById("membersModal");
const openModalMembers = document.getElementById("openModalMembers");
const closeModalBtns = document.querySelectorAll(".close-modal");
const membersTableBody = document.getElementById("membersTableBody");
const membersForm = document.getElementById("membersForm");
const modalTitle = document.getElementById("modalTitle");

let members = [];

async function loadMembers() {
    const res = await fetch("/api/members");
    members = await res.json();
    renderTable();
}
//modal controls
openModalMembers.onclick = () =>{
    membersForm.reset();
    document.getElementById("membersId").value = "";
    modalTitle.textContent = "Add Members";
    membersModal.classList.add("show");
};
closeModalBtns.forEach(btn => {
    btn.onclick = () => membersModal.classList.remove("show");
});
/*end script for members page */
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
//render members table
function renderTable(){
    membersTableBody.innerHTML = "";

    members.forEach(item => {
        membersTableBody.innerHTML += `
            <tr>
                <td><img src="${item.image}" alt="news image" style="width:80px; height:auto;"></td>
                <td>${item.name}</td>
                <td>${item.position}</td>
                <td>${item.birthDate}</td>
                <td>${item.education}</td>
                <td>${item.achievements}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editMembers('${item._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteMembers('${item._id}')"><i class="fa-solid fa-eraser"></i></button>
                </td>
            </tr>
        `;
    });
}
//save
membersForm.addEventListener("submit", async e => {
    e.preventDefault();

    const id = document.getElementById("membersId").value;
    const image = document.getElementById("image").files[0];
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const birthDate = document.getElementById("birthDate").value;
    const education = document.getElementById("education").value;
    const achievements = document.getElementById("achievements").value;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("birthDate", birthDate);
    formData.append("education", education);
    formData.append("achievements", achievements);

    // Only append image if user selected one
    if (image) formData.append("image", image);

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/members/${id}` : "/api/members";
    try{
        await fetch(url, {
            method,
            body: formData
        });
    
        membersModal.classList.remove("show");
        membersForm.reset();
        loadMembers();
    }catch(err){
        console.error("Failed to save members:", err);
    }
    
});
//cancel
membersForm.addEventListener("reset", () => {
    membersModal.classList.remove("show");
});
/*end script for members page */
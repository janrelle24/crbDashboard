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
//render table
function renderTable(){
    liveTableBody.innerHTML = "";
    live.forEach(item =>{
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
            headers: { "Content-Type": "application/json" },
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
    const item = live.find(n => n._id === id);

    document.getElementById("liveId").value = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("embedUrl").value = item.embedUrl;
    document.getElementById("status").value = item.status;

    modalTitle.textContent = "Edit";
    liveModal.classList.add("show");
}
//delete ordinance
async function deleteLive(id) {
    if (!confirm("Delete this live?")) return;

    await fetch(`/api/live/${id}`, {
        method: "DELETE"
    });
    
    loadLive();
}
/*end script for live page */
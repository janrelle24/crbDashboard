/*start script for live page */
document.addEventListener("DOMContentLoaded", () => {
    loadLive();

    const params = new URLSearchParams(window.location.search);
    if (params.get("openModal") === "true") {
        openLiveModal();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

const liveModal = document.getElementById("liveModal");
const openModalLive = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const liveTableBody = document.getElementById("liveTableBody");
const liveForm = document.getElementById("liveForm");
const modalTitle = document.getElementById("modalLiveTitle");

let live = [];

async function loadLive() {
    try{
        const res = await fetch("/api/live", {
            headers: authHeaders()
        });
        live = await res.json();
        renderTable(live);
        setupSearch();
    }catch(err){
        console.error("Failed to load live", err);
    }
}
//modal controls
function openLiveModal(){
    liveForm.reset();
    document.getElementById("liveId").value = "";
    modalTitle.textContent = "Post Live";
    liveModal.classList.add("show");
}


openModalLive.onclick = openLiveModal;

closeModalBtns.forEach(btn =>{
    btn.onclick = () => liveModal.classList.remove("show");
});

//render table
function renderTable(live){
    liveTableBody.innerHTML = "";

    if(!live.length){
        liveTableBody.innerHTML = `<tr><td colspan="3">No live streams found.</td></tr>`;
        return;
    }

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
//search functionality
function setupSearch(){
    const searchInput = document.getElementById("searchLive");
    searchInput.addEventListener("input", () =>{
        const query = searchInput.value.toLowerCase();

        const filtered = live.filter(item =>
            item.title.toLowerCase().includes(query) 
        );
        renderTable(filtered);
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
            headers: authHeaders({ "Content-Type": "application/json" }),
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
//delete live
async function deleteLive(id) {
    if (!confirm("Delete this live?")) return;

    await fetch(`/api/live/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    
    loadLive();
}
/*end script for live page */
window.editLive = editLive;
window.deleteLive = deleteLive;

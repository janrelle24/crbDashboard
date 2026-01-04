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

let news = [];

async function loadNews() {
    const res = await fetch("/api/news");
    news = await res.json();
    renderTable();
}

document.addEventListener("DOMContentLoaded", loadNews);

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

/* Render table */
function renderTable(){
    tableBody.innerHTML = "";

    news.forEach(item => {
        tableBody.innerHTML += `
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
/* Save */
form.addEventListener("submit", async e => {
    e.preventDefault();

    const id = document.getElementById("newsId").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/news/${id}` : "/api/news";

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    modal.classList.remove("show");
    form.reset();
    loadNews();
});
/*cancel*/
form.addEventListener("reset", () => {
    modal.classList.remove("show");
});
/* Edit */
function editNews(id) {
    const item = news.find(n => n._id === id);

    document.getElementById("newsId").value = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("content").value = item.content;

    modalTitle.textContent = "Edit News";
    modal.classList.add("show");
}
/* Delete */
async function deleteNews(id) {
    if (!confirm("Delete this news?")) return;

    await fetch(`/api/news/${id}`, {
        method: "DELETE"
    });
    
    loadNews();
}

/*end script for news page modal*/








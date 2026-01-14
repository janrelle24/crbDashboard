/*start script for news page modal*/
document.addEventListener("DOMContentLoaded", () => {
    loadNews();

    const params = new URLSearchParams(window.location.search);
    if (params.get("openModal") === "true") {
        openNewsModal();
    }
});

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

/* Modal controls */
function openNewsModal() {
    form.reset();
    document.getElementById("newsId").value = "";
    modalTitle.textContent = "Post News";
    modal.classList.add("show");
}

/* BUTTON CLICK */
openModalBtn.onclick = openNewsModal;

closeModalBtns.forEach(btn => {
    btn.onclick = () => modal.classList.remove("show");
});

/* Render table */
function renderTable(){
    tableBody.innerHTML = "";

    news.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td><img src="${item.image}" alt="news image" style="width:80px; height:auto;"></td>
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
    const image = document.getElementById("image").files[0];
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // Only append image if user selected one
    if (image) formData.append("image", image);

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/news/${id}` : "/api/news";
    try{
        await fetch(url, {
            method: "POST",
            headers: authHeaders(),
            body: formData
        });
    
        modal.classList.remove("show");
        form.reset();
        loadNews();
    }catch(err){
        console.error("Failed to save news:", err);
    }
    
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


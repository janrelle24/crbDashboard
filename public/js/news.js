/*start script for news page modal*/
document.addEventListener("DOMContentLoaded", () => {
    loadNews();

    const params = new URLSearchParams(window.location.search);
    if (params.get("openModal") === "true") {
        openNewsModal();
    }
    //pagination buttons
    document.getElementById("prevBtn").addEventListener("click", prevPage);
    document.getElementById("nextBtn").addEventListener("click", nextPage);

     // search
    document.getElementById("searchNews").addEventListener("input", handleSearch);
});

const modal = document.getElementById("newsModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtns = document.querySelectorAll(".close-modal"); 
const tableBody = document.getElementById("newsTableBody");
const form = document.getElementById("newsForm");
const modalTitle = document.getElementById("modalTitle");

let allNews = [];
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

async function loadNews() {
    const res = await fetch("/api/news", {
        headers: authHeaders()
    });
        
    allNews = await res.json();
    filtered = allNews;
    currentPage = 1;
    renderTable();
    updatePaginationButtons();
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

/* Render table (WITH PAGINATION) */
function renderTable(){
    tableBody.innerHTML = "";

    if (!filtered.length) {
        tableBody.innerHTML = `<tr><td colspan="5">No news found.</td></tr>`;
        return;
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(item => {
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
/* Search functionality */
function handleSearch(){
    //const searchInput = document.getElementById("searchNews");
    const query = document.getElementById("searchNews").value.toLowerCase().trim();

    filtered = allNews.filter(item =>
        item.title.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderTable();
    updatePaginationButtons();
}
/* PAGINATION CONTROLS */
function prevPage(){
    if(currentPage > 1){
        currentPage--;
        renderTable();
        updatePaginationButtons();
    }
}

function nextPage(){
    const maxPage = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if(currentPage < maxPage){
        currentPage++;
        renderTable();
        updatePaginationButtons();
    }
}
/* UPDATE BUTTONS + PAGE INDICATOR */
function updatePaginationButtons(){
    const maxPage = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === maxPage;

    document.getElementById("pageIndicator").textContent =
        `Page ${currentPage} of ${maxPage}`;
}
/* Save */
form.addEventListener("submit", async e => {
    e.preventDefault();

    const id = document.getElementById("newsId").value;
    const image = document.getElementById("image").files[0];
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const formData = new FormData();
    //formData.append("image", fileInput.files[0]);
    formData.append("title", title);
    formData.append("content", content);

    // Only append image if user selected one
    if (image) formData.append("image", image);

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/news/${id}` : "/api/news";
    try{
        await fetch(url, {
            method, 
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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
    const item = allNews.find(n => n._id === id);

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
        method: "DELETE",
        headers: authHeaders()
    });
    
    loadNews();
}
/*end script for news page modal*/


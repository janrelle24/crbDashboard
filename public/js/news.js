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

if (!tableBody || !form) {
    console.warn("News page elements not found. Script stopped.");
    return;
}

let allNews = [];
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

async function loadNews() {
    try{
        const res = await authFetch("/api/news");
        
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error("Invalid news data");
        }
        allNews = data;
        filtered = data;
        currentPage = 1;
        renderTable();
        updatePaginationButtons();
    }catch(err){
        console.error("Failed to load news:", err.message);
        tableBody.innerHTML = `<tr><td colspan="5">Failed to load news</td></tr>`;
    }
    
}

/* Modal controls */
function openNewsModal() {
    form.reset();
    document.getElementById("newsId").value = "";
    modalTitle.textContent = "Post News";
    modal.classList.add("show");
}

/* BUTTON CLICK */
openModalBtn?.addEventListener("click", openNewsModal);

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

    try{
        await authFetch(id ? `/api/news/${id}` : "/api/news", {
            method: id ? "PUT" : "POST",
            body: formData
        });
        modal.classList.remove("show");
        form.reset();
        loadNews();
    }catch(err){
        console.error("Failed to save news:", err.message);
    }
    
});
/*cancel*/
form.addEventListener("reset", () => {
    modal.classList.remove("show");
});
/* Edit */
function editNews(id) {
    const item = allNews.find(n => n._id === id);
    if(!item) return;

    document.getElementById("newsId").value = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("content").value = item.content;

    modalTitle.textContent = "Edit News";
    modal.classList.add("show");
}
/* Delete */
async function deleteNews(id) {
    if (!confirm("Delete this news?")) return;

    try{
        await authFetch(`/api/news/${id}`, { method: "DELETE"});
        loadNews();
    }catch(err){
        console.error("Failed to delete news:", err.message);
    }
    
}
/*end script for news page modal*/



const sidebar = document.getElementById("sidebar");
const toggles = document.querySelectorAll("#toggleSidebar");
const hamburger = document.querySelector(".hamburger");

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


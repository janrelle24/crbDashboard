// common.js — loads partials into placeholders and marks active nav link
async function loadPartial(selector, url){
    const el = document.querySelector(selector);
    if(!el) return;
    const res = await fetch(url);
    el.innerHTML = await res.text();
}
async function loadLayout(){
    
    await loadPartial('#header-placeholder', 'partials/header.html');
    await loadPartial('#nav-placeholder', 'partials/nav.html');
    await loadPartial('#footer-placeholder', 'partials/footer.html');
    
    initSidebar();
    highlightActiveNav();
    initLogout();
}

function highlightActiveNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    const name = path.split('.')[0];

    const navLink = document.querySelector(`.nav-link[data-nav="${name}"]`);
    if (navLink) navLink.classList.add('active');
}
//function handles logout
function initLogout(){
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn){
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to log out?")) {
                localStorage.removeItem("token");
                window.location.href = "/login.html";
            }
        });
    }else{
        console.warn("Logout button not found");
    }
}

loadLayout();


function authHeaders(extra = {}) {
    const token = localStorage.getItem("token");
    return {
        Authorization: "Bearer " + localStorage.getItem("token"),
        ...extra
    };
}
async function safeFetch(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        window.location.href = "/login.html";
    }
    return res;
}
// Check login status on protected pages
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;

    // Don't check token on login page itself
    if (currentPage.includes("login")) return;

    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("No token found — redirecting to login page.");
        window.location.href = "/login.html";
    }
});


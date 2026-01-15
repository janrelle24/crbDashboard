function authHeaders(extra = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    return {
        ...extra,
        Authorization: "Bearer " + token
    };
}


async function authFetch(url, options = {}){
    const token = localStorage.getItem("token");

    // If no token, stop early
    if (!token) {
        window.location.href = "login.html";
        throw new Error("No auth token found. Please login.");
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        throw new Error("Session expired");
    }
    
    return res;

}
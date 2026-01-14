//login
const loginForm = document.getElementById("loginForm");
const errorText = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) =>{
    e.preventDefault();
    errorText.textContent = ""

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try{
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorText.textContent = data.message || "Invalid credentials";
            return;
        }

        localStorage.setItem("token", data.token);
        window.location.href = "index.html";

    }catch(err){
        errorText.textContent = "Server error";
    }
});

//register
const registerForm = document.getElementById("registerForm");
const registerError = document.getElementById("registerError");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerError.textContent = "";

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("RegConfirmPassword").value.trim();

    // basic validation
    if (password.length < 10) {
        registerError.textContent = "Password must be at least 10 characters";
        return;
    }

    if (password !== confirmPassword) {
        registerError.textContent = "Passwords do not match";
        return;
    }

    try{
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            registerError.textContent = data.message || "Registration failed";
            return;
        }

        window.location.href = "index.html";

    }catch(err){
        registerError.textContent = "Server error";
    }
});
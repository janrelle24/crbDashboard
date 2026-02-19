/*start script for sidebar hamburger btn*/
document.addEventListener("DOMContentLoaded", initSidebar);
function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.querySelector(".hamburger");
    const toggles = document.querySelectorAll(".toggle-sidebar");

    if (!sidebar || !hamburger) return;

    toggles.forEach(btn => {
        btn.addEventListener("click", () => {
            sidebar.classList.toggle("closed");
            
            hamburger.style.display = sidebar.classList.contains("closed")
                ? "block"
                : "none";
        });
    });
}
/*end script for sidebar hamburger btn*/
/*start dashboard counts */
document.addEventListener("DOMContentLoaded", loadDashboardCounts);

async function loadDashboardCounts(){
    const newsCount = document.getElementById("newsCount");
    const eventsCount = document.getElementById("eventsCount");
    const liveCount = document.getElementById("liveCount");
    const ordinanceCount = document.getElementById("ordinanceCount");
    const membersCount = document.getElementById("membersCount");

    // Not dashboard page → stop safely
    if (!newsCount && !eventsCount && !liveCount && !ordinanceCount && !membersCount) {
        console.warn("Dashboard counters not found. Skipping loadDashboardCounts.");
        return;
    }

    try{
        const [
            newsRes,
            eventsRes,
            liveRes,
            ordinanceRes,
            membersRes
        ] = await Promise.all([
            authFetch("/api/news/count"),
            authFetch("/api/events/count"),
            authFetch("/api/live/count"),
            authFetch("/api/ordinance/count"),
            authFetch("/api/members/count")
        ]);

        if (![newsRes, eventsRes, liveRes, ordinanceRes, membersRes].every(r => r.ok)) {
            throw new Error("One or more count requests failed");
        }

        const news = await newsRes.json();
        const events = await eventsRes.json();
        const live = await liveRes.json();
        const ordinance = await ordinanceRes.json();
        const members = await membersRes.json();

        if (newsCount) newsCount.textContent = news.count ?? 0;
        if (eventsCount) eventsCount.textContent = events.count ?? 0;
        if (liveCount) liveCount.textContent = live.count ?? 0;
        if (ordinanceCount) ordinanceCount.textContent = ordinance.count ?? 0;
        if (membersCount) membersCount.textContent = members.count ?? 0;

    }catch(err){
        console.error("Failed to load dashboard counts", err);
    }
}
/*end dashboard counts */
/**start redirect to pages */
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".quick-actions button");
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.dataset.page;
            window.location.href = `${page}.html?openModal=true`;
        });
    });
});


/**end redirect to pages */
/**recent activities */
async function loadRecentActivity() {
    const list = document.getElementById("recentActivityList");
    if (!list) return;

    list.innerHTML = "<li>Loading...</li>";

    try {
        const res = await authFetch("/api/recent-activity");

        if(!res.ok){
            throw new Error("Unauthorized or failed to load recent activity");
        }
        const activities = await res.json();

        list.innerHTML = ""; // Clear loading

        if (!Array.isArray(activities) || activities.length === 0) {
            list.innerHTML = "<li>No recent activity</li>";
            return;
        }

        activities.forEach(act => {
            const li = document.createElement("li");

            switch(act.type) {
                case "news": li.textContent = `📰 ${act.message}`; break;
                case "event": li.textContent = `📅 ${act.message}`; break;
                case "live": li.textContent = `📡 ${act.message}`; break;
                case "ordinance": li.textContent = `📜 ${act.message}`; break;
                case "members": li.textContent = `👥 ${act.message}`; break;
                default: li.textContent = act.message;
            }

            list.appendChild(li);
        });

    } catch (err) {
        console.error("Failed to load recent activity", err);
        list.innerHTML = "<li>Failed to load recent activity</li>";
    }
}
// Decode JWT to extract username
function getUsernameFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.username || payload.user || "Administrator";
    } catch {
        return "Administrator";
    }
}
//Display logged-in username
document.addEventListener("DOMContentLoaded", () => {
    const welcomeText = document.getElementById("welcomeText");
    const username = getUsernameFromToken();
    if (welcomeText && username) {
        welcomeText.textContent = `Welcome, ${username}`;
    }
});

document.addEventListener("DOMContentLoaded", loadRecentActivity);











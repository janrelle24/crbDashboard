/*start script for sidebar hamburger btn*/
function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.querySelector(".hamburger");
    const toggles = document.querySelectorAll(".toggle-sidebar");

    if (!sidebar || !hamburger) return;

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
}
/*end script for sidebar hamburger btn*/
/*start dashboard counts */
document.addEventListener("DOMContentLoaded", loadDashboardCounts);

async function loadDashboardCounts(){
    try{
        const [
            newsRes,
            eventsRes,
            liveRes,
            ordinanceRes,
            membersRes
        ] = await Promise.all([
            fetch("/api/news/count", { headers: authHeaders() }),
            fetch("/api/events/count", { headers: authHeaders() }),
            fetch("/api/live/count", { headers: authHeaders() }),
            fetch("/api/ordinance/count", { headers: authHeaders() }),
            fetch("/api/members/count", { headers: authHeaders() })
        ]);

        if (!newsRes.ok || !eventsRes.ok || !liveRes.ok || !ordinanceRes.ok || !membersRes.ok) {
            console.error("One or more count requests failed.");
            return;
        }

        const news = await newsRes.json();
        const events = await eventsRes.json();
        const live = await liveRes.json();
        const ordinance = await ordinanceRes.json();
        const members = await membersRes.json();

        document.getElementById("newsCount").textContent = news.count ?? 0;
        document.getElementById("eventsCount").textContent = events.count ?? 0;
        document.getElementById("liveCount").textContent = live.count ?? 0;
        document.getElementById("ordinanceCount").textContent = ordinance.count ?? 0;
        document.getElementById("membersCount").textContent = members.count ?? 0;

    }catch(err){
        console.error("Failed to load dashboard counts", err);
    }
}
/*end dashboard counts */
/**start redirect to pages */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".quick-actions button").forEach(button => {
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
        const res = await fetch("/api/recent-activity", { headers: authHeaders() });

        if(!res.ok){
            throw new Error("Unauthorized or failed to load recent activity");
        }
        const activities = await res.json();

        list.innerHTML = ""; // Clear loading

        if (!activities.length) {
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











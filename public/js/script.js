/*start script for sidebar hamburger btn*/
function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.querySelector(".hamburger");
    const toggles = document.querySelectorAll("#toggleSidebar");

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
            fetch("/api/news/count"),
            fetch("/api/events/count"),
            fetch("/api/live/count"),
            fetch("/api/ordinance/count"),
            fetch("/api/members/count")
        ]);

        const news = await newsRes.json();
        const events = await eventsRes.json();
        const live = await liveRes.json();
        const ordinance = await ordinanceRes.json();
        const members = await membersRes.json();

        document.getElementById("newsCount").textContent = news.count;
        document.getElementById("eventsCount").textContent = events.count;
        document.getElementById("liveCount").textContent = live.count;
        document.getElementById("ordinanceCount").textContent = ordinance.count;
        document.getElementById("membersCount").textContent = members.count;

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
    list.innerHTML = "<li>Loading...</li>";

    try {
        const res = await fetch("/api/recent-activity");
        const activities = await res.json();

        list.innerHTML = ""; // Clear loading

        activities.forEach(act => {
            const li = document.createElement("li");

            switch(act.type) {
                case "news": li.textContent = `📰 ${act.message}`; break;
                case "event": li.textContent = `📅 ${act.message}`; break;
                case "live": li.textContent = `📡 ${act.message}`; break;
                case "ordinance": li.textContent = `📜 ${act.message}`; break;
                case "member": li.textContent = `👥 ${act.message}`; break;
                default: li.textContent = act.message;
            }

            list.appendChild(li);
        });

        if (activities.length === 0) {
            list.innerHTML = "<li>No recent activity</li>";
        }
    } catch (err) {
        console.error("Failed to load recent activity", err);
        list.innerHTML = "<li>Failed to load recent activity</li>";
    }
}

document.addEventListener("DOMContentLoaded", loadRecentActivity);











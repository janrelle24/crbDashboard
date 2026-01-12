/* start script for events */
document.addEventListener('DOMContentLoaded', function(){
    console.log("DOMContentLoaded event fired");

    const monthYearEvents = document.getElementById("month-year-events");
    const daysContainerEvents = document.getElementById("daysEvents");
    const leftBtnEvents = document.getElementById("angle-left-events");
    const rightBtnEvents = document.getElementById("angle-right-events");
    const prevYearEvents = document.getElementById("prev-events");
    const nextYearEvents = document.getElementById("next-events");

    const eventsModal = document.getElementById("eventsModal");
    const closeEventsModalBtns = document.querySelectorAll(".close-events-modal");
    const eventsTableBody = document.getElementById("eventsTableBody");
    const eventsForm = document.getElementById("eventsForm");
    const eventsModalTitle = document.getElementById("eventsModalTitle");

    if (!monthYearEvents || !daysContainerEvents || !leftBtnEvents || !rightBtnEvents || !prevYearEvents || !nextYearEvents) {
        console.error("One or more required DOM elements are missing:", {
            monthYearEvents,
            daysContainerEvents,
            leftBtnEvents,
            rightBtnEvents,
            prevYearEvents,
            nextYearEvents
        });
        return;
    }

    console.log("All required DOM elements are present");

    const monthsEvents = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    let currentDateEvents = new Date();
    let todayEvents = new Date();

    let events = [];
    let eventDates = new Set();

    async function loadEvents() {
        try{
            const res = await fetch("/api/events");
            events = await res.json();

            //build set of event dates
            eventDates.clear();
            events.forEach(e => {
                eventDates.add(formatDateKey(e.date));
            });


            renderTable();
            renderCalendarEvents(currentDateEvents); // re-render calendar
        }catch(err){
            console.error("Failed to load events", err);
        } 
    }
    //render table
    function renderTable(){
        eventsTableBody.innerHTML = "";

        events.forEach(item => {
            eventsTableBody.innerHTML += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td>${item.place}</td>
                    <td>${item.agenda}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editEvents('${item._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="action-btn delete-btn" onclick="deleteEvents('${item._id}')"><i class="fa-solid fa-eraser"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    //save events
    eventsForm.addEventListener("submit", async e=>{
        e.preventDefault();

        const id = document.getElementById("eventsId").value;
        const title = document.getElementById("eventsTitle").value;
        const date = document.getElementById("eventsDate").value;
        const time = document.getElementById("eventsTime").value;
        const place = document.getElementById("eventsPlace").value;
        const agenda = document.getElementById("agenda").value;


        const method = id ? "PUT" : "POST";
        const url = id ? `/api/events/${id}` : "/api/events";

        try{
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, date, time, place, agenda })
            });
            eventsModal.classList.remove("show");
            eventsForm.reset();
            loadEvents();
        }catch(err){
            console.error("Failed to save event:", err);
        }
        
    });
    //cancel events
    eventsForm.addEventListener("reset", () =>{
        eventsModal.classList.remove("show");
    });
    //edit events
    function editEvents(id) {
        const item = events.find(e => e._id === id);
        if (!item) return;
    
        document.getElementById("eventsId").value = item._id;
        document.getElementById("eventsTitle").value = item.title;
        document.getElementById("eventsDate").value = item.date.split("T")[0];
        document.getElementById("eventsTime").value = item.time;
        document.getElementById("eventsPlace").value = item.place;
        document.getElementById("agenda").value = item.agenda;
    
        eventsModalTitle.textContent = "Edit Schedule";
        eventsModal.classList.add("show");
    }
    //delete events
    async function deleteEvents(id) {
        if (!confirm("Delete this events?")) return;
    
        await fetch(`/api/events/${id}`, {
            method: "DELETE"
        });
        
        loadEvents();
    }
    //render calendar
    function renderCalendarEvents(date){
        console.log("Rendering calendar for date:", date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        console.log("Year:", year, "Month:", month, "First Day:", firstDay, "Last Day:", lastDay);

        monthYearEvents.textContent = `${monthsEvents[month]} ${year}`;

        daysContainerEvents.innerHTML = '';
        // Previous month's dates
        const prevMonthsLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = prevMonthsLastDay - i + 1;
            dayDiv.classList.add('fade-events');
            daysContainerEvents.appendChild(dayDiv);
        }
        // Current month's dates
        for (let i = 1; i <= lastDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;

            const dateKey = formatDateKey(new Date(year, month, i));

            //highlight today
            if (i === todayEvents.getDate() && month === todayEvents.getMonth() && year === todayEvents.getFullYear()) {
                dayDiv.classList.add('today-events');
            }
            //  ADD DOT IF EVENT EXISTS
            if (eventDates.has(dateKey)) {
                const dot = document.createElement("span");
                dot.classList.add("event-dot");
                dayDiv.appendChild(dot);
            }
            //open modal / click day
            dayDiv.addEventListener("click", () =>{
                eventsForm.reset();
                document.getElementById("eventsId").value = "";

                //format date
                const selectedDate = new Date(year, month, i);
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
                const dd = String(selectedDate.getDate()).padStart(2, "0");

                document.getElementById("eventsDate").value =  `${yyyy}-${mm}-${dd}`;

                eventsModal.classList.add("show");
            });
            daysContainerEvents.appendChild(dayDiv);
        }
        // Next month's dates
        const nextMonthStartDay = (7 - (firstDay + lastDay) % 7) % 7;
        for (let i = 1; i <= nextMonthStartDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.classList.add('fade-events');
            daysContainerEvents.appendChild(dayDiv);
        }
    }
    function formatDateKey(date){
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    leftBtnEvents.addEventListener('click', function (){
        currentDateEvents.setMonth(currentDateEvents.getMonth() - 1);
        renderCalendarEvents(currentDateEvents);
    });
    rightBtnEvents.addEventListener('click', function (){
        currentDateEvents.setMonth(currentDateEvents.getMonth() + 1);
        renderCalendarEvents(currentDateEvents);
    });
    prevYearEvents.addEventListener('click', function(){
        currentDateEvents.setFullYear(currentDateEvents.getFullYear() - 1);
        renderCalendarEvents(currentDateEvents);
    });
    nextYearEvents.addEventListener('click', function(){
        currentDateEvents.setFullYear(currentDateEvents.getFullYear() + 1);
        renderCalendarEvents(currentDateEvents);
    });
    //close modal
    closeEventsModalBtns.forEach(btn =>{
        btn.onclick = () => eventsModal.classList.remove("show");
    });
    
    loadEvents();
    renderCalendarEvents(currentDateEvents);

    window.editEvents = editEvents;
    window.deleteEvents = deleteEvents;
});
/* end script for events */

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
            if (i === todayEvents.getDate() && month === todayEvents.getMonth() && year === todayEvents.getFullYear()) {
                dayDiv.classList.add('today-events');
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
    
    renderCalendarEvents(currentDateEvents);
});
/* end script for events */

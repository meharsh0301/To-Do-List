const calendarTasks = JSON.parse(localStorage.getItem("calendarTasks") || "{}");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function saveData() {
  localStorage.setItem("calendarTasks", JSON.stringify(calendarTasks));
}

function addTask(button) {
  const task = prompt("Enter your task:");
  if (!task) return;

  const ul = button.previousElementSibling;
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = () => {
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
  };

  const span = document.createElement("span");
  span.textContent = task;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => li.remove();

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  ul.appendChild(li);
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  calendar.innerHTML = "";

  const now = new Date();
  const today = new Date().toDateString();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const days = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long"
  })} ${currentYear}`;

  for (let i = 0; i < firstDay; i++) {
    const div = document.createElement("div");
    div.className = "calendar-day empty";
    calendar.appendChild(div);
  }

  for (let d = 1; d <= days; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const key = `${currentYear}-${currentMonth + 1}-${d}`;
    const isToday = date.toDateString() === today;
    const isPast = date < new Date() && !isToday;
    const hasTask = calendarTasks[key]?.length;

    const div = document.createElement("div");
    div.className = `calendar-day${isToday ? " today" : ""}${isPast ? " past" : ""}${hasTask ? " has-task" : ""}`;
    div.innerHTML = `${d}${hasTask ? '<span class="dot"></span>' : ""}`;
    div.onclick = () => {
      const existing = (calendarTasks[key] || []).join("\n");
      const tasks = prompt("Tasks for this day (new line separated):", existing);
      if (tasks !== null) {
        const lines = tasks.split("\n").filter(t => t.trim());
        calendarTasks[key] = lines;
        saveData();
        renderCalendar();
      }
    };

    calendar.appendChild(div);
  }
}

window.changeMonth = (offset) => {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
};

renderCalendar();

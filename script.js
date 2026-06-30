 function addTask() {

    let task = document.getElementById("taskInput").value;
    let date = document.getElementById("dateInput").value;
    let category = document.getElementById("categoryInput").value;

    if (task === "" || date === "") {
        alert("Please enter task and date");
        return;
    }

    let li = document.createElement("li");

    li.setAttribute("data-task", task);
    li.setAttribute("data-date", date);
    li.setAttribute("data-category", category);
    li.setAttribute("data-priority", "Medium");

    li.innerHTML = `
        <strong>${task}</strong><br>
        📅 ${date}<br>
        📂 ${category}<br>
        <span class="status pending">🟡 Pending</span><br><br>

        <button onclick="completeTask(this)">✅ Complete</button>
        <button onclick="deleteTask(this)">🗑 Delete</button>
    `;

    document.getElementById("taskList").appendChild(li);

    document.getElementById("taskInput").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("categoryInput").value = "Study";

    updateCounts();
    saveTasks();
}

function deleteTask(button) {

    button.parentElement.remove();

    updateCounts();
    saveTasks();
}

function completeTask(button) {

    let task = button.parentElement;

    task.classList.toggle("completed");

    let status = task.querySelector(".status");

    if (task.classList.contains("completed")) {

        task.style.textDecoration = "line-through";
        status.innerHTML = "🟢 Completed";
        status.classList.remove("pending");
        status.classList.add("completed-status");

    } else {

        task.style.textDecoration = "none";
        status.innerHTML = "🟡 Pending";
        status.classList.remove("completed-status");
        status.classList.add("pending");

    }

    updateCounts();
    saveTasks();
}

function updateCounts() {

    let total = document.querySelectorAll("#taskList li").length;
    let completed = document.querySelectorAll("#taskList li.completed").length;
    let pending = total - completed;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
}

function saveTasks() {

    localStorage.setItem(
        "tasks",
        document.getElementById("taskList").innerHTML
    );
}

window.onload = function () {

    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        document.getElementById("taskList").innerHTML = savedTasks;
    }

    updateCounts();
};

async function analyzeTasks() {

    let taskElements = document.querySelectorAll("#taskList li");

    if (taskElements.length === 0) {
        document.getElementById("aiResponse").innerHTML =
            "⚠️ Please add at least one task.";
        return;
    }

    let tasks = [];

    taskElements.forEach(task => {
    tasks.push({
        name: task.getAttribute("data-task"),
        date: task.getAttribute("data-date"),
        category: task.getAttribute("data-category"),
        priority: task.getAttribute("data-priority")
    });
});

    // Sort tasks by priority first, then by due date

const priorityValue = {
    "High": 1,
    "Medium": 2,
    "Low": 3
};

tasks.sort((a, b) => {

    if (priorityValue[a.priority] !== priorityValue[b.priority]) {
        return priorityValue[a.priority] - priorityValue[b.priority];
    }

    return new Date(a.date) - new Date(b.date);

});


    document.getElementById("aiResponse").innerHTML =
        "🤖 AI is analyzing your tasks...";

    setTimeout(() => {

        let message = `
        <h3>🧠 AI Task Analysis</h3>

        <b>📌 Priority Ranking</b><br><br>
        `;

        tasks.forEach((task, index) => {
            message += `
            ${index + 1}. <b>${task.name}</b><br>
            📅 ${task.date}<br>
            📂 ${task.category}<br>
            🚩 Priority: ${task.priority}<br><br>
            `;


            });

        message += `
        <br>

        <b>📅 AI Study Plan</b><br>

        • Complete the first task first.<br>
        • Spend 1-2 hours on the second task.<br>
        • Finish the remaining tasks before the deadline.<br><br>

        <hr>

        <b>⚠ Risk Level</b><br>
        🔴 Complete high-priority tasks before their deadlines.<br><br>

        <b>💡 AI Tip</b><br>
        Focus on one task at a time and finish the most urgent work first.<br><br>

        🚀 You're on track! Keep the momentum going.
        `;

        document.getElementById("aiResponse").innerHTML = message;

    }, 1500);

}
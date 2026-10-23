// ===== DATA: just an array of objects (no database) =====
let tasks = [
    {
        id: 1,
        name: "Learn JS arrays",
        description: "Practice forEach, filter and find",
        details: "1. Make an array of objects\n2. Loop with forEach\n3. Remove items with filter",
        priority: 4,
        done: false
    },
    {
        id: 2,
        name: "Finish homework",
        description: "Maths chapter 5",
        details: "Solve all the exercise questions and revise formulas.",
        priority: 2,
        done: true
    },
    {
        id: 3,
        name: "Host my projects",
        description: "Put the task manager on GitHub Pages",
        details: "Create repo, upload files, turn on Pages in settings.",
        priority: 5,
        done: true
    },
    {
        id: 4,
        name: "Buy groceries",
        description: "Milk, eggs, bread and fruits",
        details: "Check the fridge first so nothing gets bought twice.",
        priority: 3,
        done: false
    }
];

let nextId = 5; // every new task gets its own id

// the current state of the controls
let searchText = "";
let currentFilter = "all";   // all | active | done
let currentSort = "newest";

// ===== GRAB ELEMENTS =====
const main = document.querySelector(".main");
const counter = document.getElementById("counter");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const clearDoneBtn = document.getElementById("clearDone");
const addBtn = document.getElementById("add");
const model = document.getElementById("model-box");
const submitBtn = document.getElementById("addNewTask");
const cancelBtn = document.getElementById("closeModel");
const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const detailInput = document.getElementById("detailInput");
const detailView = document.getElementById("detail-view");
const detailTitle = document.getElementById("detail-title");
const detailText = document.getElementById("detail-text");

// ===== HELPERS =====

// loop 1 to 5 and fill the stars up to the priority
function createStars(priority, taskId) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
        let filled = i <= priority ? "filled" : "";
        starsHTML += `<span class="star ${filled}" data-value="${i}" data-id="${taskId}">★</span>`;
    }
    return starsHTML;
}

// stops text with < > from breaking the page
function escapeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// find one task object by its id
function getTask(id) {
    return tasks.find(t => t.id === Number(id));
}

// count how many tasks are done using a loop
function updateCounter() {
    let doneCount = 0;
    tasks.forEach(task => {
        if (task.done) {
            doneCount++;
        }
    });
    counter.textContent = doneCount + " / " + tasks.length + " done";
}

function closeAddPopup() {
    model.style.display = "none";
    nameInput.value = "";
    descInput.value = "";
    detailInput.value = "";
}

// ===== GET THE TASKS THAT SHOULD BE SHOWN =====
// 1) filter by tab  2) filter by search  3) sort
function getVisibleTasks() {
    let list = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true; // "all"
    });

    const text = searchText.toLowerCase();
    list = list.filter(task => {
        return task.name.toLowerCase().includes(text) ||
               task.description.toLowerCase().includes(text);
    });

    // sort a copy so the original order stays safe
    list = [...list];
    if (currentSort === "newest") {
        list.sort((a, b) => b.id - a.id);
    } else if (currentSort === "oldest") {
        list.sort((a, b) => a.id - b.id);
    } else if (currentSort === "priority-high") {
        list.sort((a, b) => b.priority - a.priority);
    } else if (currentSort === "priority-low") {
        list.sort((a, b) => a.priority - b.priority);
    } else if (currentSort === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
}

// ===== SHOW TASKS: loop over the visible array, build one row for each =====
function showTasks() {
    main.innerHTML = "";
    updateCounter();

    const visible = getVisibleTasks();

    if (visible.length === 0) {
        const message = tasks.length === 0
            ? "No tasks yet. Click + to add one!"
            : "No tasks match your search or filter.";
        main.innerHTML = `<div class="empty">${message}</div>`;
        return;
    }

    visible.forEach(task => {
        const box = document.createElement("div");
        box.classList.add("task-box");
        if (task.done) {
            box.classList.add("done");
        }
        box.dataset.id = task.id;

        box.innerHTML = `
            <button class="check" data-id="${task.id}" title="Mark done">${task.done ? "✓" : ""}</button>
            <div class="task-info">
                <div class="task-name">${escapeHTML(task.name)}</div>
                <div class="task-desc">${escapeHTML(task.description)}</div>
            </div>
            <div class="rating">
                ${createStars(task.priority, task.id)}
                <span class="rating-value">Priority ${task.priority}/5</span>
            </div>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;

        main.appendChild(box);
    });
}

// ===== SEARCH, FILTER, SORT, CLEAR =====
searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim();
    showTasks();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;

        // move the "active" look to the clicked button
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        showTasks();
    });
});

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    showTasks();
});

clearDoneBtn.addEventListener("click", () => {
    const doneCount = tasks.filter(t => t.done).length;
    if (doneCount === 0) {
        alert("No completed tasks to clear.");
        return;
    }
    if (confirm("Remove " + doneCount + " completed task(s)?")) {
        tasks = tasks.filter(t => !t.done);
        showTasks();
    }
});

// ===== ADD TASK =====
addBtn.addEventListener("click", () => {
    model.style.display = "flex";
    nameInput.focus();
});

cancelBtn.addEventListener("click", closeAddPopup);

submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const details = detailInput.value.trim();

    if (!name || !description || !details) {
        alert("Fill all fields");
        return;
    }

    // build a new object and push it into the array
    const newTask = {
        id: nextId,
        name: name,
        description: description,
        details: details,
        priority: 1,
        done: false
    };
    nextId++;
    tasks.push(newTask);

    closeAddPopup();
    showTasks();
});

// ===== CLICKS ON THE ROWS (one listener handles everything) =====
main.addEventListener("click", (e) => {
    const target = e.target;

    // star clicked -> change priority
    if (target.classList.contains("star")) {
        getTask(target.dataset.id).priority = Number(target.dataset.value);
        showTasks();
        return;
    }

    // tick button clicked -> flip done
    if (target.classList.contains("check")) {
        const task = getTask(target.dataset.id);
        task.done = !task.done;
        showTasks();
        return;
    }

    // delete clicked -> keep every task except this one
    if (target.classList.contains("delete-btn")) {
        const id = Number(target.dataset.id);
        tasks = tasks.filter(t => t.id !== id);
        showTasks();
        return;
    }

    // anywhere else on a row -> open detail view
    const clickedBox = target.closest(".task-box");
    if (clickedBox) {
        const task = getTask(clickedBox.dataset.id);
        detailTitle.textContent = task.name;
        detailText.textContent = task.details;
        detailView.style.display = "flex";
    }
});

// click the dark background to close a popup
detailView.addEventListener("click", (e) => {
    if (e.target === detailView) {
        detailView.style.display = "none";
    }
});

model.addEventListener("click", (e) => {
    if (e.target === model) {
        closeAddPopup();
    }
});

// Escape key closes any popup
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        detailView.style.display = "none";
        closeAddPopup();
    }
});

// first draw when the page loads
showTasks();

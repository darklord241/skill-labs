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
    }
];

let nextId = 3; // used to give every new task its own id

// ===== GRAB ELEMENTS =====
const main = document.querySelector(".main");
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

// ===== STARS: loop 1 to 5 and fill stars up to the priority =====
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

// ===== SHOW TASKS: loop over the array and build a card for each =====
function showTasks() {
    main.innerHTML = "";

    if (tasks.length === 0) {
        main.innerHTML = `<div class="empty">No tasks yet. Click + to add one!</div>`;
        return;
    }

    tasks.forEach(task => {
        const box = document.createElement("div");
        box.classList.add("task-box");
        if (task.done) {
            box.classList.add("done");
        }
        box.dataset.id = task.id;

        box.innerHTML = `
            <div class="task-name">${escapeHTML(task.name)}</div>
            <div class="task-desc">${escapeHTML(task.description)}</div>
            <div class="rating">
                ${createStars(task.priority, task.id)}
                <span class="rating-value">Priority ${task.priority}/5</span>
            </div>
            <div class="card-buttons">
                <button class="done-btn" data-id="${task.id}">${task.done ? "Undo" : "Done"}</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;

        main.appendChild(box);
    });
}

// ===== ADD TASK =====
addBtn.addEventListener("click", () => {
    model.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
    model.style.display = "none";
    nameInput.value = "";
    descInput.value = "";
    detailInput.value = "";
});

submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const details = detailInput.value.trim();

    if (!name || !description || !details) {
        alert("Fill all fields");
        return;
    }

    // a new object pushed into the array
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

    model.style.display = "none";
    nameInput.value = "";
    descInput.value = "";
    detailInput.value = "";

    showTasks();
});

// ===== CLICKS ON THE CARDS (one listener handles everything) =====
main.addEventListener("click", (e) => {
    const target = e.target;

    // star clicked -> change priority
    if (target.classList.contains("star")) {
        const id = Number(target.dataset.id);
        const task = tasks.find(t => t.id === id);
        task.priority = Number(target.dataset.value);
        showTasks();
        return;
    }

    // done / undo clicked -> flip done
    if (target.classList.contains("done-btn")) {
        const id = Number(target.dataset.id);
        const task = tasks.find(t => t.id === id);
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

    // anywhere else on a card -> open detail view
    const clickedBox = target.closest(".task-box");
    if (clickedBox) {
        const id = Number(clickedBox.dataset.id);
        const task = tasks.find(t => t.id === id);
        detailTitle.textContent = task.name;
        detailText.textContent = task.details;
        detailView.style.display = "flex";
    }
});

// click the dark background to close the detail view
detailView.addEventListener("click", (e) => {
    if (e.target === detailView) {
        detailView.style.display = "none";
    }
});

// first draw when the page loads
showTasks();

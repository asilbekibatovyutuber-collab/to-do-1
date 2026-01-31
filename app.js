lucide.createIcons();

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('pro_todo_v3')) || [];

// Vaqtni olish funksiyasi (Sana + Soat)
function getFormattedDate() {
    const now = new Date();
    const d = now.getDate().toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const h = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    return `${d}.${m} | ${h}:${min}`;
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
}

function render() {
    list.innerHTML = "";
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-left ${todo.completed ? 'completed' : ''}" onclick="toggleTask(${index})">
                <i data-lucide="${todo.completed ? 'check-circle' : 'circle'}" size="20"></i>
                <div class="task-content">
                    <span class="task-text">${todo.text}</span>
                    <span class="task-time"><i data-lucide="clock" size="10"></i> ${todo.time}</span>
                </div>
            </div>
            <div class="actions">
                <i data-lucide="edit-3" size="18" class="edit-btn" onclick="editTask(event, ${index})"></i>
                <i data-lucide="trash-2" size="18" class="delete-btn" onclick="deleteTask(event, ${index})"></i>
            </div>
        `;
        list.appendChild(li);
    });
    lucide.createIcons();
    updateStats();
    localStorage.setItem('pro_todo_v3', JSON.stringify(todos));
}

addBtn.onclick = () => {
    const val = input.value.trim();
    if (val) {
        todos.unshift({ 
            text: val, 
            completed: false, 
            time: getFormattedDate() // Yaratilgan vaqti
        });
        input.value = "";
        render();
    }
};

window.editTask = (event, index) => {
    event.stopPropagation();
    const li = event.target.closest('li');
    const currentText = todos[index].text;
    
    li.innerHTML = `
        <input type="text" class="edit-input" id="editing-${index}" value="${currentText}">
        <div class="actions">
            <i data-lucide="check" size="20" onclick="saveEdit(${index})" style="color:#4ade80; cursor:pointer"></i>
        </div>
    `;
    lucide.createIcons();
    const inp = document.getElementById(`editing-${index}`);
    inp.focus();
    inp.onkeypress = (e) => { if(e.key === 'Enter') saveEdit(index); };
};

window.saveEdit = (index) => {
    const newVal = document.getElementById(`editing-${index}`).value.trim();
    if (newVal) {
        todos[index].text = newVal;
        render();
    }
};

window.deleteTask = (event, index) => {
    event.stopPropagation();
    todos.splice(index, 1);
    render();
};

window.toggleTask = (index) => {
    todos[index].completed = !todos[index].completed;
    render();
};

input.onkeypress = (e) => { if(e.key === 'Enter') addBtn.onclick(); };

render();
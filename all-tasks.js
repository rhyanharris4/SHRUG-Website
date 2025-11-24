import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const taskListContainer = document.querySelector('.task-list');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const q = query(collection(db, 'users', user.uid, 'tasks'), orderBy('due', 'asc'));
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!tasks.length) {
      taskListContainer.innerHTML = '<p>No tasks yet. Add one!</p>';
      return;
    }

    taskListContainer.innerHTML = '';
    tasks.forEach((task) => {
      const taskItem = document.createElement('div');
      taskItem.className = 'task-item';
      const dueText = task.due || 'No date';

      taskItem.innerHTML = `
        <div class="task-main">
          <span class="task-title">${escapeHtml(task.title)}</span>
          <div class="task-actions">
            <button class="task-menu" onclick="toggleTaskMenu(this)" aria-label="Open task menu">⋮</button>
            <span class="task-date">Due: ${escapeHtml(dueText)}</span>
            <div class="task-dropdown">
              <button onclick="markCompleted('${task.id}')">Mark Completed</button>
              <button onclick="editTask('${task.id}')">Edit Task</button>
              <button onclick="deleteTask('${task.id}')">Delete Task</button>
            </div>
          </div>
        </div>
        <div class="task-sub">
          <span class="task-desc">${escapeHtml(task.desc || '')}</span>
          <span class="task-class">${escapeHtml(task.className || '')}</span>
        </div>
      `;
      taskListContainer.appendChild(taskItem);
    });

  } catch (err) {
    console.error(err);
    taskListContainer.innerHTML = '<p>Error loading tasks.</p>';
  }
});

//Edit task option
window.editTask = function(docId) {
  window.location.href = `edit-task.html?id=${docId}`;
};

//Delete task option
window.deleteTask = async function(docId) {
  if (!confirm('Delete this task?')) return;
  try {
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', docId));
    location.reload();
  } catch (err) {
    console.error(err);
    alert('Error deleting task.');
  }
};

//Mark as complete option
window.markCompleted = async function(docId) {
  if (!confirm('Mark this task as completed?')) return;
  try {
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', docId));
    location.reload();
  } catch (err) {
    console.error(err);
    alert('Error marking completed.');
  }
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (s) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}

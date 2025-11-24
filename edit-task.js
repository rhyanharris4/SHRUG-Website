import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const docId = params.get('id');

const form = document.getElementById('edit-task-form');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  if (!docId) {
    alert('Missing task id.');
    window.location.href = 'all-tasks.html';
    return;
  }

  //load doc
  try {
    const taskRef = doc(db, 'users', user.uid, 'tasks', docId);
    const snap = await getDoc(taskRef);
    if (!snap.exists()) {
      alert('Task not found.');
      window.location.href = 'all-tasks.html';
      return;
    }
    const task = snap.data();
    document.getElementById('task-title').value = task.title || '';
    document.getElementById('task-desc').value = task.desc || '';
    document.getElementById('task-class').value = task.className || '';
    document.getElementById('task-date').value = task.due || '';
  } catch (err) {
    console.error(err);
    alert('Error loading task.');
    window.location.href = 'all-tasks.html';
  }
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const taskRef = doc(db, 'users', auth.currentUser.uid, 'tasks', docId);
      await updateDoc(taskRef, {
        title: document.getElementById('task-title').value.trim(),
        desc: document.getElementById('task-desc').value.trim(),
        className: document.getElementById('task-class').value.trim(),
        due: document.getElementById('task-date').value
      });
      alert('Task updated successfully!');
      window.location.href = 'all-tasks.html';
    } catch (err) {
      console.error(err);
      alert('Error updating task.');
    }
  });
}

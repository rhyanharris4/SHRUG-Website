// add-task.js (module)
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const form = document.getElementById('add-task-form');
let currentUser = null;

// ensure user is signed in
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!user) {
    // if not logged in, send to login
    window.location.href = 'login.html';
  }
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('You must be logged in.');
      return;
    }

    const title = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const className = document.getElementById('task-class').value.trim();
    const due = document.getElementById('task-date').value;

    if (!title || !className || !due) {
      alert('Please fill out the required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'tasks'), {
        title,
        desc,
        className,
        due,
        completed: false,
        createdAt: serverTimestamp()
      });

      alert('Task added successfully');
      // clear form
      form.reset();
      // go to All Tasks (or homepage) so user sees it
      window.location.href = 'all-tasks.html';
    } catch (err) {
      console.error(err);
      alert('Error adding task.');
    }
  });
}

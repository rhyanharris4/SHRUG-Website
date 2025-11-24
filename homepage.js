import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const taskList = document.getElementById('task-list');
const greetingEl = document.querySelector('.greeting');

onAuthStateChanged(auth, async (user) => {
  console.log("onAuthStateChanged triggered. user:", user);

  if (!user) {
    console.log("No user. redirecting to login.");
    window.location.href = 'login.html';
    return;
  }

  // show immediate fallback so user sees something while we fetch
  greetingEl.textContent = "Hey, loading your profile...";

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(userDocRef);
    console.log("profileSnap.exists():", profileSnap.exists());
    if (profileSnap.exists()) console.log("profile data:", profileSnap.data());

    let name = "";

    if (profileSnap.exists()) {
      const data = profileSnap.data();

      // Try several possible keys (robust)
      name =
        (data && (data.profile?.name || data.name || data.username || data.displayName)) ||
        // fallback to Firebase Auth displayName or email local-part
        user.displayName ||
        (user.email ? user.email.split('@')[0] : "") ||
        "";
    } else {
      console.warn("User document does not exist at users/" + user.uid);
      // optionally: you can create a profile doc here, or fall back to auth info
      name = user.displayName || (user.email ? user.email.split('@')[0] : "");
    }

    console.log("Resolved name:", name);

    greetingEl.textContent = name
      ? `Hey ${name}, below are your nearest upcoming tasks & deadlines!`
      : `Hey, below are your nearest upcoming tasks & deadlines!`;

  } catch (err) {
    console.error("Error loading profile:", err);
    greetingEl.textContent = "Hey, below are your nearest upcoming tasks & deadlines!";
  }

  // Load tasks (unchanged)
  try {
    const tasksQuery = query(
      collection(db, 'users', user.uid, 'tasks'),
      orderBy('due', 'asc')
    );

    const snapshot = await getDocs(tasksQuery);
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (tasks.length === 0) {
      taskList.innerHTML = "<li>No tasks yet. Add one!</li>";
      return;
    }

    const preview = tasks.slice(0, 5);
    taskList.innerHTML = "";

    preview.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <label class="preview-label">
          <input class="preview-checkbox" type="checkbox"
                 onchange="completeTaskHome('${task.id}')" />
          ${escapeHtml(task.title)}
          <span class="task-due">| Due: ${task.due || "No date"}</span>
        </label>
      `;
      taskList.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading tasks:", err);
    taskList.innerHTML = "<li>Error loading tasks.</li>";
  }
});

// Escape HTML (unchanged)
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (s) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[s]));
}

window.completeTaskHome = async function (docId) {
  try {
    if (!confirm("Mark this task as completed?")) return;

    const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js");
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', docId));
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Error completing task.");
  }
};

async function loadAffirmations() {
  const res = await fetch("affirmations.json");
  return await res.json();
}

async function initMoodPopup() {
  //Only runs affirmation popup on homepage.html
  if (!window.location.pathname.includes("homepage.html")) return;

  const moodPopup = document.getElementById("moodPopup");
  const closeMoodPopup = document.getElementById("closeMoodPopup");
  const moodChoices = document.getElementById("moodChoices");

  const affirmationPopup = document.getElementById("affirmationPopup");
  const closeAffirmationPopup = document.getElementById("closeAffirmationPopup");
  const affirmationText = document.getElementById("affirmationText");

  const affirmations = await loadAffirmations();

  const uniqueMoods = [...new Set(affirmations.map(a => a.Mood))];
  moodChoices.innerHTML = uniqueMoods.map(m => `<button class="mood-button">${m}</button>`).join("");

  //Show mood popup after homepage loads
  moodPopup.style.display = "flex";

  closeMoodPopup.onclick = () => {
    moodPopup.style.display = "none";
  };

  moodChoices.addEventListener("click", (e) => {
    if (!e.target.classList.contains("mood-button")) return;

    const mood = e.target.textContent;
    const options = affirmations.filter(a => a.Mood === mood);
    const chosen = options[Math.floor(Math.random() * options.length)];

    affirmationText.textContent = chosen.Affirmation;

    moodPopup.style.display = "none";

    affirmationPopup.style.display = "flex";
  });

  closeAffirmationPopup.onclick = () => {
    affirmationPopup.style.display = "none";
  };
}

window.addEventListener("DOMContentLoaded", initMoodPopup);

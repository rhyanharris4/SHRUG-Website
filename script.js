window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  const isOpen = sidebar.classList.contains("open");

  if (isOpen) {
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden", "true");
  } else {
    sidebar.classList.add("open");
    sidebar.setAttribute("aria-hidden", "false");
  }
};

//Task dropdown toggle
function toggleTaskMenu(button) {
  const taskActions = button.closest('.task-actions');
  if (!taskActions) return;

  const dropdownMenu = taskActions.querySelector('.task-dropdown');
  if (!dropdownMenu) return;

  //Hide other ojustpen dropdowns
  document.querySelectorAll('.task-dropdown').forEach((d) => {
    if (d !== dropdownMenu) d.style.display = 'none';
  });

  //Toggle display
  dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
}

window.toggleTaskMenu = toggleTaskMenu;

import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html";
      } catch (err) {
        console.error("Logout error:", err);
        alert("Failed to log out.");
      }
    });
  }
});
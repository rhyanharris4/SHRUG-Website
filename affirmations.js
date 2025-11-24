// Load affirmations
fetch("affirmations.json")
  .then(response => response.json())
  .then(data => {
    displayMoods(groupByMood(data));
  });

// Group by mood
function groupByMood(data) {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.Mood]) grouped[item.Mood] = [];
    grouped[item.Mood].push(item.Affirmation);
  });
  return grouped;
}

// Display moods (with arrows)
function displayMoods(moods) {
  const moodList = document.getElementById("moodList");
  moodList.innerHTML = "";

  Object.keys(moods).forEach(mood => {
    const container = document.createElement("div");
    container.className = "mood-container";

    const moodDiv = document.createElement("div");
    moodDiv.className = "mood-item";
    moodDiv.innerHTML = `${mood} <span class="arrow">▸</span>`;

    const listDiv = document.createElement("div");
    listDiv.className = "aff-affirmation-list hidden";

    // Expand/collapse mood
    moodDiv.onclick = () => toggleMood(listDiv, moodDiv, moods[mood], mood);

    container.appendChild(moodDiv);
    container.appendChild(listDiv);
    moodList.appendChild(container);
  });
}

function toggleMood(container, moodDiv, affirmations, mood) {
  const arrow = moodDiv.querySelector(".arrow");

  if (!container.classList.contains("hidden")) {
    // Collapse
    container.classList.add("hidden");
    container.innerHTML = "";
    arrow.textContent = "▸";
    return;
  }

  // Collapse ALL other moods
  document.querySelectorAll(".aff-affirmation-list").forEach(list => {
    list.classList.add("hidden");
    list.innerHTML = "";
  });
  document.querySelectorAll(".arrow").forEach(a => (a.textContent = "▸"));

  // Expand clicked mood
  container.classList.remove("hidden");
  arrow.textContent = "▾";

  // Build affirmations
  affirmations.forEach(text => {
    const truncated =
      text.length > 150 ? text.substring(0, 150) + "..." : text;

    const div = document.createElement("div");
    div.className = "affirmation-item";
    div.textContent = truncated;

    div.onclick = () => openPopup(text);

    container.appendChild(div);
  });
}

// Popup logic
function openPopup(fullText) {
  document.getElementById("modalText").textContent = fullText;
  document.getElementById("affirmationModal").style.display = "flex";
}

function closePopup() {
  document.getElementById("affirmationModal").style.display = "none";
}

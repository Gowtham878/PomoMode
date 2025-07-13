// Request Notification Permissions
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission !== "granted") {
      console.warn("Notifications denied");
    }
  });
}

let timerInterval;
let currentTime = 1500;
let currentMode = 'pomodoro';
const modeDurations = { pomodoro: 1500, short: 300, long: 900 };
const modeOrder = ['pomodoro', 'short', 'long'];
const progress = document.getElementById('progress-ring');
let currentTaskElement = null;

////////////////////////////////////////timers///////////////////////////////////////////
function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
  const seconds = (currentTime % 60).toString().padStart(2, '0');
  document.getElementById('timer').innerText = `${minutes}:${seconds}`;
  const full = modeDurations[currentMode];
  const offset = 628 - (628 * (full - currentTime)) / full;
  progress.style.strokeDashoffset = offset;
}
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      document.getElementById('timerSound').play();

      // Remove current task
      if (currentTaskElement) {
        currentTaskElement.remove();
        currentTaskElement = null;
      }

      showNotification("Timer ended! Switch your mode.");
      skipToNextMode();
    }
  }, 1000);
}
/////////////////////////////////////////////////////////////////////////////////
function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("PomoMode", {
      body: message,
      icon: "favicon.ico",
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
function toggleOptionsMenu(button) {
  const menu = button.nextElementSibling;
  // Close all other menus
  document.querySelectorAll('.task-menu').forEach(m => {
    if (m !== menu) m.classList.add('hidden');
  });
  menu.classList.toggle('hidden');
}
///////////////////////////////////////////////task operations///////////////////////////////////////////////////////
function deleteTask(btn) {
  const taskItem = btn.closest('.task-item');
  taskItem.remove();
  if (taskItem === currentTaskElement) {
    currentTaskElement = null;
  }
}
async function addTask() {
  const input = document.getElementById("task-input");
  const taskName = input.value.trim();
  if (taskName === "") return;

  const now = new Date();
  const end = new Date(now.getTime() + currentTime * 1000);
  const endTimeFormatted = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

  if (currentTaskElement) currentTaskElement.remove();

  const taskList = document.getElementById("task-list");
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";
  taskItem.innerHTML = `
    <div class="task-content">
      <span class="task-name">${taskName}</span>
      <span class="task-end">Ends at: ${endTimeFormatted}</span>
    </div>
    <div class="task-options">
      <button class="task-menu-btn" onclick="toggleOptionsMenu(this)">⋮</button>
      <div class="task-menu hidden">
        <button onclick="editTask(this)">✏️ Edit</button>
        <button onclick="deleteTask(this)">❌ Delete</button>
      </div>
    </div>
  `;
  taskList.appendChild(taskItem);
  currentTaskElement = taskItem;

  input.value = "";
  closeTaskPopup();
}
////////////////////////
function editTask(btn) {
  const taskItem = btn.closest('.task-item');
  const content = taskItem.querySelector('.task-content');
  const nameSpan = content.querySelector('.task-name');
  const endTime = content.querySelector('.task-end');

  const input = document.createElement("input");
  input.type = "text";
  input.value = nameSpan.textContent;
  input.className = "edit-input";

  const saveBtn = document.createElement("button");
  saveBtn.innerText = "✅";
  saveBtn.className = "save-btn";

  const save = () => {
    const newName = input.value.trim();
    if (newName) {
      content.innerHTML = `
        <span class="task-name">${newName}</span>
        ${endTime ? endTime.outerHTML : ""}
      `;
    }
  };

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") content.innerHTML = `
      <span class="task-name">${nameSpan.textContent}</span>
      ${endTime ? endTime.outerHTML : ""}
    `;
  });
  saveBtn.onclick = save;

  content.innerHTML = "";
  content.appendChild(input);
  content.appendChild(saveBtn);
  input.focus();
}
////////////////////////
function updateBackground() {
  const rootStyle = getComputedStyle(document.documentElement);
  document.body.style.backgroundColor = rootStyle.getPropertyValue(`--${currentMode}-bg`);
  document.getElementById('task-popup').style.background = rootStyle.getPropertyValue(`--${currentMode}-bg`);
}
//////////////////////////
function openTaskPopup() {
  document.getElementById('task-overlay').style.display = 'flex';
  document.getElementById("task-input").focus();
}
/////////////////////////
function closeTaskPopup() {
  document.getElementById('task-overlay').style.display = 'none';
}

/////////////////////////////////////////////////sounds & mode changes/////////////////////////////////////////////////
function clickSound() {
  const sound = document.getElementById('clickSound');
  sound.currentTime = 0;
  sound.play().catch(() => {});
}
///////////////////////////////
function switchMode(mode) {
  clearInterval(timerInterval);
  currentMode = mode;
  currentTime = modeDurations[mode];
  updateTimerDisplay();
  updateActiveTab();
  updateBackground();
}
////////////////////////////
function skipToNextMode() {
  const index = modeOrder.indexOf(currentMode);
  const nextIndex = (index + 1) % modeOrder.length;
  switchMode(modeOrder[nextIndex]);
}
////////////////////////////////////////////////////
function updateActiveTab() {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(currentMode + '-tab').classList.add('active');
}
/////////////////////////////////////////////////close task popup and taskmenue/////////////////////////////////////////////////
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTaskPopup();
    document.querySelectorAll('.task-menu').forEach(menu => menu.classList.add('hidden'));
  }
});
/////////////////////////// close task menue
document.addEventListener('click', (e) => {
  const isMenuBtn = e.target.closest('.task-menu-btn');
  const isMenu = e.target.closest('.task-menu');
  if (!isMenu && !isMenuBtn) {
    document.querySelectorAll('.task-menu').forEach(menu => {
      menu.classList.add('hidden');
    });
  }
});
/////////////////////////////////////////////////////////////user tab nav bar//////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const avatarBtn = document.getElementById("profileAvatar");
  const dropdown = document.getElementById("profileDropdown");
  const dropdownAvatar = document.getElementById("dropdownAvatar");
  const dropdownUsername = document.getElementById("dropdownUsername");
  const dropdownEmail = document.getElementById("dropdownEmail");
  const dropdownActions = document.getElementById("dropdownActions");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (token && user) {
    avatarBtn.src = user.profileImage;
    dropdownAvatar.src = user.profileImage;
    dropdownUsername.textContent = user.username;
    dropdownEmail.textContent = user.email;

    dropdownActions.innerHTML = "";

    const settingsBtn = document.createElement("button");
    settingsBtn.className = "profile-btn";
    settingsBtn.textContent = "⚙️ Settings";
    settingsBtn.onclick = () => window.location.href = "/settings";

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "profile-btn";
    logoutBtn.textContent = "🚪 Logout";
    logoutBtn.onclick = () => {
      localStorage.clear();
      window.location.reload();
    };

    dropdownActions.appendChild(settingsBtn);
    dropdownActions.appendChild(logoutBtn);
  } 
  else 
  {
    avatarBtn.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    dropdownAvatar.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    document.getElementById("loginBtn").addEventListener("click", () => {
      window.location.href = "/login";
    });

    document.getElementById("signupBtn").addEventListener("click", () => {
      window.location.href = "/register";
    });
  }

  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent event bubbling
    console.log("avatar ")
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-wrapper")) {
      dropdown.classList.remove("show");
    }
  });
});



updateTimerDisplay();
updateBackground();

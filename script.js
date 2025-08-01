const clockEl = document.getElementById("clock");
const timezoneSelector = document.getElementById("timezone-selector");
const regionLabel = document.getElementById("region-label");
const alarmStatus = document.getElementById("alarm-status");

let selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let alarmTime = null;
let alarmTriggered = false;

fetch("timezones.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(tz => {
      const option = document.createElement("option");
      option.value = tz.timezone;
      option.textContent = `${tz.region} (${tz.timezone})`;
      if (tz.timezone === selectedTimezone) {
        option.selected = true;
        regionLabel.textContent = option.textContent;
      }
      timezoneSelector.appendChild(option);
    });
  });

timezoneSelector.addEventListener("change", () => {
  selectedTimezone = timezoneSelector.value;
  const selectedOption = timezoneSelector.options[timezoneSelector.selectedIndex];
  regionLabel.textContent = selectedOption.text;
});

function updateClock() {
  const now = new Date();
  const options = {
    timeZone: selectedTimezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const formattedTime = new Intl.DateTimeFormat([], options).format(now);
  clockEl.textContent = formattedTime;

  if (alarmTime && formattedTime.startsWith(alarmTime) && !alarmTriggered) {
    alert(`⏰ Alarm! It's ${alarmTime}`);
    alarmStatus.textContent = "Alarm triggered!";
    triggerVibration();
    alarmTriggered = true;
    updateHistory("Alarm triggered at " + alarmTime);
  }
}

function setAlarm() {
  const input = document.getElementById("alarm-time").value;
  if (!input) {
    alarmStatus.textContent = "Please select a valid time.";
    return;
  }
  alarmTime = input;
  alarmTriggered = false;
  alarmStatus.textContent = `Alarm set for ${alarmTime}`;
  updateHistory("Alarm set for " + alarmTime);
}

function snoozeAlarm() {
  if (!alarmTime) {
    alarmStatus.textContent = "No alarm to snooze.";
    return;
  }

  const [hours, minutes] = alarmTime.split(":").map(Number);
  let newMinutes = minutes + 5;
  let newHours = hours;

  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours = (newHours + 1) % 24;
  }

  alarmTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  alarmTriggered = false;
  alarmStatus.textContent = `Snoozed! New alarm: ${alarmTime}`;
  updateHistory("Alarm snoozed to " + alarmTime);
}

function toggleMode() {
  const currentMode = document.body.classList.contains("dark") ? "dark" : "light";
  const newMode = currentMode === "dark" ? "light" : "dark";
  document.body.classList.remove(currentMode);
  document.body.classList.add(newMode);
  saveMode(newMode);
  updateHistory("Theme toggled to " + newMode);
}

function saveMode(mode) {
  fetch("history.json")
    .then(res => res.json())
    .then(data => {
      data.theme = mode;
      return saveHistory(data);
    });
}

function updateHistory(entry) {
  fetch("history.json")
    .then(res => res.json())
    .then(data => {
      data.log.push({ time: new Date().toISOString(), action: entry });
      saveHistory(data);
    });
}

function saveHistory(data) {
  // This part simulates saving for demo purposes (write to file not possible in browser)
  localStorage.setItem("history", JSON.stringify(data));
}

function loadMode() {
  const history = JSON.parse(localStorage.getItem("history"));
  if (history && history.theme) {
    document.body.classList.add(history.theme);
  } else {
    document.body.classList.add("light");
  }
}

loadMode();
setInterval(updateClock, 1000);
updateClock();
function triggerVibration() {
  if ("vibrate" in navigator) {
    navigator.vibrate(2000);
  }
}

function resetAlarm() {
  clearTimeout(alarmTimeout); // If an alarm timeout exists
  alarmTime = null;
  document.getElementById('alarm-time').value = '';
  document.getElementById('alarm-status').innerText = 'Alarm reset';
  console.log("Alarm reset");
}

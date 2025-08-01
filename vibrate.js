function triggerVibration() {
  if ("vibrate" in navigator)
    navigator.vibrate([500, 200, 500]);
}

function updateClock() {
  const now = new Date();
  const options = { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = now.toLocaleTimeString('en-US', options);
  document.getElementById('clock').innerText = timeString;
}
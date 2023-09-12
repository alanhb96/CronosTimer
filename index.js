//Watch
function updateTime() {
    var currentTime = new Date()
  
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
  
    hours = (hours < 10 ? "0" : "") + hours
    minutes = (minutes < 10 ? "0" : "") + minutes
    seconds = (seconds < 10 ? "0" : "") + seconds
  
    var timeString = hours + ":" + minutes + ":" + seconds
    document.getElementById("clock").innerHTML = timeString
}

setInterval(updateTime, 1000)

//Timer 

let timer
let timerDurationMinutes
let timerRunning = false
let timerPaused = false
let timeRemaining
let alarmAudio = document.getElementById("alarmAudio")

document.getElementById("startButton").addEventListener("click", startTimer)
document.getElementById("pauseButton").addEventListener("click", pauseTimer)
document.getElementById("resumeButton").addEventListener("click", resumeTimer)
document.getElementById("stopButton").addEventListener("click", stopTimer)

function startTimer() {
  if (timerRunning) {
    return // Timer is already running
  }

  const durationInput = document.getElementById("duration")
  timerDurationMinutes = parseInt(durationInput.value, 10)

  if (isNaN(timerDurationMinutes) || timerDurationMinutes <= 0) {
    alert("Please enter a valid positive number for the duration.")
    return
  }

  timerRunning = true
  durationInput.disabled = true
  document.getElementById("startButton").disabled = true
  document.getElementById("pauseButton").disabled = false
  document.getElementById("stopButton").disabled = false

  if (!timerPaused) {
    timeRemaining = timerDurationMinutes * 60 // Convert minutes to seconds
  }

  updateTimerDisplay()

  timer = setInterval(function () {
    if (timeRemaining <= 0) {
      stopTimer()
      alarmAudio.play()
      document.getElementById("timerDisplay").textContent = "Timer expired!"
    } else {
      timeRemaining--
      updateTimerDisplay()
    }
  }, 1000) // Update every second
}

function pauseTimer() {
  if (timerRunning && !timerPaused) {
    clearInterval(timer)
    timerPaused = true
    document.getElementById("pauseButton").disabled = true
    document.getElementById("resumeButton").disabled = false
  }
}

function resumeTimer() {
  if (timerRunning && timerPaused) {
    timerPaused = false
    document.getElementById("pauseButton").disabled = false
    document.getElementById("resumeButton").disabled = true

    // Restart the timer with the remaining time
    timer = setInterval(function () {
      if (timeRemaining <= 0) {
        stopTimer()
        alarmAudio.play()
        document.getElementById("timerDisplay").textContent = "Timer expired!"
      } else {
        timeRemaining--
        updateTimerDisplay()
      }
    }, 1000)

  }
}

function stopTimer() {
  clearInterval(timer)
  timerRunning = false
  timerPaused = false

  const durationInput = document.getElementById("duration")
  durationInput.disabled = false
  document.getElementById("startButton").disabled = false
  document.getElementById("pauseButton").disabled = true
  document.getElementById("resumeButton").disabled = true
  document.getElementById("stopButton").disabled = true
  document.getElementById("timerDisplay").textContent = ""
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  document.getElementById("timerDisplay").textContent = `Time remaining: ${minutes} minutes ${seconds} seconds`
}

//Chronometer

let stopwatchInterval;
let stopwatchRunning = false;
let startTime;
let lapStartTime;
let lapCount = 1; // Initialize lap count

document.getElementById("startButtonCh").addEventListener("click", toggleStopwatch);
document.getElementById("stopButtonCh").addEventListener("click", stopStopwatch);
document.getElementById("lapButton").addEventListener("click", recordLap);
document.getElementById("resetButton").addEventListener("click", resetStopwatch);

function toggleStopwatch() {
  if (!stopwatchRunning) {
    // Start a new stopwatch counter
    if (startTime === undefined) {
      startTime = Date.now() - (lapStartTime || 0);
    }
    lapStartTime = Date.now();

    lapCount = 1; // Reset lap count

    document.getElementById("startButtonCh").textContent = "Stop";
    document.getElementById("lapButton").disabled = false;
    document.getElementById("resetButton").disabled = true;

    stopwatchRunning = true;

    stopwatchInterval = setInterval(function () {
      updateStopwatchDisplay();
    }, 10); // Update every 10 milliseconds (for better accuracy)
  } else {
    // Stop the current stopwatch
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;

    document.getElementById("startButtonCh").textContent = "Resume";
    document.getElementById("lapButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    updateStopwatchDisplay();
  }
}

function stopStopwatch() {
  if (stopwatchRunning) {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;

    document.getElementById("startButtonCh").textContent = "Resume";
    document.getElementById("lapButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    updateStopwatchDisplay();
  }
}

function recordLap() {
  if (stopwatchRunning) {
    const currentTime = Date.now();
    const lapTime = currentTime - lapStartTime;
    lapStartTime = currentTime;

    const lapItem = document.createElement("li");
    lapItem.textContent = `Lap ${lapCount}: ${formatTime(lapTime)}`;
    document.getElementById("lapList").appendChild(lapItem);

    lapCount++;
  }
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
  startTime = undefined;
  lapStartTime = undefined;
  lapCount = 1;
  clearLapList();

  document.getElementById("startButtonCh").textContent = "Start";
  document.getElementById("lapButton").disabled = true;
  document.getElementById("resetButton").disabled = true;

  updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
  if (startTime !== undefined) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    document.getElementById("stopwatchDisplay").textContent = formatTime(elapsedTime);
  } else {
    document.getElementById("stopwatchDisplay").textContent = "00:00.000";
  }
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function clearLapList() {
  const lapList = document.getElementById("lapList");
  lapList.innerHTML = '';
}
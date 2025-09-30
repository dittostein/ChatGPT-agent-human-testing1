const TOTAL_CELLS = 16;

const landingView = document.getElementById("landing-view");
const specialView = document.getElementById("special-view");
const specialNumber = document.getElementById("special-number");
const grid = document.getElementById("puzzle-grid");
const agentEnterButton = document.getElementById("agent-enter");
const humanEnterButton = document.getElementById("human-enter");
const retryButton = document.getElementById("retry-button");
const statusLabel = document.getElementById("agent-status");

const params = new URLSearchParams(window.location.search);
const view = params.get("view");

if (view === "agent" || view === "human") {
  showSpecialView(view);
} else {
  showLandingView();
}

function showSpecialView(activeView) {
  landingView.classList.add("hidden");
  specialView.classList.remove("hidden");
  specialNumber.textContent = activeView === "agent" ? "314159" : "271828";
  document.title = "Special Number";
}

function showLandingView() {
  specialView.classList.add("hidden");
  landingView.classList.remove("hidden");
  document.title = "Dual Access Challenge";
  initializePuzzle();
}

function initializePuzzle() {
  const numbers = shuffle(Array.from({ length: TOTAL_CELLS }, (_, index) => index + 1));
  let nextExpected = 1;
  let puzzleLocked = false;
  resetAgentState();
  renderGrid(numbers, handleCellClick);
  retryButton.classList.remove("visible");

  function handleCellClick(event) {
    if (puzzleLocked) {
      return;
    }

    const cell = event.currentTarget;
    const value = Number(cell.dataset.value);

    if (cell.classList.contains("correct")) {
      return;
    }

    if (value === nextExpected) {
      cell.classList.add("correct");
      cell.setAttribute("aria-pressed", "true");
      nextExpected += 1;

      if (nextExpected > TOTAL_CELLS) {
        completePuzzle();
      }
    } else {
      cell.classList.add("incorrect");
      puzzleLocked = true;
      retryButton.classList.add("visible");
    }
  }

  retryButton.onclick = () => {
    if (!retryButton.classList.contains("visible")) {
      return;
    }
    initializePuzzle();
  };

  agentEnterButton.onclick = () => {
    if (agentEnterButton.disabled) {
      return;
    }
    window.location.href = "/?view=agent";
  };

  humanEnterButton.onclick = () => {
    window.location.href = "/?view=human";
  };

  function completePuzzle() {
    setAgentButtonState(true);
    statusLabel.textContent = "Success!";
  }

  function resetAgentState() {
    setAgentButtonState(false);
    statusLabel.textContent = "";
  }

  function setAgentButtonState(enabled) {
    agentEnterButton.disabled = !enabled;
    agentEnterButton.setAttribute("aria-disabled", String(!enabled));
    agentEnterButton.classList.toggle("disabled", !enabled);
  }
}

function renderGrid(numbers, onClick) {
  grid.innerHTML = "";

  numbers.forEach((value) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.value = String(value);
    cell.textContent = value;
    cell.addEventListener("click", onClick);
    grid.appendChild(cell);
  });
}

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

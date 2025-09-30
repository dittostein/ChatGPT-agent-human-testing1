(function () {
  const grid = document.getElementById("puzzle-grid");
  const agentButton = document.getElementById("agent-enter");
  const humanButton = document.getElementById("human-enter");
  const retryButton = document.getElementById("retry-btn");
  const successText = document.getElementById("agent-success");
  const mainView = document.getElementById("main-view");
  const specialView = document.getElementById("special-view");
  const specialNumber = document.getElementById("special-number");
  const returnButton = document.getElementById("return-btn");

  let expectedNext = 1;
  let puzzleFailed = false;
  let puzzleComplete = false;

  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");

  if (view === "special") {
    showSpecialView(params.get("role"));
  } else {
    showMainView();
    initializePuzzle();
  }

  function showMainView() {
    mainView.classList.remove("hidden");
    specialView.classList.add("hidden");
  }

  function showSpecialView(role) {
    mainView.classList.add("hidden");
    specialView.classList.remove("hidden");

    const number = role === "agent" ? "314159" : "271828";
    specialNumber.textContent = number;
  }

  function initializePuzzle() {
    expectedNext = 1;
    puzzleFailed = false;
    puzzleComplete = false;
    successText.classList.add("hidden");
    agentButton.disabled = true;
    retryButton.classList.add("hidden");
    clearGrid();
    renderGrid();
  }

  function clearGrid() {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
  }

  function renderGrid() {
    const values = shuffle(Array.from({ length: 16 }, (_, i) => i + 1));
    values.forEach((value) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "puzzle-cell";
      cell.dataset.value = value;
      cell.textContent = value;
      cell.addEventListener("click", () => handleCellClick(cell));
      grid.appendChild(cell);
    });
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleCellClick(cell) {
    if (puzzleFailed || puzzleComplete) {
      return;
    }

    if (cell.classList.contains("correct")) {
      return;
    }

    const value = Number(cell.dataset.value);

    if (value === expectedNext) {
      cell.classList.add("correct");
      cell.classList.remove("incorrect");
      expectedNext += 1;

      if (expectedNext > 16) {
        completePuzzle();
      }
    } else {
      cell.classList.add("incorrect");
      puzzleFailed = true;
      retryButton.classList.remove("hidden");
    }
  }

  function completePuzzle() {
    puzzleComplete = true;
    agentButton.disabled = false;
    successText.classList.remove("hidden");
    retryButton.classList.add("hidden");
  }

  retryButton?.addEventListener("click", () => {
    initializePuzzle();
  });

  agentButton?.addEventListener("click", () => {
    if (agentButton.disabled) {
      return;
    }
    window.location.href = "?view=special&role=agent";
  });

  humanButton?.addEventListener("click", () => {
    window.location.href = "?view=special&role=human";
  });

  returnButton?.addEventListener("click", () => {
    window.location.href = "/";
  });
})();

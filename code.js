# script-js
document.addEventListener('DOMContentLoaded', () => {
  const boardSize = 10;
  const mineCount = 10;
  const board = document.getElementById('board');
  const mines = [];
  let revealed = [];

  function generateMines() {
    let count = 0;
    while (count < mineCount) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);

      if (!mines.some(mine => mine.x === x && mine.y === y)) {
        mines.push({ x, y });
        count++;
      }
    }
  }

  function generateBoard() {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        board.appendChild(cell);
      }
    }
  }

  function revealCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellIndex = revealed.findIndex(r => r.row === row && r.col === col);

    if (cellIndex !== -1) return;

    const mineIndex = mines.findIndex(m => m.x === row && m.y === col);

    if (mineIndex !== -1) {
      cell.classList.add('mine');
      alert('Game Over');
      resetGame();
    } else {
      const adjacentMines = countAdjacentMines(row, col);
      cell.classList.add('revealed');
      cell.textContent = adjacentMines;

      revealed.push({ row, col });

      if (adjacentMines === 0) {
        const neighbors = getNeighbors(row, col);
        neighbors.forEach(neighbor => revealCell(neighbor));
      }
    }

    if (revealed.length === boardSize * boardSize - mineCount) {
      alert('You Win!');
      resetGame();
    }
  }

  function countAdjacentMines(row, col) {
    let count = 0;
    const neighbors = getNeighbors(row, col);

    neighbors.forEach(neighbor => {
      const { x, y } = neighbor;
      if (mines.some(mine => mine.x === x && mine.y === y)) {
        count++;
      }
    });

    return count;
  }

  function getNeighbors(row, col) {
    const neighbors = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const x = row + dx;
        const y = col + dy;
        if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
          neighbors.push({ x, y });
        }
      }
    }
    return neighbors;
  }

  function resetGame() {
    mines.length = 0;
    revealed.length = 0;
    board.innerHTML = '';
    generateMines();
    generateBoard();
  }

  board.addEventListener('click', e => {
    const cell = e.target;
    if (cell.classList.contains('cell')) {
      revealCell(cell);
    }
  });

  resetGame();
});

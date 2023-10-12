self.addEventListener("message", (
  event: MessageEvent<{ initialState: (0 | 1)[][], iterationsCount: number }>,
) => {
  const data = event.data;
  const initialState = data.initialState;
  const iterations = data.iterationsCount;

  const numRows = initialState.length;
  const numCols = initialState[0].length;

  const createEmptyMatrix = (rows: number, cols: number) => {
    const matrix: (0 | 1)[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: (0 | 1)[] = new Array(cols).fill(0);
      matrix.push(row);
    }

    return matrix;
  };

  const applyRules = (matrix: (0 | 1)[][], x: number, y: number) => {
    const neighbors: (-1 |0 | 1)[][] = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    const liveNeighbors = neighbors.reduce((count, [dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < numRows && ny >= 0 && ny < numCols) {
        count += matrix[nx][ny];
      }

      return count;
    }, 0);

    if (matrix[x][y] === 1) {
      if (liveNeighbors < 2 || liveNeighbors > 3) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (liveNeighbors === 3) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  let currentMatrix = initialState;
  for (let iteration = 0; iteration < iterations; iteration++) {
    const nextMatrix: (0 | 1)[][] = createEmptyMatrix(numRows, numCols);

    for (let x = 0; x < numRows; x++) {
      for (let y = 0; y < numCols; y++) {
        nextMatrix[x][y] = applyRules(currentMatrix, x, y);
      }
    }

    currentMatrix = nextMatrix;
  }

  self.postMessage(currentMatrix);
});

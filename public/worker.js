self.addEventListener("message", function (event) {
    var data = event.data;
    var initialState = data.initialState;
    var iterations = data.iterations;
    var numRows = initialState.length;
    var numCols = initialState[0].length;
    var createEmptyMatrix = function (rows, cols) {
        var matrix = [];
        for (var i = 0; i < rows; i++) {
            var row = new Array(cols).fill(0);
            matrix.push(row);
        }
        return matrix;
    };
    var applyRules = function (matrix, x, y) {
        var neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];
        var liveNeighbors = neighbors.reduce(function (count, _a) {
            var dx = _a[0], dy = _a[1];
            var nx = x + dx;
            var ny = y + dy;
            if (nx >= 0 && nx < numRows && ny >= 0 && ny < numCols) {
                count += matrix[nx][ny];
            }
            return count;
        }, 0);
        if (matrix[x][y] === 1) {
            if (liveNeighbors < 2 || liveNeighbors > 3) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            if (liveNeighbors === 3) {
                return 1;
            }
            else {
                return 0;
            }
        }
    };
    var currentMatrix = initialState;
    for (var iteration = 0; iteration < iterations; iteration++) {
        var nextMatrix = createEmptyMatrix(numRows, numCols);
        for (var x = 0; x < numRows; x++) {
            for (var y = 0; y < numCols; y++) {
                nextMatrix[x][y] = applyRules(currentMatrix, x, y);
            }
        }
        currentMatrix = nextMatrix;
    }
    self.postMessage(currentMatrix);
});

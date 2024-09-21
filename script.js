document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculate-button");
  const resultContainer = document.getElementById("result");

  document.querySelectorAll("input[type='number']").forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.value < 1 || input.value > 30 ) {
        input.value = 1;
      }
    });
  });

  document
    .getElementById("clear-button")
    .addEventListener("click", function () {
      // Reset the input fields to 1
      document.getElementById("num1").value = 1;
      document.getElementById("num2").value = 1;
      document.getElementById("num3").value = 1;
      document.getElementById("num4").value = 1;
    });

  calculateButton.addEventListener("click", function (event) {
    event.preventDefault();
    const num1 = parseInt(document.getElementById("num1").value);
    const num2 = parseInt(document.getElementById("num2").value);
    const num3 = parseInt(document.getElementById("num3").value);
    const num4 = parseInt(document.getElementById("num4").value);

    let temp = [0, 0, 0, 0];
    let operatorList = ["+", "-", "*", "/"];
    let operator = [];
    let number = [];
    let correct = [];
    let solutionCount = 0;

    // Permutation of number
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j === i) {
          continue;
        }
        for (let k = 0; k < 4; k++) {
          if (k === j || k === i) {
            continue;
          }
          for (let l = 0; l < 4; l++) {
            if (l === k || l === j || l === i) {
              continue;
            }
            let temp1 = [num1, num2, num3, num4][i];
            let temp2 = [num1, num2, num3, num4][j];
            let temp3 = [num1, num2, num3, num4][k];
            let temp4 = [num1, num2, num3, num4][l];
            temp = [temp1, temp2, temp3, temp4];
            number.push(temp);
          }
        }
      }
    }

    // Permutation of operator
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          let temp1 = operatorList[i];
          let temp2 = operatorList[j];
          let temp3 = operatorList[k];
          let operTemp = [temp1, temp2, temp3];
          operator.push(operTemp);
        }
      }
    }

    // Working with bracket (5 conditions)
    for (let numberRow of number) {
      for (let operRow of operator) {
        let result = 0;

        // (a b) (c d)
        result = calc(
          calc(numberRow[0], numberRow[1], operRow[0], true),
          calc(numberRow[2], numberRow[3], operRow[2], true),
          operRow[1]
        );
        if (Math.abs(result - 20) < 0.001) {
          correct.push(
            `(${numberRow[0]} ${operRow[0]} ${numberRow[1]}) ${operRow[1]} (${numberRow[2]} ${operRow[2]} ${numberRow[3]})`
          );
        }

        // ((a b) c) d
        result = calc(numberRow[0], numberRow[1], operRow[0], true);
        result = calc(result, numberRow[2], operRow[1], true);
        result = calc(result, numberRow[3], operRow[2]);
        if (Math.abs(result - 20) < 0.001) {
          correct.push(
            `(${numberRow[0]} ${operRow[0]} ${numberRow[1]}) ${operRow[1]} ${numberRow[2]} ${operRow[2]} ${numberRow[3]}`
          );
        }

        // (a (b c)) d
        result = calc(numberRow[1], numberRow[2], operRow[1]);
        result = calc(numberRow[0], result, operRow[0]);
        result = calc(result, numberRow[3], operRow[2]);
        if (Math.abs(result - 20) < 0.001) {
          correct.push(
            `(${numberRow[0]} ${operRow[0]} (${numberRow[1]} ${operRow[1]} ${numberRow[2]})) ${operRow[2]} ${numberRow[3]}`
          );
        }

        // a ((b c) d)
        result = calc(numberRow[1], numberRow[2], operRow[1]);
        result = calc(result, numberRow[3], operRow[2]);
        result = calc(numberRow[0], result, operRow[0]);
        if (Math.abs(result - 20) < 0.001) {
          correct.push(
            `${numberRow[0]} ${operRow[0]} ((${numberRow[1]} ${operRow[1]} ${numberRow[2]}) ${operRow[2]} ${numberRow[3]})`
          );
        }

        // a (b (c d))
        result = calc(numberRow[2], numberRow[3], operRow[2]);
        result = calc(numberRow[1], result, operRow[1]);
        result = calc(numberRow[0], result, operRow[0]);
        if (Math.abs(result - 20) < 0.001) {
          correct.push(
            `${numberRow[0]} ${operRow[0]} (${numberRow[1]} ${operRow[1]} (${numberRow[2]} ${operRow[2]} ${numberRow[3]}))`
          );
        }
      }
    }

    correct = [...new Set(correct)];

    solutionCount = correct.length;
    document.getElementById(
      "solution-count"
    ).innerHTML = `Found ${solutionCount} solution(s)`;

    if (correct.length === 0) {
      resultContainer.innerHTML = "No solution found";
    } else {
      const maxSolutionsPerColumn = 20;
      const columns = [];
      let currentColumn = [];

      for (let i = 0; i < correct.length; i++) {
        currentColumn.push(correct[i]);
        if (currentColumn.length >= maxSolutionsPerColumn) {
          columns.push(currentColumn);
          currentColumn = [];
        }
      }

      if (currentColumn.length > 0) {
        columns.push(currentColumn);
      }

      resultContainer.innerHTML = "";
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const columnHTML = column.join("<br>");
        resultContainer.innerHTML += `<div style="display: inline-block; margin-left: 20px; text-align: left;">${columnHTML}</div>`;
      }
    }
  });
});

function calc(a, b, oper, isParenthesized = false) {
  let result;
  if (oper === "+") {
    result = a + b;
  } else if (oper === "-") {
    result = a - b;
  } else if (oper === "*") {
    result = a * b;
  } else {
    if (b === 0) {
      return 999999;
    }
    result = a / b;
  }

  if (isParenthesized) {
    return `(${result})`;
  }
  return result;
}

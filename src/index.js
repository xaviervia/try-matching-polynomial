// based on https://github.com/juanvia/fit
import React from "react";
import ReactDOM from "react-dom";
import { reverse, zip } from "ramda";
import { polynomial } from "math-playground";

import { getExamples, palette, Plot, ScatterPlot } from "./stuff";
import { makeStackedMatrixOfGenerators } from "./anotherstuff";

const { matrix, multiply, transpose, inv } = require("mathjs");

const solve = (A, b) =>
  multiply(multiply(inv(multiply(transpose(A), A)), transpose(A)), b);

const makeRow = (input, degree) => {
  const row = [];

  for (let i = 0; i < degree + 1; i++) {
    row.unshift(input ** i);
  }

  return row;
};

const makeMatrix = (inputs, degree) =>
  inputs.map(input => makeRow(input, degree));

const inputs = [10, 20, 40, 90, 110, 150, 270, 280, 330, 360, 400];

const outputs = [50, 60, 75, 80, 95, 148, 260, 265, 290, 330, 360];

const plotForDegree = (inputs, degree) => {
  const matrixForInputs = makeMatrix(inputs, degree);
  const coefficients = solve(matrix(matrixForInputs), matrix(outputs))._data;

  const reversedCoefficients = reverse(coefficients);
  const examples = getExamples(0, 400, 40);
  const partiallyAppliedPolynomial = polynomial(reversedCoefficients);
  const results = examples.map(example => partiallyAppliedPolynomial(example));

  return zip(examples, results);
};

function App() {
  return (
    <div className="App">
      <Plot
        paths={[
          plotForDegree(inputs, 1),
          plotForDegree(inputs, 2),
          plotForDegree(inputs, 3),
          plotForDegree(inputs, 4),
          plotForDegree(inputs, 5),
          plotForDegree(inputs, 6),
          plotForDegree(inputs, 7),
          plotForDegree(inputs, 8),
          plotForDegree(inputs, 9)
        ]}
        size={400}
        points={zip(inputs, outputs)}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

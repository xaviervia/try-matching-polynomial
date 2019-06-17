// based on https://github.com/juanvia/fit
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { map, pipe, product, reverse, zip } from "ramda";
import { polynomial } from "math-playground";
import { getExamples, Plot } from "./stuff";
import {
  nInputsPolynomial,
  makeStackedMatrixOfGenerators
} from "./anotherstuff";
import trainingData from "./trainingData.json";

import { getInputs, getOutputs } from "./selectors";

import "./styles.css";

const DIMENSIONS = 2;

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

const newMakeRow = (termInputs, powersMatrix) =>
  powersMatrix.map(termPowers =>
    pipe(
      zip,
      map(([termInput, power]) => termInput ** power),
      product
    )(termInputs, termPowers)
  );

const makeMatrix = (inputs, degree) =>
  inputs.map(input => makeRow(input, degree));

const newMakeMatrix = (inputSets, powersMatrix) =>
  inputSets.map(inputs => newMakeRow(inputs, powersMatrix));

const simplePowersMatrix = makeStackedMatrixOfGenerators(DIMENSIONS, 3);
console.log(simplePowersMatrix);

const testing = newMakeMatrix(getInputs(trainingData), simplePowersMatrix);

console.log(testing);

const inputs = [
  [10],
  [20],
  [40],
  [90],
  [110],
  [150],
  [270],
  [280],
  [330],
  [360],
  [400]
];

const outputs = [
  [50],
  [60],
  [75],
  [80],
  [95],
  [148],
  [260],
  [265],
  [290],
  [330],
  [360]
];

const plotForDegree = (trainingData, degree, y) => {
  const inputs = getInputs(trainingData);
  const outputs = getOutputs(trainingData);
  const powersMatrix = makeStackedMatrixOfGenerators(DIMENSIONS, degree);
  const matrixForInputs = newMakeMatrix(inputs, powersMatrix);
  console.log("lalala", matrixForInputs);
  const coefficients = solve(matrix(matrixForInputs), matrix(outputs))._data;

  console.log("coefficients", coefficients);
  const reversedCoefficients = reverse(coefficients);
  const examples = getExamples(0, 400, 40);
  const partiallyAppliedPolynomial = nInputsPolynomial(reversedCoefficients);
  const results = examples.map(example =>
    partiallyAppliedPolynomial([example, y])
  );

  console.log(results);

  return zip(examples, results);
};

const filterBy = trainingData => target =>
  trainingData.filter(([[x, y], [z]]) => y === target);

function App() {
  const [y, updateY] = useState(40);

  return (
    <div className="App">
      <input
        type="number"
        min="0"
        max="400"
        step="40"
        value={y}
        onChange={({ target: { value } }) => updateY(parseInt(value, 10))}
      />
      <input
        type="range"
        min="0"
        max="400"
        step="40"
        value={y}
        onChange={({ target: { value } }) => updateY(parseInt(value, 10))}
      />
      <Plot
        paths={[
          plotForDegree(trainingData, 1, y)
          // plotForDegree(trainingData, 2, y),
          // plotForDegree(trainingData, 3, y),
          // plotForDegree(trainingData, 4, y),
          // plotForDegree(trainingData, 5, y),
          // plotForDegree(trainingData, 6, y),
          // plotForDegree(trainingData, 7, y),
          // plotForDegree(trainingData, 8, y),
          // plotForDegree(trainingData, 9, y)
        ]}
        size={400}
        points={filterBy(trainingData)(y).map(([[x, y], [z]]) => [x, z])}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

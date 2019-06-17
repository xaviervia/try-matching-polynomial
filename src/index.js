// based on https://github.com/juanvia/fit
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { flatten, map, pipe, product, reverse, zip } from "ramda";
import { polynomial } from "math-playground";
import { getExamples, Plot } from "./stuff";
import {
  nInputsPolynomial,
  makeStackedMatrixOfGenerators
} from "./anotherstuff";
import trainingData from "./trainingData.json";

import { getInputs, getOutputs, filterByY } from "./selectors";

import "./styles.css";

const DIMENSIONS = 2;

const { matrix, multiply, transpose, inv } = require("mathjs");

const solve = (A, b) =>
  multiply(multiply(inv(multiply(transpose(A), A)), transpose(A)), b);

const newMakeRow = (termInputs, powersMatrix) =>
  powersMatrix.map(termPowers =>
    pipe(
      zip,
      map(([termInput, power]) => termInput ** power),
      product
    )(termInputs, termPowers)
  );

const newMakeMatrix = (inputSets, powersMatrix) =>
  inputSets.map(inputs => newMakeRow(inputs, powersMatrix));

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
  const partiallyAppliedPolynomial = nInputsPolynomial(flatten(coefficients));

  const firstExample = partiallyAppliedPolynomial([examples[2], y], degree);

  //  console.log(firstExample);

  // return [];

  const results = examples.map(example =>
    partiallyAppliedPolynomial([example, y], degree)
  );

  console.log(results);

  return zip(examples, results);
};

console.log(nInputsPolynomial([1, 1, 2, 2, 3, 3])([1, 1], 2));

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
          plotForDegree(trainingData, 2, y),
          plotForDegree(trainingData, 3, y),
          plotForDegree(trainingData, 4, y)
          // plotForDegree(trainingData, 5, y),
          // plotForDegree(trainingData, 6, y),
          // plotForDegree(trainingData, 7, y),
          // plotForDegree(trainingData, 8, y),
          // plotForDegree(trainingData, 9, y)
        ]}
        size={400}
        points={filterByY(y)(trainingData).map(([[x, y], [z]]) => [x, z])}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

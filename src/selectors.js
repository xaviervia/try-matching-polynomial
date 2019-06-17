import { map, nth } from "ramda";

export const getInputs = map(nth(0));

export const getOutputs = map(nth(1));

export const filterByY = target => trainingData =>
  trainingData.filter(([[x, y], [z]]) => y === target);

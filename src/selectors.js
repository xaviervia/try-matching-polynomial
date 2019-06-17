import { map, nth } from "ramda";

export const getInputs = map(nth(0));

export const getOutputs = map(nth(1));

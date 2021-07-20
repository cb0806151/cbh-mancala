import { createEntityQuery } from "@datorama/akita";
import { stateStore } from "./store";

export const stateQuery = createEntityQuery(stateStore, {});
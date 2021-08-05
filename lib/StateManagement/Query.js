import { createEntityQuery } from "@datorama/akita"
import { stateStore } from "./Store"

export const stateQuery = createEntityQuery(stateStore, {})
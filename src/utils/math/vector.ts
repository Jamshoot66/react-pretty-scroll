import { Vector2 } from "utils/types";

export const countLength = (vector: Vector2): number => {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

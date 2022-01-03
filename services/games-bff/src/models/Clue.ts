/**
 * @openapi
 * components:
 *   schemas:
 *     clue:
 *       type: object
 *       properties:
 *         word:
 *           type: string
 *         number:
 *           type: number
 */
export interface Clue {
  word: string;
  number: number;
}

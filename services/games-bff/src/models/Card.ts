/**
 * @openapi
 * components:
 *   schemas:
 *     card:
 *       type: object
 *       properties:
 *         card_id:
 *           type: string
 *         label:
 *           type: string
 *         color:
 *           type: number
 *         revealed:
 *           type: boolean
 */
export interface Card {
  card_id: string;
  label: string;
  color: number;
  revealed: boolean;
}

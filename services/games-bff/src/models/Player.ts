/**
 * @openapi
 * components:
 *   schemas:
 *     player:
 *       type: object
 *       properties:
 *         player_id:
 *           type: string
 *         nickname:
 *           type: string
 */
export interface Player {
  player_id: string;
  nickname: string;
}

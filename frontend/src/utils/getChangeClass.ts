export type ChangeClass = 'profit' | 'loss' | 'neutral';

/**
 * Возвращает один из трёх идентификаторов:
 *   'profit'   — >0
 *   'loss'     — <0
 *   'neutral'  — =0
*/
export function getChangeClass(value: number): ChangeClass {
  if (value > 0) return 'profit';
  if (value < 0) return 'loss';
  return 'neutral';
}
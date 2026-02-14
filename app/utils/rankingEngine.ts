import type { Criteria, Item } from '~/types'

/**
 * Calculates the total score for an item based on weighted criteria.
 * Formula: SUM(item_score_for_criterion * criterion_weight)
 *
 * @param item The item to score
 * @param criteriaList The list of criteria with weights
 * @returns The total calculated score
 */
export function calculateScore(item: Item, criteriaList: Criteria[]): number {
  if (!criteriaList.length)
    return 0

  return criteriaList.reduce((total, criterion) => {
    // If id is missing (shouldn't happen in persisted data), skip
    if (criterion.id === undefined)
      return total

    const itemScore = item.scores[criterion.id] || 0
    // Normalize score (0-10) to a percentage (0-1)
    // If item matches fully (score 10), it gets the full weight.
    return total + ((itemScore / 10) * criterion.weight)
  }, 0)
}

/**
 * Sorts items deterministically based on ranking mode.
 * - 'manual': Sorts by manualRankIndex ASC
 * - 'weighted': Sorts by calculated score DESC, then name ASC (for stability)
 *
 * This function is pure and does not mutate the original array.
 *
 * @param items Array of items to sort
 * @param criteriaList Array of criteria (required for weighted mode)
 * @param mode 'manual' | 'weighted'
 * @returns A new sorted array of items
 */
export function sortItems(
  items: Item[],
  criteriaList: Criteria[],
  mode: 'manual' | 'weighted',
): Item[] {
  // Create a shallow copy to avoid mutation
  const sorted = [...items]

  if (mode === 'manual') {
    return sorted.sort((a, b) => a.manualRankIndex - b.manualRankIndex)
  }

  // Weighted mode
  return sorted.sort((a, b) => {
    const scoreA = calculateScore(a, criteriaList)
    const scoreB = calculateScore(b, criteriaList)

    // Primary sort: Score Descending
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }

    // Secondary sort: Name Ascending (Stability)
    return a.name.localeCompare(b.name)
  })
}

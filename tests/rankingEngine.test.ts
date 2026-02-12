import type { Criteria, Item } from '../app/types'
import { describe, expect, it } from 'vitest'
import { calculateScore, sortItems } from '../app/utils/rankingEngine'

describe('ranking Engine', () => {
  const criteria: Criteria[] = [
    { id: 1, listId: 1, name: 'Cost', weight: 10 },
    { id: 2, listId: 1, name: 'Quality', weight: 5 },
  ]

  const items: Item[] = [
    {
      id: 1,
      listId: 1,
      name: 'Item A',
      manualRankIndex: 2,
      scores: { 1: 5, 2: 8 }, // Score: (5*10) + (8*5) = 50 + 40 = 90
    },
    {
      id: 2,
      listId: 1,
      name: 'Item B',
      manualRankIndex: 1,
      scores: { 1: 8, 2: 6 }, // Score: (8*10) + (6*5) = 80 + 30 = 110
    },
    {
      id: 3,
      listId: 1,
      name: 'Item C',
      manualRankIndex: 0,
      scores: { 1: 2, 2: 2 }, // Score: (2*10) + (2*5) = 20 + 10 = 30
    },
  ]

  describe('calculateScore', () => {
    it('should calculate weighted score correctly', () => {
      const score = calculateScore(items[0], criteria)
      expect(score).toBe(90)
    })

    it('should return 0 if no criteria exist', () => {
      const score = calculateScore(items[0], [])
      expect(score).toBe(0)
    })

    it('should handle zero weights correctly', () => {
      const zeroWeightCriteria: Criteria[] = [
        { id: 1, listId: 1, name: 'Cost', weight: 0 },
      ]
      const score = calculateScore(items[0], zeroWeightCriteria)
      expect(score).toBe(0)
    })

    it('should handle missing scores as 0', () => {
      const newItem: Item = {
        id: 4,
        listId: 1,
        name: 'Empty Scores',
        manualRankIndex: 3,
        scores: {},
      }
      const score = calculateScore(newItem, criteria)
      expect(score).toBe(0)
    })
  })

  describe('sortItems', () => {
    it('should sort by manualRankIndex in manual mode', () => {
      const sorted = sortItems(items, criteria, 'manual')
      expect(sorted[0].name).toBe('Item C') // index 0
      expect(sorted[1].name).toBe('Item B') // index 1
      expect(sorted[2].name).toBe('Item A') // index 2
    })

    it('should sort by calculated score DESC in weighted mode', () => {
      const sorted = sortItems(items, criteria, 'weighted')
      expect(sorted[0].name).toBe('Item B') // 110
      expect(sorted[1].name).toBe('Item A') // 90
      expect(sorted[2].name).toBe('Item C') // 30
    })

    it('should be deterministic (stable sort by name on tie)', () => {
      const tieItems: Item[] = [
        {
          id: 4,
          listId: 1,
          name: 'Z Item',
          manualRankIndex: 0,
          scores: { 1: 5 }, // Score 50
        },
        {
          id: 5,
          listId: 1,
          name: 'A Item',
          manualRankIndex: 1,
          scores: { 1: 5 }, // Score 50
        },
      ]
      const tieCriteria: Criteria[] = [
        { id: 1, listId: 1, name: 'Cost', weight: 10 },
      ]

      const sorted = sortItems(tieItems, tieCriteria, 'weighted')
      expect(sorted[0].name).toBe('A Item')
      expect(sorted[1].name).toBe('Z Item')
    })

    it('should not mutate original array', () => {
      const originalOrder = [...items]
      sortItems(items, criteria, 'weighted')
      expect(items).toEqual(originalOrder)
    })
  })
})

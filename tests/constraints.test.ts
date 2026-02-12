import { beforeEach, describe, expect, it } from 'vitest'
import { useListDetails } from '../app/composables/useListDetails'
import { db } from '../app/utils/db'

describe('constraints & edge cases', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  it('should enforce max 20 criteria constraint', async () => {
    // 1. Setup list
    const listId = await db.lists.add({
      name: 'Max Criteria Test',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const { addCriteria } = useListDetails(listId)

    // 3. Add 20 criteria
    for (let i = 0; i < 20; i++) {
      await addCriteria(`C${i}`, 5)
    }

    // 4. Verify 20 exist
    const count = await db.criteria.where('listId').equals(listId).count()
    expect(count).toBe(20)

    // 5. Try adding 21st (should fail)
    await expect(addCriteria('C21', 5)).rejects.toThrow('Maximum limit of 20 criteria reached')
  })

  it('should enforce max 100 items constraint', async () => {
    const listId = await db.lists.add({
      name: 'Max Items Test',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const { addItem } = useListDetails(listId)

    // Add 100 items
    // (Using parallel promises for speed in test)
    const promises = []
    for (let i = 0; i < 100; i++) {
      promises.push(db.items.add({
        listId,
        name: `Item ${i}`,
        manualRankIndex: i,
        scores: {},
      }))
    }
    await Promise.all(promises)

    // Verify 100 exist
    const count = await db.items.where('listId').equals(listId).count()
    expect(count).toBe(100)

    // Try adding 101st via composable (which checks count)
    await expect(addItem('Item 101')).rejects.toThrow('Maximum limit of 100 items reached')
  })

  it('should clamp weights to 0-10 range', async () => {
    const listId = await db.lists.add({
      name: 'Weight Test',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const { addCriteria } = useListDetails(listId)

    // Try adding with weight 15
    await addCriteria('High', 15)
    // Try adding with weight -5
    await addCriteria('Low', -5)

    const savedCriteria = await db.criteria.where('listId').equals(listId).toArray()

    expect(savedCriteria.find(c => c.name === 'High')?.weight).toBe(10)
    expect(savedCriteria.find(c => c.name === 'Low')?.weight).toBe(0)
  })

  it('should clamp item scores to 0-10 range', async () => {
    const listId = await db.lists.add({
      name: 'Score Test',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const itemId = await db.items.add({
      listId,
      name: 'Item A',
      manualRankIndex: 0,
      scores: {},
    })

    const { updateItemScores } = useListDetails(listId)

    await updateItemScores(itemId as number, { 1: 50, 2: -10 })

    const item = await db.items.get(itemId)
    expect(item?.scores[1]).toBe(10)
    expect(item?.scores[2]).toBe(0)
  })
})

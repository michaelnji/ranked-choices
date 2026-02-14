import { beforeEach, describe, expect, it } from 'vitest'
import { useListDetails } from '../app/composables/useListDetails'
import { db } from '../app/utils/db'

describe('useListDetails', () => {
  let listId: number

  beforeEach(async () => {
    // Clear DB
    await db.transaction('rw', db.lists, db.criteria, db.items, async () => {
      await db.lists.clear()
      await db.criteria.clear()
      await db.items.clear()
    })

    // Create a list for testing
    listId = await db.lists.add({
      name: 'Test List',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as number
  })

  it('should update criteria', async () => {
    const { addCriteria, updateCriteria, criteria } = useListDetails(listId)

    await addCriteria('Cost', 5)
    const id = criteria.value[0].id as number

    await updateCriteria(id, 'New Cost', 8)

    const updated = await db.criteria.get(id)
    expect(updated?.name).toBe('New Cost')
    expect(updated?.weight).toBe(8)
  })

  it('should validate criteria weight on update', async () => {
    const { addCriteria, updateCriteria, criteria } = useListDetails(listId)

    await addCriteria('Cost', 5)
    const id = criteria.value[0].id as number

    await updateCriteria(id, 'Invalid', 15) // Should clamp to 10
    const updated = await db.criteria.get(id)
    expect(updated?.weight).toBe(10)

    await updateCriteria(id, 'Invalid Low', -5) // Should clamp to 0
    const updatedLow = await db.criteria.get(id)
    expect(updatedLow?.weight).toBe(0)
  })

  it('should update item ranks', async () => {
    const { addItem, updateItemRanks, items } = useListDetails(listId)

    await addItem('Item A')
    await addItem('Item B')
    await addItem('Item C')

    // items are initially manualRankIndex 0, 1, 2

    // Reorder: C, A, B
    const reordered = [items.value[2], items.value[0], items.value[1]]

    await updateItemRanks(reordered)

    const itemC = await db.items.get(items.value[2].id as number)
    const itemA = await db.items.get(items.value[0].id as number)
    const itemB = await db.items.get(items.value[1].id as number)

    expect(itemC?.manualRankIndex).toBe(0)
    expect(itemA?.manualRankIndex).toBe(1)
    expect(itemB?.manualRankIndex).toBe(2)
  })
})

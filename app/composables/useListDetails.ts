import type { Criteria, Item, List } from '~/types'
import { db } from '~/utils/db'

export function useListDetails(listId: number) {
  const list = ref<List | undefined>(undefined)
  const criteria = ref<Criteria[]>([])
  const items = ref<Item[]>([])

  const fetchDetails = async () => {
    list.value = await db.lists.get(listId)
    criteria.value = await db.criteria.where('listId').equals(listId).toArray()
    items.value = await db.items.where('listId').equals(listId).toArray()
  }

  const addCriteria = async (name: string, weight: number = 5) => {
    // Check if list exists in DB
    const exists = await db.lists.get(listId)
    if (!exists)
      return

    // Constraint: Max 20 criteria
    const count = await db.criteria.where('listId').equals(listId).count()
    if (count >= 20) {
      throw new Error('Maximum limit of 20 criteria reached')
    }

    // Constraint: Weight 0-10
    const validWeight = Math.max(0, Math.min(10, weight))

    await db.criteria.add({
      listId,
      name,
      weight: validWeight,
    })
    await fetchDetails()
  }

  const removeCriteria = async (id: number) => {
    await db.criteria.delete(id)
    await fetchDetails()
  }

  const updateCriteria = async (id: number, name: string, weight: number) => {
    // Constraint: Weight 0-10
    const validWeight = Math.max(0, Math.min(10, weight))
    await db.criteria.update(id, { name, weight: validWeight })
    await fetchDetails()
  }

  const updateItemRanks = async (reorderedItems: Item[]) => {
    await db.transaction('rw', db.items, async () => {
      for (let i = 0; i < reorderedItems.length; i++) {
        const item = reorderedItems[i]
        if (item && item.id) {
          await db.items.update(item.id, { manualRankIndex: i })
        }
      }
    })
    await fetchDetails()
  }

  const addItem = async (name: string, initialScores: Record<number, number> = {}) => {
    // Check if list exists in DB
    const exists = await db.lists.get(listId)
    if (!exists)
      return

    // Constraint: Max 100 items
    const count = await db.items.where('listId').equals(listId).count()
    if (count >= 100) {
      throw new Error('Maximum limit of 100 items reached')
    }

    // Validate scores
    const validScores: Record<number, number> = {}
    for (const [key, value] of Object.entries(initialScores)) {
      validScores[Number(key)] = Math.max(0, Math.min(10, value))
    }

    await db.items.add({
      listId,
      name,
      manualRankIndex: count,
      scores: validScores,
    })
    await fetchDetails()
  }

  const updateItem = async (itemId: number, name: string, scores: Record<number, number>) => {
    // Constraint: Ensure scores are 0-10
    const validScores: Record<number, number> = {}
    for (const [key, value] of Object.entries(scores)) {
      validScores[Number(key)] = Math.max(0, Math.min(10, value))
    }

    await db.items.update(itemId, { name, scores: validScores })
    await fetchDetails()
  }

  const removeItem = async (id: number) => {
    await db.items.delete(id)
    await fetchDetails()
  }

  const updateItemScores = async (itemId: number, scores: Record<number, number>) => {
    // Constraint: Ensure scores are 0-10
    const validScores: Record<number, number> = {}
    for (const [key, value] of Object.entries(scores)) {
      validScores[Number(key)] = Math.max(0, Math.min(10, value))
    }

    await db.items.update(itemId, { scores: validScores })
    await fetchDetails()
  }

  return {
    list,
    criteria,
    items,
    fetchDetails,
    addCriteria,
    removeCriteria,
    addItem,
    updateItem,
    removeItem,
    updateItemScores,
    updateCriteria,
    updateItemRanks,
  }
}

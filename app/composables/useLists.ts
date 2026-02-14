import type { List } from '~/types'
import { db } from '~/utils/db'

export function useLists() {
  const lists = ref<(List & { itemCount: number })[]>([])

  const fetchLists = async () => {
    const allLists = await db.lists.toArray()
    const listsWithCounts = await Promise.all(allLists.map(async (list) => {
      const count = await db.items.where('listId').equals(list.id!).count()
      return { ...list, itemCount: count }
    }))
    lists.value = listsWithCounts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const createList = async (name: string) => {
    const newList: List = {
      name,
      rankingMode: 'weighted',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.lists.add(newList)
    await fetchLists()
    return newList
  }

  const deleteList = async (id: number) => {
    await db.transaction('rw', db.lists, db.criteria, db.items, async () => {
      await db.lists.delete(id)
      await db.criteria.where('listId').equals(id).delete()
      await db.items.where('listId').equals(id).delete()
    })
    await fetchLists()
  }

  return {
    lists,
    fetchLists,
    createList,
    deleteList,
  }
}

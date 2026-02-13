import type { List } from '~/types'
import { db } from '~/utils/db'

export function useLists() {
  const lists = ref<List[]>([])

  const fetchLists = async () => {
    lists.value = await db.lists.toArray()
  }

  const createList = async (name: string) => {
    const newList: List = {
      name,
      rankingMode: 'manual',
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

import type { EntityTable } from 'dexie'
import type { Criteria, Item, List } from '~/types'
import Dexie from 'dexie'

// Database declaration
const db = new Dexie('RankedChoicesDB') as Dexie & {
  lists: EntityTable<List, 'id'>
  criteria: EntityTable<Criteria, 'id'>
  items: EntityTable<Item, 'id'>
}

// Schema registration
db.version(1).stores({
  lists: '++id, name, rankingMode, createdAt, updatedAt',
  criteria: '++id, listId, name, weight',
  items: '++id, listId, name, manualRankIndex',
})

export { db }

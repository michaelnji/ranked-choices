import type { EntityTable } from 'dexie'
import type { Criteria, Item, List, UserProfile } from '~/types'
import Dexie from 'dexie'

// Database declaration
const db = new Dexie('RankedChoicesDB') as Dexie & {
  lists: EntityTable<List, 'id'>
  criteria: EntityTable<Criteria, 'id'>
  items: EntityTable<Item, 'id'>
  profile: EntityTable<UserProfile, 'id'>
}

// v1 — original schema
db.version(1).stores({
  lists: '++id, name, rankingMode, createdAt, updatedAt',
  criteria: '++id, listId, name, weight',
  items: '++id, listId, name, manualRankIndex',
})

// v2 — adds user profile table
db.version(2).stores({
  lists: '++id, name, rankingMode, createdAt, updatedAt',
  criteria: '++id, listId, name, weight',
  items: '++id, listId, name, manualRankIndex',
  profile: '++id, username, createdAt',
})

export { db }

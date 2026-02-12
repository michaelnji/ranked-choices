import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../app/utils/db'

describe('ranked Choices DB', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  it('should create and persist a list', async () => {
    const listId = await db.lists.add({
      name: 'Test List',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const list = await db.lists.get(listId)
    expect(list).toBeDefined()
    expect(list?.name).toBe('Test List')
  })

  it('should add criteria to a list', async () => {
    const listId = await db.lists.add({
      name: 'Criteria List',
      rankingMode: 'weighted',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const cId = await db.criteria.add({
      listId: listId as number,
      name: 'Cost',
      weight: 8,
    })

    const criteria = await db.criteria.get(cId)
    expect(criteria?.name).toBe('Cost')
    expect(criteria?.weight).toBe(8)
  })

  it('should add items with scores', async () => {
    const listId = await db.lists.add({
      name: 'Item List',
      rankingMode: 'manual',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const itemId = await db.items.add({
      listId: listId as number,
      name: 'Item A',
      manualRankIndex: 0,
      scores: { 1: 5, 2: 10 },
    })

    const item = await db.items.get(itemId)
    expect(item?.name).toBe('Item A')
    expect(item?.scores[1]).toBe(5)
  })
})

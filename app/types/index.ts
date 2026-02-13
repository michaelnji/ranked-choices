// Ranked Choices - Core Types

export type RankingMode = 'manual' | 'weighted'

export interface List {
  id?: number // Optional for creation, required for persistence
  name: string
  rankingMode: RankingMode
  createdAt: Date
  updatedAt: Date
}

export interface Criteria {
  id?: number
  listId: number
  name: string
  weight: number // 0-10
}

export interface Item {
  id?: number
  listId: number
  name: string
  manualRankIndex: number
  scores: Record<number, number> // criteriaId -> score
}

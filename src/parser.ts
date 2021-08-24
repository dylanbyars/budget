import {
  mapEntries,
  groupBy,
} from 'https://deno.land/std@0.105.0/collections/mod.ts'
import camelCase from 'https://deno.land/x/case@v2.1.0/camelCase.ts'
import { readCSVObjects } from 'https://deno.land/x/csv@v0.6.0/mod.ts'

export type Transaction = {
  transactionDate: string
  postedDate: string
  cardNo: string
  description: string
  category: string
  debit: number
  credit: number
}

export default async function pullData(pathToFile: string) {
  const file = await Deno.open(pathToFile)

  const content: Transaction[] = []

  for await (const row of readCSVObjects(file)) {
    const transaction: Record<keyof Transaction, any> = mapEntries(
      row,
      ([k, v]) => [
        camelCase(k),
        ['credit', 'debit'].includes(k) ? parseFloat(v) : v,
      ]
    )

    content.push(transaction)
  }

  file.close()

  const grouped = groupBy<Transaction>(content, (row) => row.category)

  return grouped
}

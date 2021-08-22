// import * as stringSimilarity from 'https://deno.land/x/string_similarity/mod.ts'
import {
  mapValues,
  groupBy,
} from 'https://deno.land/std@0.105.0/collections/mod.ts'
import { readCSVObjects } from 'https://deno.land/x/csv/mod.ts'

const COMMON_STORES = [
  'Amazon',
  'Paypal',
  'Wegmans',
  'Whole Foods',
  'Harris Teeter',
]

function formatAsCurrency(number: number) {
  const fixedNumber = Math.abs(number).toFixed(2)
  return `${number < 0 ? '-' : ''}$${fixedNumber}`
}

const files = Deno.args

const totalsByCategory: Record<string, number> = {}
const totalsByDescription: Record<string, number> = {}

const descriptions = new Set()

type Row = {
  'Transaction Date': string
  'Posted Date': string
  'Card No.': string
  Description: string
  Category: string
  Debit: string
  Credit: string
}

async function pullData(pathToFile: string) {
  const file = await Deno.open(pathToFile)

  const content: any = []

  for await (const row of readCSVObjects(file)) {
    const { Category, Credit, Debit, Description } = row as Row
    const [credit, debit] = [Credit, Debit].map((n) => (n ? parseFloat(n) : 0))
    totalsByCategory[Category] =
      debit - credit + (totalsByCategory[Category] || 0)
    totalsByDescription[Description] =
      debit - credit + (totalsByDescription[Description] || 0)

    content.push(row)

    descriptions.add(Description)
  }

  file.close()

  return content
}

const c = await pullData(files[0])

const grouped = groupBy<Row>(c, (row) => row.Category)
console.log(grouped)
console.log(mapValues(totalsByCategory, formatAsCurrency))

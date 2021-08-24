import AsciiTable from 'https://deno.land/x/ascii_table@v0.1.0/mod.ts'
import titleCase from 'https://deno.land/x/case@v2.1.0/titleCase.ts'
import pullData from './src/parser.ts'
import type { Transaction } from './src/parser.ts'

function formatAsCurrency(number: number) {
  const fixedNumber = Math.abs(number).toFixed(2)
  return `${number < 0 ? '-' : ''}$${fixedNumber}`
}

;(async function () {
  const files = Deno.args

  const grouped = await pullData(files[0])

  for (const [category, transactions] of Object.entries(grouped)) {
    const headers: (keyof Transaction)[] = [
      'transactionDate',
      'description',
      'debit',
      'credit',
    ]

    const table = new AsciiTable().setHeading(headers.map((h) => titleCase(h)))

    let categoryTotal: number = 0

    transactions.forEach(({ transactionDate, description, debit, credit }) => {
      table.addRow(
        transactionDate,
        description,
        formatAsCurrency(debit),
        formatAsCurrency(credit)
      )
      categoryTotal += debit - credit
    })

    table.setTitle(`${category} ${formatAsCurrency(categoryTotal)}`)

    console.log(table.toString())
  }
})()

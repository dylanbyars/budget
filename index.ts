// import { groupBy } from "https://deno.land/std@0.105.0/collections/mod.ts";
import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";

const files = Deno.args;

const totals: Record<string, number> = {};

async function pullData(pathToFile: string) {
  type Row = {
    "Transaction Date": string;
    "Posted Date": string;
    "Card No.": string;
    Description: string;
    Category: string;
    Debit: string;
    Credit: string;
  };

  const file = await Deno.open(pathToFile);

  for await (const row of readCSVObjects(file)) {
    const { Category, Credit, Debit } = row as Row;
    const [credit, debit] = [Credit, Debit].map(n => n ? parseFloat(n) : 0);
    totals[Category] = totals[Category] || 0;
    totals[Category] = debit - credit + totals[Category];
  }

  file.close();
}

await pullData(files[0]);

console.log(totals);

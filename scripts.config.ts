import type { DenonConfig } from 'https://deno.land/x/denon/mod.ts'

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: 'denon run --allow-read --allow-net --no-check index.ts ./transactions/test.csv',
      desc: 'run this bitch',
    },
  },
}

export default config

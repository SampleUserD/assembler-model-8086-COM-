import { LOAD_INSTRUCTIONS_WITH_MNEMONICS } from './language/instructions/.load.ts'

LOAD_INSTRUCTIONS_WITH_MNEMONICS.then(pair => {
  const { mnemonics, instructions } = pair

  instructions[mnemonics['swap']]
})
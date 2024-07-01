type InstructionWithMnemonic = { 
  mnemonics: { [mnemonic: string]: number }, 
  instructions: Functions[] 
}

function loadInstructionsWithMnemonics(additionalModules: string[] = []): Promise<InstructionWithMnemonic> {
  const INSTRUCTIONS_MODULES: string[] = ['./swap.ts'].concat(additionalModules)

  return Promise
    .all(INSTRUCTIONS_MODULES.map(name => import(name).default as Function))
    .then(instructions => {
      const mnemonics: {[mnemonic: string]: number} = {}

      instructions.forEach((instruction, index) => instruction[instruction.name.toLowerCase()] = index)
      
      return { mnemonics, instructions }
    })
}

export const LOAD_INSTRUCTIONS_WITH_MNEMONICS = loadInstructionsWithMnemonics([])
export type { InstructionWithMnemonic }
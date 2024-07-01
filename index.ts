// [INITIALIZATION]

enum ReservedInstructions {
  SET_REGISTER,
  SET_MEMORY,
  SWAP_MEMORY,
  JUMP,
  RET,
  SYSCALL
}

const system_calls = Object.freeze([
  // function: print
  (ptr_string: number, size_string: number) => {
    let result = new String()

    for (let i = 0; i <= size_string; i++)
      result += String.fromCharCode(__mem_get(ptr_string + i))

    console.log(result)
  },
  // function: input
  (ptr_value: number, maximal_size: number) => {
    const input = prompt() || new String()

    for (let i = 0, length = Math.min(maximal_size || 0, input.length); i < length; i++)
      __mem_set(ptr_value + i, input[i].charCodeAt(0))
  }
])

const reserved_instructions = Object.freeze([
  // function: reg_set
  (iptr: number) => {
    const reg = __mem_get(iptr + 2)
    const val = __mem_get(iptr + 3)

    __reg_set(reg as Registers, val)
  },
  (iptr: number) => {
    const ptr = __mem_get(iptr + 2)
    const val = __mem_get(iptr + 3)

    __mem_set(ptr, val)
  },
  // function: swap
  (iptr: number) => {
    const v_0 = __mem_get(__mem_get(iptr + 2))
    const v_1 = __mem_get(__mem_get(iptr + 3))

    __mem_set(__mem_get(iptr + 2), v_1)
    __mem_set(__mem_get(iptr + 3), v_0)
  },
  // function: jump
  (iptr: number) => {
    __instruction_jump(__mem_get(iptr + 2))
  },
  // function: ret
  () => {},
  // function: syscall
  (iptr: number) => {
    const header = __mem_get(iptr + 2)
    const argc = __mem_get(iptr + 1) - 1
    const argv = []

    for (let i = 1; i <= argc; i++)
      argv.push(__mem_get(iptr + 2 + i))

    system_calls[header].apply(null, argv)
  }
])

// [Readonly memory] {[Registers offset], [Code section offset], [Registers: [Instruction pointer], ...]}
const reserved_memory: number[] = [400, 200]
// [instruction pointer]
const registers: number[] = [0, 0, 0, 0, 0, 0]

enum Registers {
  CIPR,
  PIPR,
  ICR,
  AR,
  BR
}

const PROGRAMM_LENGTH = reserved_memory[0]
const SECTION_MEM_OFF = 2
const SECTION_INS_OFF = reserved_memory[1]

for (let i = 0; i < PROGRAMM_LENGTH; i++)
  reserved_memory.push(0)

// [SYSCALL]

function __call_ri(header: number, iptr: number) {
  reserved_instructions[header](iptr)
}

// [REGISTERS]

function __reg_set(register: Registers, value: number) {
  registers[register] = value
}

function __reg_get(register: Registers) {
  return registers[register]
}

// [MEMORY]

function __mem_ptr(offset: number) {
  return 2 + offset
}

function __mem_get(offset: number) {
  return reserved_memory[__mem_ptr(offset)]
}

function __mem_set(offset: number, value: number) {
  reserved_memory[__mem_ptr(offset)] = value
}

function __mem_inc(offset: number) {
  reserved_memory[__mem_ptr(offset)]--
}

function __mem_dec(offset: number) {
  reserved_memory[__mem_ptr(offset)]--
}

// [LABELS]

const labels: {[name: string]: number} = {}

function label(name: string) {
  labels[name] = __reg_get(Registers.CIPR)
}

function label_of(name: string): number {
  return labels[name]
}

// [VARIABLES]

const __variable_definition_offsets = [0]
const variables: {[name: string]: number} = {}

function variable(name: string, size: number, value: number[] = []) {
  const offset = __variable_definition_offsets[__variable_definition_offsets.length - 1]
  
  __variable_definition_offsets.push(offset + size)
  
  variables[name] = offset

  for (let i = 0; i < size; i++)
    __mem_set(offset + i, value[i] || 0)
}

function variable_of(name: string): number {
  return variables[name]
}

// [INSTRUCTIONS]

function instruction(header: number, argc: number, ...argv: number[]) {
  const ptr = __instruction_ptr()

  __reg_set(Registers.ICR, __reg_get(Registers.ICR) + 1)
  __mem_set(ptr, header)
  __mem_set(ptr + 1, argc)

  for (let i = 0; i < argc; i++)
    __mem_set(ptr + i + 2, argv[i])

  __instruction_next()
}

function __instruction_next() {
  const PIPR = __reg_get(Registers.CIPR)
  const CIPR = PIPR + __instruction_size() 

  __reg_set(Registers.PIPR, PIPR)
  __reg_set(Registers.CIPR, CIPR)
}

function __instruction_size(): number {
  // [header] + [argc] + [argv]
  return 2 + __mem_get(__instruction_ptr() + 1)
}

function __instruction_jump(index: number) {
  __reg_set(Registers.PIPR, index)
  __reg_set(Registers.CIPR, index)
}

function __instruction_ptr(): number {
  return __reg_get(Registers.CIPR) + SECTION_INS_OFF
}

function __instruction_execute() {
  const ptr = __instruction_ptr()
  const header = __mem_get(ptr)

  __call_ri(header, ptr)
 
  if (header !== ReservedInstructions.JUMP)
    __instruction_next()
}

// [CODE]
variable('example', 50)

label('.start')
instruction(ReservedInstructions.SYSCALL, 3, 1, variable_of('example'), 50)
instruction(ReservedInstructions.SYSCALL, 3, 0, variable_of('example'), 50)

// 300 -> 200 -> 100

// [EXECUTION]

__instruction_jump(label_of('.start'))

const instructions_length = __reg_get(Registers.ICR)

for (let index = 0; index < instructions_length; index++) 
  __instruction_execute()

// [DEBUG]

// console.log(reserved_memory)
// console.log(registers)
// console.log(labels)
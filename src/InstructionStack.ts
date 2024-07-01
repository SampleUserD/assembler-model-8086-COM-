import { Instruction } from './Instruction.ts'

import { ReservedRegister as Register, ReservedRegisterStorage as Registers } from './register/ReservedRegisterStorage.ts'
import { Memory } from './memory/Memory.ts'


export class InstructionStack {
  private static _registers: Registers | null = null
  private static _memory: Memory | null = null

  public static bind({ registers, memory }: { registers: Registers, memory: Memory }): void {
    this._registers = registers
    this._memory = memory
  }
  
  public static add(instruction: Instruction): void {
    this._assertIfItsUninitialized()
    
    this._count()

    const pointer: number = this._currentInstructionPointer

    this._memory.setBy(pointer, instruction.header)
    this._memory.setBy(pointer + 1, instruction.argv.length)
    this._memory.setVectorBy(pointer + 2, instruction.argv)
  }

  public static jumpTo(pointer: number): void {
    this._assertIfItsUninitialized()
    this._jumpTo(pointer)
  }

  private static _assertIfItsUninitialized(): void {
    if (this._registers === null || this._memory === null)
      throw new Error(`Before you use the instruction executor, you should call the method "API.for(Registers, Memory)"`)
  }

  private static _count(): void {
    this._registers.set(Register.ICR, this._programmSize + 1)
  }
  
  private static _jumpTo(pointer: number) {
    this._registers.set(Register.IPR, pointer)
  }

  private static get _currentInstructionPointer(): number {
    return this._registers.get(Register.IPR) + this._codeSectionOffset
  }

  private static get _codeSectionOffset(): number {
    return this._memory.sectionSize
  }

  private static get _programmSize(): number {
    return this._registers.get(Register.ICR)
  }
}
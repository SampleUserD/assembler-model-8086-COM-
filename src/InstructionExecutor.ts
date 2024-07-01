import { ReservedRegister as Register, ReservedRegisterStorage as Registers } from './register/ReservedRegisterStorage.ts'
import { Memory } from './memory/Memory.ts'


export class InstructionExecutor {
  private static _registers: Registers | null = null
  private static _memory: Memory | null = null

  public static bind({ registers, memory }: { registers: Registers, memory: Memory }): void {
    this._registers = registers
    this._memory = memory
  }
  
  public static executeProgramm(): void {
    this._assertIfItsUninitialized()
  }

  public static jumpTo(pointer: number): void {
    this._assertIfItsUninitialized()
    this._jumpTo(pointer)
  }

  private static _assertIfItsUninitialized(): void {
    if (this._registers === null || this._memory === null)
      throw new Error(`Before you use the instruction executor, you should call the method "API.for(Registers, Memory)"`)
  }

  private static _step(): void {
    const pointer: number = this._currentInstructionPointer
    const header: number = this._memory.getBy(pointer)

    this._moveNext()
  }
  
  private static _jumpTo(pointer: number) {
    this._registers.set(Register.IPR, pointer)
  }

  private static _moveNext(): void {
    this._registers.set(Register.IPR, this._registers.get(Register.IPR) + this._currentInstructionSize)
  }

  private static get _currentInstructionSize(): number {
    // sizeof([header]) + sizeof([argc]) + sizeof([argv])
    return 2 + this._memory.getBy(this._pointer + 1)
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
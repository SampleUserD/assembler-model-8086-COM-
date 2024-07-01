export class Memory {
  private number[] _memory = [0, 0]

  public constructor(programmSize: number, memorySize: number) {
    this._memory[0] = programmSize
    this._memory[1] = memorySize

    for (let index = 0; index < programmSize; index++)
      this._memory.push(0)
  }

  private _calculatePointerByOffset(offset: number): number {
    return 2 + offset
  }

  public getBy(offset: number): number {
    return this._memory[this._calculatePointerByOffset(offset)]
  }

  public setBy(offset: number, value: number): void {
    this._memory[this._calculatePointerByOffset(offset)] = value
  }

  public setVectorBy(baseOffset: number, values: number[]): void {
    for (let index = 0, length = values.length; index < length; index++)
      this._memory[baseOffset + index] = values[i]
  }

  public get programmSize(): number {
    return this._memory[0]
  }

  public get sectionSize(): number {
    return this._memory[1]
  }
}
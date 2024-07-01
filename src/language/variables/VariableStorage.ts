export class VariableStorage {
  private _offsets: number[] = [0]
  private _variables: {[variable: string]: number} = {}

  public set(variable: string, size: number): void {
    this._variables[variable] = this._getFreeOffset(size)
  }

  public get(variable: string): number {
    return this._variables[variable]
  }

  private _getFreeOffset(size: number): number {
    const offset: number = this._offsets[this._offsets.length - 1]
    this._offsets.push(offset + size)

    return offset
  }
}
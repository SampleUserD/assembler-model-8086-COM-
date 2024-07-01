export enum ReservedRegister { IPR, ICR }

export class ReservedRegisterStorage {
  private _registers: {[register: ReservedRegister]: number} = { 
    [ReservedRegister.IPR]: 0,
    [ReservedRegister.ICR]: 0 
  }

  public set(register: ReservedRegister, value: number): void {
    this._registers[register] = value
  }

  public get(register: ReservedRegister): number {
    return this._registers[register]
  }
}
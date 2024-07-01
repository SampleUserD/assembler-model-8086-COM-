export class LabelStorage<Type> {
  private _labels: {[label: string]: number} = {}

  public constructor(private _calculate: (label: string) => Type) {}

  public set(label: string): void {
    this._labels[label] = this._calculate(label)
  }

  public get(label: string): number {
    return this._labels[label]
  }
}
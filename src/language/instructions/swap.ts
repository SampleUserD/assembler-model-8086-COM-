export default function SWAP(pointer: number, { memory }): void {
  const p0 = memory.getBy(pointer + 2)
  const p1 = memory.getBy(pointer + 3)

  const v0 = memory.getBy(p0)
  const v1 = memory.getBy(p1)

  memory.setBy(p0, v1)
  memory.setBy(p1, v0)
}
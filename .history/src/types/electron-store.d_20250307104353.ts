declare module 'electron-store' {
  // 避免局部声明冲突，使用不同的名称
  import ElectronStore from 'electron-store'

  interface ElectronStore<T> {
    get(key: string): T | undefined
    set(key: string, value: T): void
  }

  export default ElectronStore
}

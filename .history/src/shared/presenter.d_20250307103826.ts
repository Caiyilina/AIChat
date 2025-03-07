/**
 * TypeScript类型声明文件
 * 声明文件必须以.d.ts为后缀
 * 声明文件必须以declare var、declare function、declare class、declare enum等开头
 * 声明文件可以是多个文件的集合，使用/// <reference>标签来引入其他声明文件
 * 声明文件可以使用TypeScript的命名空间来组织代码
 * 声明文件可以使用TypeScript的模块来组织代码
 */

import { BrowserWindow } from 'electron'

/**
 * 窗口管理类
 */
export interface IWindowPresenter {
  createMainWindow(): BrowserWindow
  getWindow(windowName: string): BrowserWindow | undefined
  mainWindow: BrowserWindow | undefined
  previewFile(filePath: string): void
  minimize(): void
  maximize(): void
  close(): void
  hide(): void
  show(): void
  isMaximized(): boolean
}
export interface IConfigPresenter {
  config: Config
}

/**
 * 全局管理类
 */
export interface IPresenter {
  windowPresenter: IWindowPresenter
}

/**
 * Created by admin on 2017/3/27.
 */

import { dirname } from 'path'
import { EventEmitter } from 'events'
import { exec } from 'child_process'
import { app, BrowserWindow } from 'electron'
import Common from './Common'
import JavaMethod from './ConnectJava'
import AutoUpdate from './AutoUpdate'
import LogHelper from './LogHelper'

let MainWindow = null
const WinUrl = process.env.NODE_ENV === 'production' ? `file://${__dirname}/index.html` : `http://localhost:9003`
const File = {
  /**
   * 复制文件
   * @param {String}Source 源路径
   * @param {String}Target 目标路径
   */
  CopyFile: (Source, Target) => {
    Common.CopyFile(Source, Target)
  },
  /**
   * 打开文件
   * @param {String} Path 文件路径
   * @param {Boolean} InDir 是否打开所在目录
   * @param {Boolean} Selected 是否选择该文件
   */
  OpenFile: (Path, InDir, Selected) => {
    let CMDStr = 'start "" "' + (InDir ? dirname(Path) : Path) + '"'
    LogHelper.writeInfo(CMDStr)
    if (Selected) CMDStr = 'explorer.exe /select,"' + Path + '"'
    exec(CMDStr, (err, stdout, stderr) => {
      if (err) LogHelper.writeErr(err)
      if (stderr) LogHelper.writeErr(stderr)
    })
  }
}

function CreateWindow () {
  MainWindow = new BrowserWindow({width: 1440, height: 900, minWidth: 1440, minHeight: 900, frame: false,})
  MainWindow.loadURL(WinUrl)
  MainWindow.on('closed', () => {
    MainWindow = null
  })
  if (process.env.NODE_ENV !== 'production') MainWindow.webContents.openDevTools()
}

app.on('ready', CreateWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (MainWindow === null) {
    CreateWindow()
  }
})

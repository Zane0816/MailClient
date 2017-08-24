/**
 * Created by admin on 2017/3/27.
 */

import { dirname } from 'path'
import { EventEmitter } from 'events'
import Common from './Common'
import JavaMethod from './ConnectJava'
import AutoUpdate from './AutoUpdate'
import LogHelper from './LogHelper'
import { exec } from 'child_process'

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

const $Class = {
  File: File, Java: JavaMethod, Updater: AutoUpdate
}
$Class.__proto__ = EventEmitter.prototype
global.Main = $Class
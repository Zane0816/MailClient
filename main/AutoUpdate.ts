/**
 * Created by admin on 2017/3/31.
 */


const {NsisCompatUpdater} = require('nsis-compat-updater')
import LogHelper from './LogHelper'

export default class {
  constructor () {

  }

  /**
   * 更新软件方法
   * @param {String} UpdateUrl 远程更新地址
   * @param {String} Version 当前版本
   * @param {String} Arch 当前架构
   */
  Update (UpdateUrl: string, Version: string, Arch: string) {
    const Updater = new NsisCompatUpdater(UpdateUrl + 'versions.nsis.json', Version, Arch)
    Updater.checkForUpdates().then((version: any) => {
      if (version && confirm(`新的软件版本: ${ version.version } 现已发布! 是否下载更新 ?`)) {
        return Updater.downloadUpdate(version.version).then((path: string) => {
          if (confirm(`新的软件版本: ${ version.version } 已经下载完成! 是否立即安装更新?`)) {
            return Updater.quitAndInstall(path)
          }
        })
      }
    }).catch((err: string) => {
      LogHelper.writeErr(err)
    })
  }
}
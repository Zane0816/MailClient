import log4js from 'log4js'

import config from './LogConfig'

log4js.configure(config.LogConfig)//设置日志配置

export default {
  writeDebug: (msg: string) => {//输出debug信息
    if (msg == null) {
      msg = ''
    }
    log4js.getLogger('logDebug').debug(msg)
  },
  writeInfo: (msg: string) => {//输出info信息
    if (msg == null) {
      msg = ''
    }
    log4js.getLogger('logInfo').info(msg)
  },
  writeWarn: (msg: string) => {//输出警告信息
    if (msg == null) {
      msg = ''
    }
    log4js.getLogger('logWarn').warn(msg)
  },
  writeErr: (msg: string | Error, exp?: string) => {//输出错误信息
    if (msg == null) {
      msg = ''
    }
    if (exp != null) {
      msg += '\r\n' + exp
    }
    log4js.getLogger('logErr').error(<string>msg)
  }
}

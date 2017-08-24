/**
 * Created by admin on 2017/2/9.
 */
import Hash from 'crypto'
import fs from 'fs'
import path from 'path'
import Logger from './LogHelper'

const Common = {
  /**
   * 发送邮件
   * @param {Object} MailOptions 邮件相关参数
   * */
  // SendMail: async (MailOptions) => {
  //   return new Promise((resolve, reject) => {
  //     Transporter.sendMail(MailOptions, (err, info) => {
  //       if (err) {
  //         Logger.writeErr(err)
  //         reject(err)
  //       } else {
  //         resolve(Common.getState(3))
  //       }
  //     })
  //   })
  // },
  /**
   * 进行Hash加密
   * @param {String} Type 加密类型
   * @param {String} Text 要加密的字符串
   * @return String 返回加密之后的结果
   * */
  getHash: (Type, Text) => {
    let HashType = Hash.createHash(Type)
    HashType.update(Text)
    return HashType.digest('hex')
  },
  /**
   * 检测指定路径是否存在，如果不存在，则创建该路径
   * @param {String} Path 路径
   * */
  CheckAndCreatePath: async (Path) => {
    let ParentPath = path.dirname(Path)//获取父级路径
    if (fs.existsSync(ParentPath)) {//判断父级路径是否存在
      if (!fs.existsSync(Path)) {//判断路径是否存在
        fs.mkdirSync(Path)//不存在则创建
      }
    } else {
      Common.CheckAndCreatePath(ParentPath)//检查创建父级目录
      fs.mkdirSync(Path)
    }
  },
  /**
   * 复制文件
   * @param s 源文件路径
   * @param t 目标文件路径
   */
  CopyFile: async (s, t) => {
    await Common.CheckAndCreatePath(path.dirname(t))//检测父级路径是否存在
    let read, write
    read = fs.createReadStream(s)
    write = fs.createWriteStream(t)
    read.pipe(write)
  },
  /**
   * 复制文件夹
   * @param s 源文件夹
   * @param t 目标文件夹
   * @returns {Promise.<void>}
   */
  CopyDir: async (s, t) => {
    await Common.CheckAndCreatePath(t)
    fs.readdir(s, (err, paths) => {
      if (err) Logger.writeErr(err)
      paths.forEach((path) => {
        let _src = s + '/' + path
        let _dis = t + '/' + path
        fs.stat(_src, (err, st) => {
          if (err) Logger.writeErr(err)
          if (st.isFile()) {
            Common.CopyFile(_src, _dis)
          } else if (st.isDirectory()) {
            Common.CopyDir(_src, _dis)
          }
        })
      })
    })
  }
}

export default Common

/**
 * Created by admin on 2017/3/27.
 */
import LogHelper from './LogHelper'
import { EventEmitter } from 'events'
import Common from './Common'
import { delimiter, dirname, join, resolve } from 'path'
import { existsSync, readFile, writeFile } from 'fs'
import Timer = NodeJS.Timer

const ee = new EventEmitter()//声明事件发生器
let java: any, StaticInfo: any, JavaClass: any = {}//声明java 对象和静态类声明java包

class Case {
  constructor () {
  }

  /**
   * 添加案件
   * @param CaseName 案件名
   * @param Creator 创建人
   * @param CasePath 案件路径
   * @param TempPath 缓存路径
   * @param Description 案件描述
   * @param EvidencePaths 证据列表
   */
  async AddCase (CaseName: string, Creator: string, CasePath: string, TempPath: string, Description: string, EvidencePaths: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'addCase', [CaseName, Creator, CasePath, TempPath, Description, JSON.stringify(EvidencePaths)])
  }

  /**
   * 获取案件列表
   */
  async GetCaseList () {
    await WaitingFuncAndDo('LocalCaseTool', 'getCaseList')
  }

  /**
   * 添加证据
   * @param CaseId 案件名称
   * @param Evidence 证据名称
   * @param Creator 创建人
   * @param {Array} Path 路径
   * @param Description 描述
   * @param EvidentType 证件类型
   * @param CallBack 回调函数
   */
  AddEvidence (CaseId: string, Evidence: string, Creator: string, Path: string, Description: string, EvidentType: string, CallBack: Function) {
    let Timer: Timer

    function GetProgress () {
      if (StaticInfo.progressBar) {
        let Progress = JSON.parse(StaticInfo.progressBar)
        CallBack({
            State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total
          }
        )
        if (Progress.proNum === Progress.tatal) {
          clearTimeout(Timer)
        }
      }
      Timer = setTimeout(GetProgress, 500)
    }

    GetProgress()
    let cb = (Result: any) => {
      clearTimeout(Timer)//清除定时器
      CallBack(Result)
    }
    WaitingFuncAndDo('LocalCaseTool', 'addEvidence', [CaseId, Evidence, Creator, JSON.stringify(Path), Description, EvidentType, cb])
  }

  /**
   * 打开案件
   * @param {String} CaseId 案件Id
   * @param {Array} Type 证据类型
   */
  async OpenCase (CaseId: string, Type: string) {
    await   WaitingFuncAndDo('LocalCaseTool', 'openCase', [CaseId, JSON.stringify(Type)])
  }

  /**
   * 暂停解析
   */
  async StopProcess () {
    await WaitingFuncAndDo('LocalCaseTool', 'stopProcess')
  }

  /**
   * 打开多个证据
   * @param {Array} EvidencePaths 证件路径
   * @param CallBack 回调函数
   */
  // OpenMultipleEvidence: (EvidencePaths, CallBack) => {
  //   WaitingFunc('LocalCaseTool', () => {
  //     JavaClass.LocalCaseTool.openMultipleEvidence(JSON.stringify(EvidencePaths), (err, Msg) => {
  //       CallBackDone(err, Msg, 'OpenMultipleEvidence', CallBack)
  //     })
  //   })
  // },
  /**
   * 设置默认缓存目录
   * @param Path 路径
   */
  async SetTempPath (Path: string) {
    await WaitingFuncAndDo('PathTool', 'setTempPath', [Path])
  }

  /**
   * 设置案件目录
   * @param Path 路径
   */
  async SetCasePath (Path: string) {
    await WaitingFuncAndDo('PathTool', 'setCasesPath', [Path])
  }

  /**
   * 获取案件证据结构
   * @param {String} CaseId 案件Id
   * @param {String=} Type 类型
   */
  async GetEvidence (CaseId: string, Type?: string) {
    if (Type) {
      await    WaitingFuncAndDo('LocalCaseTool', 'getEvidence', [CaseId, Type])
    } else {
      await  WaitingFuncAndDo('LocalCaseTool', 'getEvidence', [CaseId])
    }
  }

  /**
   * 删除案件
   * @param CaseId 案件名
   */
  async DeleteCase (CaseId: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'deleteCase', [CaseId])
  }

  /**
   * 添加网络案件
   * @param {String}CaseName 案件名
   * @param {String}Creator 创建人
   * @param {String}Description 案件描述
   */
  async AddNetCase (CaseName: string, Creator: string, Description: string) {
    await WaitingFuncAndDo('NetCaseTool', 'addCase', [CaseName, Creator, Description])
  }

  /**
   * 共享案件
   * @param {String}NetCaseId 网络案件Id
   * @param {Array}UserId 共享用户Id
   * @param {Array}Powers 共享权限
   */
  async ShareCase (NetCaseId: string, UserId: Array<string>, Powers: Array<string>) {
    await  WaitingFuncAndDo('NetCaseTool', 'shareCase', [NetCaseId, JSON.stringify(UserId), JSON.stringify(Powers)])
  }

  /**
   * 修改共享信息
   * @param {String}NetCaseId 共享案件Id
   * @param {Array}UserId 共享用户Id
   * @param {Array}Powers 共享权限
   */
  async UpdateShareCase (NetCaseId: string, UserId: Array<string>, Powers: Array<string>) {
    await WaitingFuncAndDo('NetCaseTool', 'updataSharaCase', [NetCaseId, JSON.stringify(UserId), JSON.stringify(Powers)])
  }

  /**
   * 取消案件共享
   * @param {String}NetCaseId 共享案件Id
   * @param {Array}UserId 共享用户Id
   */
  async CancelShare (NetCaseId: string, UserId: Array<string>) {
    await WaitingFuncAndDo('NetCaseTool', 'reShareCase', [NetCaseId, JSON.stringify(UserId)])
  }

  /**
   * 获取网络案件
   */
  async GetNetCaseList () {
    await WaitingFuncAndDo('LocalCaseTool', 'getNetCaseList')
  }

  /**
   * 上传数据
   * @param Evidences 证据数组
   * @param MetCaseId 网络案件Id
   */
  async UploadData (Evidences: Array<string>, MetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'uploadData', [JSON.stringify(Evidences), MetCaseId])
  }

  /**
   * 获取网络案件证据结构
   * @param Evidences 证据数组
   * @param MetCaseId 网络案件Id
   */
  async GetNetCaseEvidence (Evidences: Array<string>, MetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'getEvidence', [JSON.stringify(Evidences), MetCaseId])
  }

  /**
   * 关闭案件
   */
  async CloseCase () {
    await WaitingFuncAndDo('LocalCaseTool', 'closeCase')
  }

  /**
   * 获取案件路径
   */
  async GetCasesPath () {
    await WaitingFuncAndDo('PathTool', 'getCasesPath')
  }

  /**
   * 获取缓存路径
   */
  async GetTempPath () {
    await WaitingFuncAndDo('PathTool', 'getTempPath')
  }

  /**
   * 案件预览列表
   * @param {String} CaseId 案件Id
   */
  async GetPreviewList (CaseId: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'getPreviewList', [CaseId])
  }

  /**
   * 预览一个案件
   * @param {String} Message 列表信息
   */
  async GetOnePreview (Message: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'getOnePreview', [Message])
  }

  /**
   * 添加备注
   * @param {String}Address 邮箱地址
   * @param {String}Remark 备注内容
   * @param {Function}CallBack 回调函数
   */
  AddRemark (Address: string, Remark: string, CallBack: Function) {
    WaitingFuncAndDo('LocalCaseTool', 'addRemark', [Address, Remark, CallBack])
  }

  /**
   * 获取地址备注
   * @param {String}Address 邮箱地址
   */
  async GetOneRemark (Address: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'getOneRemark', [Address])
  }

  /**
   * 获取备注集合
   */
  async GetRemarkList () {
    await WaitingFuncAndDo('LocalCaseTool', 'getRemarkList')
  }

  /**
   * 去重
   * @param {Boolean} Flag
   */
  async ReMd5 (Flag: boolean) {
    await WaitingFuncAndDo('LocalCaseTool', 'ReMd5', [Flag])
  }

  /**
   * 判断案件是否有数据
   * @param {String}CaseId 案件Id
   */
  async CaseIsEmpty (CaseId: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'caseIsEmpty', [CaseId])
  }

  /**
   * 打开文件
   * @param Id 文件Id
   */
  async OpenFile (Id: string) {
    await WaitingFuncAndDo('LocalCaseTool', 'openFile', [Id])
  }

  /**
   * 删除解析后生产的缓存文件
   * @param CaseId 案件Id
   */
  async DeleteTemp (CaseId: string) {
    await  WaitingFuncAndDo('LocalCaseTool', 'delectTemp', [CaseId])
  }

  /**
   * 将本地案件变为网络案件
   * @param {String}LocalCaseId 本地案件Id
   * @param {String}Path 网络案件保存路径
   */
  async UploadCase (LocalCaseId: string, Path: string) {
    await WaitingFuncAndDo('NetCaseTool', 'uploadCase', [LocalCaseId, Path])
  }

  /**
   * 将刚提交的成网络案件的数据上传
   * @param {String}LocalCaseId 本地案件Id
   * @param {Function}CallBack 回调函数
   */
  UploadAllEvidences (LocalCaseId: string, CallBack: Function) {
    let Timer: Timer

    function GetProgress () {
      if (StaticInfo.progressBar) {
        let Progress = JSON.parse(StaticInfo.progressBar)
        CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total})
        if (Progress.proNum === Progress.tatal) {
          clearTimeout(Timer)
        }
      }
      Timer = setTimeout(GetProgress, 500)
    }

    GetProgress()
    let cb = (Result: any) => {
      clearTimeout(Timer)//清除定时器
      CallBack(Result)
    }
    WaitingFuncAndDo('NetCaseTool', 'uploadAllEvidences', [LocalCaseId, cb])
  }

  /**
   * 上传本地数据到网络案件
   * @param {Array}Evidences 证据Id
   * @param {String}NetCaseId 网络案件id
   * @param {Function}CallBack 回调函数
   */
  UploadEvidences (Evidences: Array<string>, NetCaseId: string, CallBack: Function) {
    let Timer: Timer

    function GetProgress () {
      if (StaticInfo.progressBar) {
        let Progress = JSON.parse(StaticInfo.progressBar)
        CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total})
        if (Progress.proNum === Progress.tatal) {
          clearTimeout(Timer)
        }
      }
      Timer = setTimeout(GetProgress, 500)
    }

    GetProgress()
    let cb = (Result: any) => {
      clearTimeout(Timer)//清除定时器
      CallBack(Result)
    }
    WaitingFuncAndDo('NetCaseTool', 'uploadEvidences', [JSON.stringify(Evidences), NetCaseId, cb])
  }

  /**
   * 获取用户对案件的权限
   * @param {String}NetCaseId 网络案件Id
   * @param {String}UserId 用户Id
   */
  async GetNetCasePowers (NetCaseId: string, UserId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'getCasePowers', [NetCaseId, UserId])
  }

  /**
   * 离线案件
   * @param {String}NetCaseId 网络案件Id
   */
  async OfflineCase (NetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'getCase', [NetCaseId])
  }

  /**
   * 判断网络案件是否离线
   * @param {String}NetCaseId 网络案件Id
   */
  async OfflineCaseJudge (NetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'offOnline', [NetCaseId])
  }

  /**
   * 下载网络案件数据
   * @param {String}NetCaseId 网络案件Id
   * @param {String}CasePath 存放目录
   * @param {Function}CallBack 回调函数
   */
  DownloadNetCase (NetCaseId: string, CasePath: string, CallBack: Function) {
    let Timer: Timer

    function GetProgress () {
      if (StaticInfo.progressBar) {
        let Progress = JSON.parse(StaticInfo.progressBar)
        CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total})
        if (Progress.proNum === Progress.tatal) {
          clearTimeout(Timer)
        }
      }
      Timer = setTimeout(GetProgress, 500)
    }

    GetProgress()

    let cb = (Result: any) => {
      clearTimeout(Timer)
      CallBack(Result)
    }

    WaitingFuncAndDo('NetCaseTool', 'downloadCase', [NetCaseId, CasePath, cb])
  }

  /**
   * 下载网络案件单个证据
   * @param {String}NetCaseId 网络案件Id
   * @param {String}EvidenceId 证据Id
   */
  DownloadNetCaseEvidence (NetCaseId: string, EvidenceId: string, CallBack: Function) {
    let Timer: Timer

    function GetProgress () {
      if (StaticInfo.progressBar) {
        let Progress = JSON.parse(StaticInfo.progressBar)
        CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total})
        if (Progress.proNum === Progress.tatal) {
          clearTimeout(Timer)
        }
      }
      Timer = setTimeout(GetProgress, 500)
    }

    GetProgress()

    let cb = (Result: any) => {
      clearTimeout(Timer)
      CallBack(Result)
    }
    WaitingFuncAndDo('NetCaseTool', 'downloadEvidence', [NetCaseId, EvidenceId, cb])
  }

  /**
   * 获取案件是否下载数据
   * @param {String}NetCaseId 网络案件Id
   */
  async GetNetCaseState (NetCaseId: string) {
    await   WaitingFuncAndDo('NetCaseTool', 'getCaseState', [NetCaseId])
  }

  /**
   * 清除网络案件缓存
   * @param {String}NetCaseId 网络案件Id
   */
  async ClearNetCaseData (NetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'clearCaseData', [NetCaseId])
  }

  /**
   * 删除网络案件
   * @param {String}NetCaseId 网络案件Id
   */
  async DeleteNetCase (NetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'deleteCase', [NetCaseId])
  }

  /**
   * 缓存网络案件临时数据
   * @param {String}NetCaseId 网络案件
   */
  async GetNetCaseTemp (NetCaseId: string) {
    await WaitingFuncAndDo('NetCaseTool', 'getCaseTemp', [NetCaseId])
  }

  /**
   * 取消上传
   */
  async StopUpload () {
    await WaitingFuncAndDo('NetCaseTool', 'stopUpload')
  }
}

class Mark {
  constructor () {
  }

  /**
   * 创建标记
   * @param MarkName 标记名称
   * @param Description 标记描述
   * @param Color 颜色
   */
  async CreateMark (MarkName: string, Description: string, Color: string) {
    await WaitingFuncAndDo('MarkTool', 'createMark', [MarkName, Description, Color])
  }

  /**
   * 添加标记
   * @param {String} MarkName 标记名称
   * @param {Array} Id 数据Id
   */
  async AddMark (MarkName: string, Id: Array<string>) {
    await WaitingFuncAndDo('MarkTool', 'addMark', [MarkName, JSON.stringify(Id)])
  }

  /**
   * 获取标记列表
   */
  async GetMarkList () {
    await   WaitingFuncAndDo('MarkTool', 'getMarkList')
  }

  /**
   * 删除标记
   * @param {Array}MarkName 标记名称
   */
  async DeleteMark (MarkName: Array<string>) {
    await WaitingFuncAndDo('MarkTool', 'delectMark', [JSON.stringify(MarkName)])
  }

  /**
   * 移除标记
   * @param {Array} Ids 邮件id
   */
  async RemoveMark (Ids: Array<string>) {
    await WaitingFuncAndDo('MarkTool', 'removeMark', [JSON.stringify(Ids)])
  }

  /**
   * 标记所有
   * @param {String} MarkName 标记名称
   */
  async MarkAll (MarkName: string) {
    await WaitingFuncAndDo('MarkTool', 'addAll', [MarkName])
  }

  /**
   * 获取所有标记过的邮件列表
   * 无效
   * @param {Array} MarkName 标记名称
   * @param {Function} CallBack 回调函数
   */
  async GetNetMarkMailList (MarkName: string) {
    await WaitingFuncAndDo('NetMarkTool', 'getAllList', [JSON.stringify(MarkName)])
  }

  /**
   * 获取网络标记列表
   */
  async GetNetMarkList () {
    await WaitingFuncAndDo('NetMarkTool', 'getAllMarks')
  }

  /**
   * 创建网络标记
   * @param {String}MarkName 标记名称
   * @param {String}Description 标记描述
   * @param {String}Color 标记颜色
   * @param {Boolean}IsPublic 是否公开
   */
  async AddNetMark (MarkName: string, Description: string, Color: string, IsPublic: boolean) {
    await WaitingFuncAndDo('NetMarkTool', 'addMark', [MarkName, Description, Color, IsPublic])
  }

  /**
   * 删除网络标记
   * @param {Array}MarkName 标记名称
   */
  async DelNetMark (MarkName: Array<string>) {
    await WaitingFuncAndDo('NetMarkTool', 'delMark', [JSON.stringify(MarkName)])
  }

  /**
   * 网络标记数据
   * @param {Array}Ids 邮件Id
   * @param {String}MarkName 标记名称
   */
  async NetMarkMail (Ids: Array<string>, MarkName: string) {
    await WaitingFuncAndDo('NetMarkTool', 'addMailMarks', [JSON.stringify(Ids), MarkName])
  }

  /**
   * 更新网络标记
   * @param {String}MarkName 标记名称
   * @param {String}Description 标记描述
   * @param {String}Color 标记颜色
   * @param {Boolean}IsPublic 是否公开
   */
  async UpdateNetMark (MarkName: string, Description: string, Color: string, IsPublic: boolean) {
    await  WaitingFuncAndDo('NetMarkTool', 'updateMark', [MarkName, Description, Color, IsPublic])
  }

  /**
   * 移除网络标记
   * @param {Array}Ids 邮件Id
   */
  async RemoveNetMarkMail (Ids: Array<string>) {
    await  WaitingFuncAndDo('NetMarkTool', 'removeMailMark', [JSON.stringify(Ids)])
  }

  /**
   * 更新网络邮件的标记
   * 无效
   * @param Ids 邮件Id
   * @param MarkName 标记名称
   */
  async UpdateNetMarkMail (Ids: Array<string>, MarkName: string) {
    await  WaitingFuncAndDo('NetMarkTool', 'updateMailMark', [JSON.stringify(Ids), MarkName])
  }

  /**
   * 网络标记所有数据
   * @param {String}MarkName 标记名称
   */
  async AddAllMailMark (MarkName: string) {
    await   WaitingFuncAndDo('NetMarkTool', 'addAllMailMark', [MarkName])
  }
}

class Search {
  constructor () {
  }

  /**
   * 预览单条数据
   * @param Id 数据Id
   */
  async SearchOne (Id: string) {
    await  WaitingFuncAndDo('SearchTool', 'searchOne', [Id])
  }

  /**
   * 获取单页数据
   * @param Query 查询条件
   * @param Start 其实页
   * @param RowCount 页大小
   * @param Sort 排序
   */
  async GetPage (Query: any, Start: number, RowCount: number, Sort: any) {
    await WaitingFuncAndDo('SearchTool', 'getPage', [JSON.stringify(Query), Start, RowCount, JSON.stringify(Sort)])
  }

  /**
   * 添加已读文件
   * @param Id 邮件Id
   */
  async ReadFile (Id: string) {
    await WaitingFuncAndDo('SearchTool', 'readFile', [Id])
  }

  /**
   * 获取已读文件列表
   * @param CallBack 回调函数
   */
  async GetReadFiles () {
    await WaitingFuncAndDo('SearchTool', 'getReadFiles')
  }

  /**
   * 获取智能统计数据
   * @param {Array} Query 查询条件
   * @param {String} Type 类型
   */
  async GetTaxoData (Query: Array<string>, Type: string) {
    await   WaitingFuncAndDo('SearchTool', 'getTaxoData', [JSON.stringify(Query), Type])
  }

  /**
   * 获取搜索历史
   * @param {String} Type 类型
   */
  async GetHistory (Type: string) {
    await WaitingFuncAndDo('SearchTool', 'getHistory', [Type])
  }

  /**
   * 删除搜索记录
   * @param {String} Query 需要删除的搜索记录
   * @param {String} Type 类型
   */
  async DeleteHistory (Query: string, Type: string) {
    await WaitingFuncAndDo('SearchTool', 'deleteHistory', [Query, Type])
  }

  /**
   * 清除历史搜索
   * @param {String} Type 类型
   */
  async ClearHistory (Type: string) {
    await    WaitingFuncAndDo('SearchTool', 'clearHistory', [Type])
  }

  /**
   * 所有邮件地址
   */
  async ReAllAddress () {
    await  WaitingFuncAndDo('SearchTool', 'reAllAdress')
  }

  /**
   * 导出视图
   * @param {String} Name 文件名
   * @param {String} Path 文件路径
   * @param {String} Id 导出证据ID
   */
  async ExportDataSource (Name: string, Path: string, Id: string) {
    await    WaitingFuncAndDo('SearchTool', 'ExportDataSource', [Name, Path, Id])
  }
}

class Role {
  constructor () {
  }

  /**
   * 创建角色
   * @param {String}RoleName 角色名称
   * @param {Array}Powers 角色权限
   * @param {String}ClassId 部门Id
   */
  async CreateRole (RoleName: string, Powers: Array<string>, ClassId: string) {
    await WaitingFuncAndDo('RoleTool', 'createRole', [RoleName, JSON.stringify(Powers), ClassId])
  }

  /**
   * 更新角色
   * @param {String}RoleName 角色名称
   * @param {Array}Powers 角色权限
   * @param {String}ClassId 部门名
   */
  async UpdateRole (RoleName: string, Powers: Array<string>, ClassId: string) {
    await WaitingFuncAndDo('RoleTool', 'updataRole', [RoleName, JSON.stringify(Powers), ClassId])
  }

  /**
   * 删除角色
   * @param {Array}RoleName 角色名称
   * @param {String}ClassId 部门名
   */
  async DeleteRole (RoleName: Array<string>, ClassId: string) {
    await WaitingFuncAndDo('RoleTool', 'deleteRole', [JSON.stringify(RoleName), ClassId])
  }

  /**
   * 添加角色到用户
   * @param RoleName 角色名称
   * @param UserId 用户Id
   */
  async AddRole (RoleName: string, UserId: string) {
    await WaitingFuncAndDo('RoleTool', 'addRole', [RoleName, UserId])
  }

  /**
   * 获取当前部门的角色列表
   * @param {String}ClassId 部门Id
   */
  async GetRoleList (ClassId: string) {
    await WaitingFuncAndDo('RoleTool', 'getRoleList', [ClassId])
  }

  /**
   * 获取当前部门及子部门的角色
   * @param ClassId 部门Id
   */
  async GetAllRoleList (ClassId: string) {
    await WaitingFuncAndDo('RoleTool', 'getAllRoleList', [ClassId])
  }
}

class User {
  constructor () {
  }

  /**
   * 添加用户
   * @param {String}UserName 用户名
   * @param {String}PassWord 密码
   * @param {String}ClassId 部门Id
   * @param {String}Number 警号
   * @param {String}Phone 手机号
   * @param {String}RoleName 角色名
   * @param {String}IdCard 身份证
   * @param {String}Name 名称
   */
  async CreateUser (UserName: string, PassWord: string, ClassId: string, Number: string, Phone: string, RoleName: string, IdCard: string, Name: string) {
    await  WaitingFuncAndDo('UserTool', 'createUser', [UserName, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name])
  }

  /**
   * 更新用户
   * @param {String}UserId 用户Id
   * @param {String}PassWord 密码
   * @param {String}ClassId 部门名
   * @param {String}Number 警号
   * @param {String}Phone 手机号
   * @param {String}RoleName 角色名
   * @param {String}IdCard 身份证
   * @param {String}Name 姓名
   */
  async UpdateUser (UserId: string, PassWord: string, ClassId: string, Number: string, Phone: string, RoleName: string, IdCard: string, Name: string) {
    await WaitingFuncAndDo('UserTool', 'updataUser', [UserId, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name])
  }

  /**
   * 用户登录
   * @param UserName 用户名
   * @param PassWord 密码
   */
  async Login (UserName: string, PassWord: string) {
    await WaitingFuncAndDo('UserTool', 'login', [UserName, PassWord])
  }

  /**
   * 删除用户
   * @param {Array}UserId 用户Id
   */
  async DeleteUser (UserId: string) {
    await  WaitingFuncAndDo('UserTool', 'deleteUser', [JSON.stringify(UserId)])
  }

  /**
   * 获取用户列表
   * @param {String}ClassId 部门Id
   */
  async GetUserList (ClassId: string) {
    await WaitingFuncAndDo('UserTool', 'getUserList', [ClassId])
  }

  /**
   * 获取当前部门及子部门的用户列表
   * @param ClassId 部门Id
   */
  async GetAllUserList (ClassId: string) {
    await WaitingFuncAndDo('UserTool', 'getAllUserList', [ClassId])
  }

  /**
   * 给用户添加角色
   * @param {String}RoleName 角色名
   * @param {String}UserId 用户Id
   */
  async AddRole (RoleName: string, UserId: string) {
    await   WaitingFuncAndDo('UserTool', 'addRole', [RoleName, UserId])
  }

  /**
   * 判断用户是否登录
   */
  async IsOnLine () {
    await    WaitingFuncAndDo('UserTool', 'isOnline')
  }

  /**
   * 获取权限
   * @param {String}ClassId 部门Id
   */
  async GetPowers (ClassId: string) {
    await WaitingFuncAndDo('UserTool', 'getPowers', [ClassId])
  }

  /**
   * 测试连接
   * @param {String}Address Ip地址
   */
  async GetOnline (Address: string) {
    await        WaitingFuncAndDo('UserTool', 'getOnline', [Address])
  }

  /**
   * 退出登录
   */
  async Logout () {
    await WaitingFuncAndDo('UserTool', 'logout')
  }

  /**
   * 获取Ip
   */
  async GetIp () {
    await WaitingFuncAndDo('UserTool', 'getIp')
  }

  /**
   * 设置Ip
   * @param {String}Ip Ip地址
   */
  async SetIp (Ip: string) {
    await        WaitingFuncAndDo('UserTool', 'setIp', [Ip])
  }

  /**
   * 获取分享案件的部门用户
   * @param {String}ClassId 部门Id
   * @param {String}CaseId 案件Id
   */
  async GetCaseUserList (ClassId: string, CaseId: string) {
    await WaitingFuncAndDo('UserTool', 'getCaseUserList', [ClassId, CaseId])
  }

  /**
   * 获取案件的所有共享人
   * @param {String}CaseId 案件Id
   */
  async GetCaseManager (CaseId: string) {
    await WaitingFuncAndDo('UserTool', 'getCaseManagers', [CaseId])
  }
}

class Export {
  /**
   * 导出到HTML
   * @param {Object} Param 导出参数
   */
  async ToHtml (Param: any) {
    await WaitingFuncAndDo('ExportFileHtml', 'export', [JSON.stringify(Param)])
  }
}

class RelationShip {
  constructor () {
  }

  /**
   * 获取关系图数据
   * @param {Array} Param 参数
   * @param {String} Type 类型
   * @param {Object} Filter 数据过滤
   * @param {Function}CallBack 回调函数
   */
  GetShipData (Param: Array<string>, Type: string, Filter: any, CallBack: Function) {
    let cb = (MSG: any) => {
      if (MSG.State) {
        let Path = resolve(__dirname, 'app/data/relationship.json')
        Common.CheckAndCreatePath(dirname(Path))
        writeFile(join(__dirname, 'app/data/relationship.json'), MSG.Data, (err) => {
          if (err) {
            LogHelper.writeErr(err)
            MSG.State = false
            MSG.Msg = 'Write Data To JSON Error'
            CallBack(MSG)
          } else {
            CallBack(MSG)
          }
        })
      } else {
        CallBack(MSG)
      }
    }
    WaitingFuncAndDo('RelationShip', 'reShip', [JSON.stringify(Param), Type, JSON.stringify(Filter), cb])
  }

  /**
   * 关系图所有邮件地址
   */
  async ReAllAddress () {
    await WaitingFuncAndDo('RelationShip', 'reAllAdress')
  }

  /**
   * 获取地址不同昵称
   * @param {String}Address 邮件地址
   */
  async RePerson (Address: string) {
    await  WaitingFuncAndDo('RelationShip', 'rePerson', [Address])
  }

  /**
   * 获取昵称不同地址
   * @param {String}Person 昵称
   */
  async ReAddress (Person: string) {
    await WaitingFuncAndDo('RelationShip', 'reAdress', [Person])
  }
}

class Phone {
  constructor () {
  }

  /**
   * 添加证据
   * @param {Array} FilePath 文件路径
   * @param {String} ModelName 模版名称
   * @param {String} CaseId 案件ID
   * @param {String} EvidenceName 证据名称
   * @param {String} Creator 创建人
   * @param {String} Description 描述
   */
  async AddEvidence (CaseId: string, EvidenceName: string, Creator: string, FilePath: Array<string>, Description: string, ModelName: string) {
    await WaitingFuncAndDo('PhoneTool', 'addEvidence', [CaseId, EvidenceName, Creator, JSON.stringify(FilePath), Description, ModelName])
  }

  /**
   * 创建模版
   * @param {String} Name 模版名称
   * @param {Number} MyNum 主叫号码
   * @param {Number} ONum 被叫号码
   * @param {Number} DateNum 通话时间
   * @param {Number} TimeNum 通话时长
   * @param {Number} TypeNum 通话类型
   */
  async CreateModel (Name: string, MyNum: number, ONum: number, DateNum: number, TimeNum: number, TypeNum: number) {
    await WaitingFuncAndDo('PhoneTool', 'createModel', [Name, MyNum, ONum, DateNum, TimeNum, TypeNum])
  }

  /**
   * 获取模版列表
   */
  async GetModelList () {
    await WaitingFuncAndDo('PhoneTool', 'getModelList')
  }

  /**
   * 获取模版
   * @param {String} ModelName 模版名称
   */
  async GetModel (ModelName: string) {
    await    WaitingFuncAndDo('PhoneTool', 'getModel', [ModelName])
  }

  /**
   * 更新模版
   * @param {String} Name 模版名称
   * @param {Number} MyNum 主叫号码
   * @param {Number} ONum 被叫号码
   * @param {Number} DateNum 通话时间
   * @param {Number} TimeNum 通话时长
   * @param {Number} TypeNum 通话类型
   */
  async UpdateModel (Name: string, MyNum: number, ONum: number, DateNum: number, TimeNum: number, TypeNum: number) {
    await WaitingFuncAndDo('PhoneTool', 'createModel', [Name, MyNum, ONum, DateNum, TimeNum, TypeNum])
  }

  /**
   * 删除模版
   * @param {String} ModelName 模版名称
   */
  async DeleteModel (ModelName: string) {
    await  WaitingFuncAndDo('PhoneTool', 'getModel', [ModelName])
  }
}

class CheckTime {
  constructor () {
  }

  /**
   * 检测
   */
  async Check () {
    await WaitingFuncAndDo('CheckTime', 'check')
  }
}

class Class {
  constructor () {
  }

  /**
   * 添加一个部门
   * @param {String}ClassName 部门名称
   * @param {String=}FatherId 上级部门Id
   */
  async AddClass (ClassName: string, FatherId: string) {
    await WaitingFuncAndDo('ClassTool', 'addOne', [ClassName, FatherId])
  }

  /**
   * 获取所有部门列表
   */
  async GetList () {
    await   WaitingFuncAndDo('ClassTool', 'getList')
  }

  /**
   * 删除部门
   * @param {String}ClassId 部门Id
   */
  async DeleteClass (ClassId: string) {
    await WaitingFuncAndDo('ClassTool', 'deletOne', [ClassId])
  }

  /**
   * 修改部门
   * @param {String}ClassId 部门Id
   * @param {String}NewClassName 新部门名称
   * @param {String}FatherId 父级部门Id
   */
  async UpdateClass (ClassId: string, NewClassName: string, FatherId: string) {
    await WaitingFuncAndDo('ClassTool', 'updataClass', [ClassId, NewClassName, FatherId])
  }

  /**
   * 获取用户日志
   * @param {String}UserId 用户Id
   */
  async GetUserLog (UserId: string) {
    await  WaitingFuncAndDo('ClassTool', 'getUserLog', [UserId])
  }

  /**
   * 获取当前部门日志
   * @param {String}ClassId 部门Id
   */
  async GetClassLog (ClassId: string) {
    await WaitingFuncAndDo('ClassTool', 'getClassLog', [ClassId])
  }

  /**
   * 获取当前部门及子部门
   * @param {String}ClassId 部门Id
   */
  async GetAllClassLog (ClassId: string) {
    await WaitingFuncAndDo('ClassTool', 'getAllClassLog', [ClassId])
  }

  /**
   * 获取所有日志
   */
  async GetAllLog () {
    await  WaitingFuncAndDo('ClassTool', 'getAlllog')
  }

  /**
   * 获取案件日志
   * @param {String}CaseId 案件Id
   */
  async GetCaseLog (CaseId: string) {
    await WaitingFuncAndDo('ClassTool', 'getCaseLog', [CaseId])
  }

  /**
   * 获取当前和子集部门
   * @param {String}ClassId 部门Id
   */
  async GetChildrenList (ClassId: string) {
    await WaitingFuncAndDo('ClassTool', 'getChildrenList', [ClassId])
  }
}

/**
 * 初始化Java
 */
function Init () {
  try {
    java.classpath.push(resolve(__dirname, '../Java/FileAnalysis.jar'))//引用jar包
    StaticInfo = java.import('Static.StaticInfo')//引用静态类
  } catch (e) {
    LogHelper.writeErr(e)
  }

  java.newInstance('tool.Start', (err: string, Start: any) => {//实例化Start类
    if (err) {
      LogHelper.writeErr(err)
    } else {
      Start.start((err: string) => {//初始化程序
        if (err) {
          LogHelper.writeErr(err)
        } else {
          LogHelper.writeInfo('Application Init')
          ee.emit('Started')
        }
      })
    }
  })
}

// declare module java {
//   import java from 'java'
//   export default  java
// }

/**
 * 检测Jre环境是否存在
 */
function CheckedJre () {
  LogHelper.writeInfo('Checking Jre')

  let dll, dylib, so, binary, home = __dirname,
    jvmPathx86 = resolve(__dirname, '../jre/bin/client/jvm.dll'),
    jvmPathx64 = resolve(__dirname, '../jre/bin/server/jvm.dll')
  dll = existsSync(jvmPathx86) ? jvmPathx86 : jvmPathx64

  binary = dll || dylib || so

  let jvm_dll_path = resolve(__dirname, '../node_modules/java/build/jvm_dll_path.json')
  let jvmPath = binary ? JSON.stringify(delimiter + dirname(resolve(home, binary))) : '""'
  if (existsSync(jvm_dll_path)) {
    readFile(jvm_dll_path, (err, text) => {
      if (err) LogHelper.writeErr(err)
      if (text.toString() === jvmPath) {
        ImportJava()
      } else {
        WriteJvmPath()
      }
    })
  } else {
    WriteJvmPath()
  }

  /**
   * 写入Jvm路径
   */
  function WriteJvmPath () {
    LogHelper.writeInfo('WriteJvmPath')
    writeFile(jvm_dll_path, jvmPath, (err) => {
      if (!err) {
        ImportJava()
      } else {
        LogHelper.writeErr(err)
      }
    })
  }

  /**
   * 导入java
   */
  function ImportJava () {
    LogHelper.writeInfo('ImportJava')
    import('java').then((module) => {
      java = module
      Init()
    }).catch((err) => {
      LogHelper.writeErr(err)
    })
  }

}

/**
 *@param {String} Class 类名
 * 等待Java程序初始化
 */
function InitClass (Class: string) {
  return new Promise((resolve, reject) => {
    java.newInstance('file.' + Class, (err: string, NewClass: any) => {//实例化Java类
      if (err) {//实例化错误
        LogHelper.writeErr(err)
        reject(err)
      } else {
        JavaClass[Class] = NewClass
        resolve(true)
      }
    })
  })
}

/**
 * 等待类实例化并统一执行
 * @param ClassName 类名
 * @param FuncName 方法名
 * @param {Array=}Args 参数
 */
async function WaitingFuncAndDo (ClassName: string, FuncName: string, Args?: Array<number | string | Function | boolean>) {
  return new Promise(async (resolve) => {
    if (!JavaClass[ClassName]) if (!await InitClass(ClassName)) throw new Error(`类:${ClassName} 实例化失败`)
    if (!Args) Args = []
    Args[Args.length] = (err: string, Msg: any) => {
      if (err) {//调用失败
        LogHelper.writeErr(err)
        resolve({State: false, Msg: 'Call Method:' + FuncName + ' Error'})
      } else {//调用成功
        let Res
        try {
          Res = JSON.parse(Msg)//解析消息体
        } catch (err) {
          LogHelper.writeErr(err)
          resolve({State: false, Msg: '无法解析数据:' + Msg})
        }
        if (Res.State) {//成功消息
          resolve({State: true, Msg: Res.Msg, Data: Res.Data})
        } else {//错误消息
          resolve({State: false, Msg: Res.Msg})
        }
      }
    }
    JavaClass[ClassName][FuncName](...Args)
  })
}

// export default $this;

export default class {
  public Case: Case
  public Mark: Mark
  public Search: Search
  public Role: Role
  public User: User
  public Export: Export
  public Phone: Phone
  public Class: Class
  public CheckTime: CheckTime
  public RelationShip: RelationShip

  constructor () {
    CheckedJre()
    this.Case = new Case()
    this.Mark = new Mark()
    this.Search = new Search()
    this.Role = new Role()
    this.User = new User()
    this.Export = new Export()
    this.Phone = new Phone()
    this.Class = new Class()
    this.CheckTime = new CheckTime()
    this.RelationShip = new RelationShip()
  }
}
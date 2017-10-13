/**
 * Created by admin on 2017/3/27.
 */
import path from 'path'
import fs from 'fs'
import LogHelper from './LogHelper'
import { EventEmitter } from 'events'
import Common from './Common'

let ee = new EventEmitter();//声明事件发生器
let java, StaticInfo;//声明java 对象和静态类
let JavaClass = {
  LocalCaseTool: null,
  MarkTool: null,
  NetMarkTool: null,
  PathTool: null,
  SearchTool: null,
  RoleTool: null,
  UserTool: null,
  NetCaseTool: null,
  ExportFileHtml: null,
  RelationShip: null,
  PhoneTool: null,
  CheckTime: null,
  ClassTool: null,
};//声明java包

const $this = {
  /**
   * Java初始化完成
   * @param CallBack 回调函数
   */
  OnStarted: (CallBack) => {
    ee.on('Started', () => {
      CallBack();
      WaitingStart()
    })
  },
  /**
   * 发生错误
   * @param CallBack
   */
  OnError: (CallBack) => {
    ee.on('Error', (err) => {
      CallBack(err)
    })
  },
  /**
   * 案件类
   */
  Case: {
    /**
     * 添加案件
     * @param CaseName 案件名
     * @param Creator 创建人
     * @param CasePath 案件路径
     * @param TempPath 缓存路径
     * @param Description 案件描述
     * @param EvidencePaths 证据列表
     * @param CallBack 回调函数
     */
    AddCase: (CaseName, Creator, CasePath, TempPath, Description, EvidencePaths, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'addCase', [CaseName, Creator, CasePath, TempPath, Description, JSON.stringify(EvidencePaths), CallBack])
    },
    /**
     * 获取案件列表
     * @param CallBack 回调函数
     */
    GetCaseList: (CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'getCaseList', [CallBack])
    },
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
    AddEvidence: (CaseId, Evidence, Creator, Path, Description, EvidentType, CallBack) => {
      let Timer;

      function GetProgress () {
        if (StaticInfo.progressBar) {
          let Progress = JSON.parse(StaticInfo.progressBar);
          CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total});
          if (Progress.proNum === Progress.tatal) {
            clearTimeout(Timer)
          }
        }
        Timer = setTimeout(GetProgress, 500)
      }

      GetProgress();

      let cb = (Result) => {
        clearTimeout(Timer);//清除定时器
        CallBack(Result)
      };
      WaitingFuncAndDo('LocalCaseTool', 'addEvidence', [CaseId, Evidence, Creator, JSON.stringify(Path), Description, EvidentType, cb])
    },
    /**
     * 打开案件
     * @param {String} CaseId 案件Id
     * @param {Array} Type 证据类型
     * @param {Function} CallBack 回调函数
     */
    OpenCase: (CaseId, Type, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'openCase', [CaseId, JSON.stringify(Type), CallBack])
    },
    /**
     * 暂停解析
     * @param CallBack
     */
    StopProcess: (CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'stopProcess', [CallBack])
    },
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
     * @param CallBack 回调函数
     */
    SetTempPath: (Path, CallBack) => {
      WaitingFuncAndDo('PathTool', 'setTempPath', [Path, CallBack])
    },
    /**
     * 设置案件目录
     * @param Path 路径
     * @param CallBack 回调函数
     */
    SetCasePath: (Path, CallBack) => {
      WaitingFuncAndDo('PathTool', 'setCasesPath', [Path, CallBack])
    },
    /**
     * 获取案件证据结构
     * @param {String} CaseId 案件Id
     * @param {String=} Type 类型
     * @param {Function} CallBack 回调函数
     */
    GetEvidence: (CaseId, Type, CallBack) => {
      if (Type) {
        WaitingFuncAndDo('LocalCaseTool', 'getEvidence', [CaseId, Type, CallBack])
      } else {
        WaitingFuncAndDo('LocalCaseTool', 'getEvidence', [CaseId, CallBack])
      }
    },
    /**
     * 删除案件
     * @param CaseId 案件名
     * @param CallBack 回调函数
     */
    DeleteCase: (CaseId, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'deleteCase', [CaseId, CallBack])
    },
    /**
     * 添加网络案件
     * @param CaseName 案件名
     * @param Creator 创建人
     * @param Description 案件描述
     * @param CallBack 回调函数
     */
    AddNetCase: (CaseName, Creator, Description, CallBack) => {
      WaitingFuncAndDo('NetCaseTool', 'addCase', [CaseName, Creator, Description, CallBack])
    },
    /**
     * 共享案件
     * @param {String}NetCaseId 网络案件Id
     * @param {Array}UserId 共享用户Id
     * @param {Array}Powers 共享权限
     * @param {Function}CallBack 回调函数
     */
    ShareCase: (NetCaseId, UserId, Powers, CallBack) => {
      WaitingFuncAndDo('NetCaseTool', 'shareCase', [NetCaseId, JSON.stringify(UserId), JSON.stringify(Powers), CallBack])
    },
    /**
     * 修改共享信息
     * @param {String}NetCaseId 共享案件Id
     * @param {Array}UserId 共享用户Id
     * @param {Array}Powers 共享权限
     * @param {Function}CallBack 回调函数
     */
    UpdateShareCase: (NetCaseId, UserId, Powers, CallBack) => {
      WaitingFuncAndDo('NetCaseTool', 'updataSharaCase', [NetCaseId, JSON.stringify(UserId), JSON.stringify(Powers), CallBack])
    },
    /**
     * 取消案件共享
     * @param {String}NetCaseId 共享案件Id
     * @param {Array}UserId 共享用户Id
     * @param {Function}CallBack 回调函数
     */
    CancelShare: (NetCaseId, UserId, CallBack) => {
      WaitingFuncAndDo('NetCaseTool', 'reShareCase', [NetCaseId, JSON.stringify(UserId), CallBack])
    },
    /**
     * 获取网络案件
     * @param {Function}CallBack 回调函数
     */
    GetNetCaseList: (CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'getNetCaseList', [CallBack])
    },
    /**
     * 上传数据
     * @param Evidences 证据数组
     * @param MetCaseId 网络案件Id
     * @param CallBack
     * @constructor
     */
    UploadData: (Evidences, MetCaseId, CallBack) => {
      WaitingFuncAndDo('NetCaseTool', 'uploadData', [JSON.stringify(Evidences), MetCaseId, CallBack])
    },
    /**
     * 获取网络案件证据结构
     * @param Evidences 证据数组
     * @param MetCaseId 网络案件Id
     * @param CallBack 回调函数
     */
    GetNetCaseEvidence: (Evidences, MetCaseId, CallBack) => {
      WaitingFuncAndDo('NetCaseTool', 'getEvidence', [JSON.stringify(Evidences), MetCaseId, CallBack])
    },
    /**
     * 关闭案件
     * @param CallBack 回调函数
     */
    CloseCase: (CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'closeCase', [CallBack])
    },
    /**
     * 获取案件路径
     * @param {Function} CallBack 回调函数
     */
    GetCasesPath: (CallBack) => {
      WaitingFuncAndDo('PathTool', 'getCasesPath', [CallBack])
    },
    /**
     * 获取缓存路径
     * @param {Function} CallBack 回调函数
     */
    GetTempPath: (CallBack) => {
      WaitingFuncAndDo('PathTool', 'getTempPath', [CallBack])
    },
    /**
     * 案件预览列表
     * @param {String} CaseId 案件Id
     * @param {Function} CallBack 回调函数
     */
    GetPreviewList: (CaseId, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'getPreviewList', [CaseId, CallBack])
    },
    /**
     * 预览一个案件
     * @param {String} Message 列表信息
     * @param {Function}CallBack 回调函数
     */
    GetOnePreview: (Message, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'getOnePreview', [Message, CallBack])
    },
    /**
     * 添加备注
     * @param {String}Address 邮箱地址
     * @param {String}Remark 备注内容
     * @param {Function}CallBack 回调函数
     */
    AddRemark: (Address, Remark, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'addRemark', [Address, Remark, CallBack])
    },
    /**
     * 获取地址备注
     * @param {String}Address 邮箱地址
     * @param {Function}CallBack 回调函数
     */
    GetOneRemark: (Address, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'getOneRemark', [Address, CallBack])
    },
    /**
     * 获取备注集合
     * @param {Function} CallBack 回调函数
     */
    GetRemarkList: (CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'getRemarkList', [CallBack])
    },
    /**
     * 去重
     * @param {Boolean} Flag
     * @param {Function}CallBack 回调函数
     */
    ReMd5: (Flag, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'ReMd5', [Flag, CallBack])
    },
    /**
     * 判断案件是否有数据
     * @param {String}CaseId 案件Id
     * @param {Function}CallBack 回调函数
     */
    CaseIsEmpty: (CaseId, CallBack) => {
      WaitingFuncAndDo('LocalCaseTool', 'caseIsEmpty', [CaseId, CallBack])
    },
    /**
     * 打开文件
     * @param Id 文件Id
     * @param CallBack 回调函数
     */
    OpenFile (Id, CallBack) {
      WaitingFuncAndDo('LocalCaseTool', 'openFile', [Id, CallBack])
    },
    /**
     * 删除解析后生产的缓存文件
     * @param CaseId 案件Id
     * @param CallBack 回调函数
     */
    DeleteTemp (CaseId, CallBack) {
      WaitingFuncAndDo('LocalCaseTool', 'delectTemp', [CaseId, CallBack])
    },
    /**
     * 将本地案件变为网络案件
     * @param {String}LocalCaseId 本地案件Id
     * @param {String}Path 网络案件保存路径
     * @param {Function}CallBack 回调函数
     */
    UploadCase (LocalCaseId, Path, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'uploadCase', [LocalCaseId, Path, CallBack])
    },
    /**
     * 将刚提交的成网络案件的数据上传
     * @param {String}LocalCaseId 本地案件Id
     * @param {Function}CallBack 回调函数
     */
    UploadAllEvidences (LocalCaseId, CallBack) {
      let Timer;

      function GetProgress () {
        if (StaticInfo.progressBar) {
          let Progress = JSON.parse(StaticInfo.progressBar);
          CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total});
          if (Progress.proNum === Progress.tatal) {
            clearTimeout(Timer)
          }
        }
        Timer = setTimeout(GetProgress, 500)
      }

      GetProgress();
      let cb = (Result) => {
        clearTimeout(Timer);//清除定时器
        CallBack(Result)
      };
      WaitingFuncAndDo('NetCaseTool', 'uploadAllEvidences', [LocalCaseId, cb])
    },
    /**
     * 上传本地数据到网络案件
     * @param {Array}Evidences 证据Id
     * @param {String}NetCaseId 网络案件id
     * @param {Function}CallBack 回调函数
     */
    UploadEvidences (Evidences, NetCaseId, CallBack) {
      let Timer;

      function GetProgress () {
        if (StaticInfo.progressBar) {
          let Progress = JSON.parse(StaticInfo.progressBar);
          CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total});
          if (Progress.proNum === Progress.tatal) {
            clearTimeout(Timer)
          }
        }
        Timer = setTimeout(GetProgress, 500)
      }

      GetProgress();
      let cb = (Result) => {
        clearTimeout(Timer);//清除定时器
        CallBack(Result)
      };
      WaitingFuncAndDo('NetCaseTool', 'uploadEvidences', [JSON.stringify(Evidences), NetCaseId, cb])
    },
    /**
     * 获取用户对案件的权限
     * @param {String}NetCaseId 网络案件Id
     * @param {String}UserId 用户Id
     * @param {Function}CallBack 回调函数
     */
    GetNetCasePowers (NetCaseId, UserId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'getCasePowers', [NetCaseId, UserId, CallBack])
    },
    /**
     * 离线案件
     * @param {String}NetCaseId 网络案件Id
     * @param {String}CallBack 回调函数
     */
    OfflineCase (NetCaseId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'getCase', [NetCaseId, CallBack])
    },
    /**
     * 判断网络案件是否离线
     * @param {String}NetCaseId 网络案件Id
     * @param {String}CallBack 回调函数
     */
    OfflineCaseJudge (NetCaseId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'offOnline', [NetCaseId, CallBack])
    },
    /**
     * 下载网络案件数据
     * @param {String}NetCaseId 网络案件Id
     * @param {String}CasePath 存放目录
     * @param {Function}CallBack 回调函数
     */
    DownloadNetCase (NetCaseId, CasePath, CallBack) {
      let Timer;

      function GetProgress () {
        if (StaticInfo.progressBar) {
          let Progress = JSON.parse(StaticInfo.progressBar);
          CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total});
          if (Progress.proNum === Progress.tatal) {
            clearTimeout(Timer)
          }
        }
        Timer = setTimeout(GetProgress, 500)
      }

      GetProgress();

      let cb = (Result) => {
        clearTimeout(Timer);
        CallBack(Result)
      };

      WaitingFuncAndDo('NetCaseTool', 'downloadCase', [NetCaseId, CasePath, cb])
    },
    /**
     * 下载网络案件单个证据
     * @param {String}NetCaseId 网络案件Id
     * @param {String}EvidenceId 证据Id
     * @param {Function}CallBack 回调函数
     */
    DownloadNetCaseEvidence (NetCaseId, EvidenceId, CallBack) {
      let Timer;

      function GetProgress () {
        if (StaticInfo.progressBar) {
          let Progress = JSON.parse(StaticInfo.progressBar);
          CallBack({State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total});
          if (Progress.proNum === Progress.tatal) {
            clearTimeout(Timer)
          }
        }
        Timer = setTimeout(GetProgress, 500)
      }

      GetProgress();

      let cb = (Result) => {
        clearTimeout(Timer);
        CallBack(Result)
      };
      WaitingFuncAndDo('NetCaseTool', 'downloadEvidence', [NetCaseId, EvidenceId, cb])
    },
    /**
     * 获取案件是否下载数据
     * @param {String}NetCaseId 网络案件Id
     * @param {Function}CallBack 回调函数
     */
    GetNetCaseState (NetCaseId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'getCaseState', [NetCaseId, CallBack])
    },
    /**
     * 清除网络案件缓存
     * @param {String}NetCaseId 网络案件Id
     * @param {Function}CallBack 回调函数
     */
    ClearNetCaseData (NetCaseId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'clearCaseData', [NetCaseId, CallBack])
    },
    /**
     * 删除网络案件
     * @param {String}NetCaseId 网络案件Id
     * @param {Function}CallBack 回调函数
     */
    DeleteNetCase (NetCaseId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'deleteCase', [NetCaseId, CallBack])
    },
    /**
     * 缓存网络案件临时数据
     * @param {String}NetCaseId 网络案件
     * @param {Function}CallBack 回调函数
     */
    GetNetCaseTemp (NetCaseId, CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'getCaseTemp', [NetCaseId, CallBack])
    },
    /**
     * 取消上传
     * @param {Function}CallBack 回调函数
     */
    StopUpload (CallBack) {
      WaitingFuncAndDo('NetCaseTool', 'stopUpload', [CallBack])
    },

  },
  /**
   * 标记类
   */
  Mark: {
    /**
     * 创建标记
     * @param MarkName 标记名称
     * @param Description 标记描述
     * @param Color 颜色
     * @param CallBack 回调函数
     */
    CreateMark: (MarkName, Description, Color, CallBack) => {
      WaitingFuncAndDo('MarkTool', 'createMark', [MarkName, Description, Color, CallBack])
    },
    /**
     * 添加标记
     * @param {String} MarkName 标记名称
     * @param {Array} Id 数据Id
     * @param {Function}CallBack 回调函数
     */
    AddMark: (MarkName, Id, CallBack) => {
      WaitingFuncAndDo('MarkTool', 'addMark', [MarkName, JSON.stringify(Id), CallBack])
    },
    /**
     * 获取标记列表
     * @param {Function}CallBack 回调函数
     */
    GetMarkList: (CallBack) => {
      WaitingFuncAndDo('MarkTool', 'getMarkList', [CallBack])
    },
    /**
     * 删除标记
     * @param {Array}MarkName 标记名称
     * @param {Function}CallBack 回调函数
     */
    DeleteMark: (MarkName, CallBack) => {
      WaitingFuncAndDo('MarkTool', 'delectMark', [JSON.stringify(MarkName), CallBack])
    },
    /**
     * 移除标记
     * @param {Array} Ids 邮件id
     * @param {Function} CallBack 回调函数
     */
    RemoveMark: (Ids, CallBack) => {
      WaitingFuncAndDo('MarkTool', 'removeMark', [JSON.stringify(Ids), CallBack])
    },
    /**
     * 标记所有
     * @param {String} MarkName 标记名称
     * @param {Function} CallBack 回调函数
     */
    MarkAll: (MarkName, CallBack) => {
      WaitingFuncAndDo('MarkTool', 'addAll', [MarkName, CallBack])
    }
  },
  /**
   * 网络标记类
   */
  NetMark: {
    /**
     * 获取所有标记过的邮件列表
     * 无效
     * @param {Array} MarkName 标记名称
     * @param {Function} CallBack 回调函数
     */
    GetNetMarkMailList: (MarkName, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'getAllList', [JSON.stringify(MarkName), CallBack])
    },
    /**
     * 获取网络标记列表
     * @param {Function}CallBack 回调函数
     */
    GetNetMarkList: (CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'getAllMarks', [CallBack])
    },
    /**
     * 创建网络标记
     * @param {String}MarkName 标记名称
     * @param {String}Description 标记描述
     * @param {String}Color 标记颜色
     * @param {Boolean}IsPublic 是否公开
     * @param {Function}CallBack 回调函数
     */
    AddNetMark: (MarkName, Description, Color, IsPublic, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'addMark', [MarkName, Description, Color, IsPublic, CallBack])
    },
    /**
     * 删除网络标记
     * @param {Array}MarkName 标记名称
     * @param {Function}CallBack 回调函数
     */
    DelNetMark: (MarkName, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'delMark', [JSON.stringify(MarkName), CallBack])
    },
    /**
     * 网络标记数据
     * @param {Array}Ids 邮件Id
     * @param {String}MarkName 标记名称
     * @param {Function}CallBack 回调函数
     */
    NetMarkMail: (Ids, MarkName, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'addMailMarks', [JSON.stringify(Ids), MarkName, CallBack])
    },
    /**
     * 更新网络标记
     * @param {String}MarkName 标记名称
     * @param {String}Description 标记描述
     * @param {String}Color 标记颜色
     * @param {Boolean}IsPublic 是否公开
     * @param {Function}CallBack 回调函数
     */
    UpdateNetMark: (MarkName, Description, Color, IsPublic, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'updateMark', [MarkName, Description, Color, IsPublic, CallBack])
    },
    /**
     * 移除网络标记
     * @param {Array}Ids 邮件Id
     * @param {Function}CallBack 回调函数
     */
    RemoveNetMarkMail: (Ids, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'removeMailMark', [JSON.stringify(Ids), CallBack])
    },
    /**
     * 更新网络邮件的标记
     * 无效
     * @param Ids 邮件Id
     * @param MarkName 标记名称
     * @param CallBack 回调函数
     */
    UpdateNetMarkMail: (Ids, MarkName, CallBack) => {
      WaitingFuncAndDo('NetMarkTool', 'updateMailMark', [JSON.stringify(Ids), MarkName, CallBack])
    },
    /**
     * 网络标记所有数据
     * @param {String}MarkName 标记名称
     * @param {Function}CallBack 回调函数
     */
    AddAllMailMark (MarkName, CallBack) {
      WaitingFuncAndDo('NetMarkTool', 'addAllMailMark', [MarkName, CallBack])
    }
  },
  /**
   * 搜索类
   */
  Search: {
    /**
     * 预览单条数据
     * @param Id 数据Id
     * @param CallBack 回调函数
     */
    SearchOne: (Id, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'searchOne', [Id, CallBack])
    },
    /**
     * 获取单页数据
     * @param Query 查询条件
     * @param Start 其实页
     * @param RowCount 页大小
     * @param Sort 排序
     * @param CallBack 回调函数
     */
    GetPage: (Query, Start, RowCount, Sort, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'getPage', [JSON.stringify(Query), Start, RowCount, JSON.stringify(Sort), CallBack])
    },
    /**
     * 添加已读文件
     * @param Id 邮件Id
     * @param CallBack 回调函数
     */
    ReadFile: (Id, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'readFile', [Id, CallBack])
    },
    /**
     * 获取已读文件列表
     * @param CallBack 回调函数
     */
    GetReadFiles: (CallBack) => {
      WaitingFuncAndDo('SearchTool', 'getReadFiles', [CallBack])
    },
    /**
     * 获取智能统计数据
     * @param {Array} Query 查询条件
     * @param {String} Type 类型
     * @param {Function} CallBack 回调函数
     */
    GetTaxoData: (Query, Type, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'getTaxoData', [JSON.stringify(Query), Type, CallBack])
    },
    /**
     * 获取搜索历史
     * @param {String} Type 类型
     * @param {Function} CallBack 回调函数
     */
    GetHistory: (Type, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'getHistory', [Type, CallBack])
    },
    /**
     * 删除搜索记录
     * @param {String} Query 需要删除的搜索记录
     * @param {String} Type 类型
     * @param {Function} CallBack 回调函数
     * @constructor
     */
    DeleteHistory: (Query, Type, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'deleteHistory', [Query, Type, CallBack])
    },
    /**
     * 清除历史搜索
     * @param {String} Type 类型
     * @param {Function} CallBack 回调函数
     */
    ClearHistory: (Type, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'clearHistory', [Type, CallBack])
    },
    /**
     * 所有邮件地址
     * @param {Function}CallBack 回调函数
     */
    ReAllAddress: (CallBack) => {
      WaitingFuncAndDo('SearchTool', 'reAllAdress', [CallBack])
    },
    /**
     * 导出视图
     * @param {String} Name 文件名
     * @param {String} Path 文件路径
     * @param {String} Id 导出证据ID
     * @param {Function}CallBack 回调函数
     */
    ExportDataSource: (Name, Path, Id, CallBack) => {
      WaitingFuncAndDo('SearchTool', 'ExportDataSource', [Name, Path, Id, CallBack])
    }
  },
  /**
   * 角色类
   */
  Role: {
    /**
     * 创建角色
     * @param {String}RoleName 角色名称
     * @param {Array}Powers 角色权限
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    CreateRole: (RoleName, Powers, ClassId, CallBack) => {
      WaitingFuncAndDo('RoleTool', 'createRole', [RoleName, JSON.stringify(Powers), ClassId, CallBack])
    },
    /**
     * 更新角色
     * @param {String}RoleName 角色名称
     * @param {Array}Powers 角色权限
     * @param {String}ClassId 部门名
     * @param {Function}CallBack 回调函数
     */
    UpdateRole: (RoleName, Powers, ClassId, CallBack) => {
      WaitingFuncAndDo('RoleTool', 'updataRole', [RoleName, JSON.stringify(Powers), ClassId, CallBack])
    },
    /**
     * 删除角色
     * @param {Array}RoleName 角色名称
     * @param {String}ClassId 部门名
     * @param {Function}CallBack 回调函数
     */
    DeleteRole: (RoleName, ClassId, CallBack) => {
      WaitingFuncAndDo('RoleTool', 'deleteRole', [JSON.stringify(RoleName), ClassId, CallBack])

    },
    /**
     * 添加角色到用户
     * @param RoleName 角色名称
     * @param UserId 用户Id
     * @param CallBack 回调函数
     */
    AddRole: (RoleName, UserId, CallBack) => {
      WaitingFuncAndDo('RoleTool', 'addRole', [RoleName, UserId, CallBack])
    },
    /**
     * 获取当前部门的角色列表
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    GetRoleList (ClassId, CallBack) {
      WaitingFuncAndDo('RoleTool', 'getRoleList', [ClassId, CallBack])
    },
    /**
     * 获取当前部门及子部门的角色
     * @param ClassId 部门Id
     * @param CallBack 回调函数
     */
    GetAllRoleList (ClassId, CallBack) {
      WaitingFuncAndDo('RoleTool', 'getAllRoleList', [ClassId, CallBack])
    }
  },
  /**
   * 用户类
   */
  User: {
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
     * @param {Function}CallBack 回调函数
     */
    CreateUser: (UserName, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name, CallBack) => {
      WaitingFuncAndDo('UserTool', 'createUser', [UserName, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name, CallBack])
    },
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
     * @param {Function}CallBack 回调函数
     */
    UpdateUser: (UserId, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name, CallBack) => {
      WaitingFuncAndDo('UserTool', 'updataUser', [UserId, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name, CallBack])
    },
    /**
     * 用户登录
     * @param UserName 用户名
     * @param PassWord 密码
     * @param CallBack 回调函数
     */
    Login: (UserName, PassWord, CallBack) => {
      WaitingFuncAndDo('UserTool', 'login', [UserName, PassWord, CallBack])
    },
    /**
     * 删除用户
     * @param {Array}UserId 用户Id
     * @param {Function}CallBack 回调函数
     */
    DeleteUser (UserId, CallBack) {
      WaitingFuncAndDo('UserTool', 'deleteUser', [JSON.stringify(UserId), CallBack])
    },
    /**
     * 获取用户列表
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    GetUserList (ClassId, CallBack) {
      WaitingFuncAndDo('UserTool', 'getUserList', [ClassId, CallBack])
    },
    /**
     * 获取当前部门及子部门的用户列表
     * @param ClassId 部门Id
     * @param CallBack 回调函数
     */
    GetAllUserList (ClassId, CallBack) {
      WaitingFuncAndDo('UserTool', 'getAllUserList', [ClassId, CallBack])
    },
    /**
     * 给用户添加角色
     * @param {String}RoleName 角色名
     * @param {String}UserId 用户Id
     * @param {Function}CallBack 回调函数
     * @constructor
     */
    AddRole (RoleName, UserId, CallBack) {
      WaitingFuncAndDo('UserTool', 'addRole', [RoleName, UserId, CallBack])
    },
    /**
     * 判断用户是否登录
     * @param {Function}CallBack 回调函数
     * @constructor
     */
    IsOnLine (CallBack) {
      WaitingFuncAndDo('UserTool', 'isOnline', [CallBack])
    },
    /**
     * 获取权限
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    GetPowers (ClassId, CallBack) {
      WaitingFuncAndDo('UserTool', 'getPowers', [ClassId, CallBack])
    },
    /**
     * 测试连接
     * @param {String}Address Ip地址
     * @param {Function}CallBack 回调函数
     */
    GetOnline (Address, CallBack) {
      WaitingFuncAndDo('UserTool', 'getOnline', [Address, CallBack])
    },
    /**
     * 退出登录
     * @param {Function}CallBack 回调函数
     */
    Logout (CallBack) {
      WaitingFuncAndDo('UserTool', 'logout', [CallBack])
    },
    /**
     * 获取Ip
     * @param {Function}CallBack 回调函数
     */
    GetIp (CallBack) {
      WaitingFuncAndDo('UserTool', 'getIp', [CallBack])
    },
    /**
     * 设置Ip
     * @param {String}Ip Ip地址
     * @param {Function}CallBack 回调函数
     */
    SetIp (Ip, CallBack) {
      WaitingFuncAndDo('UserTool', 'setIp', [Ip, CallBack])
    },
    /**
     * 获取分享案件的部门用户
     * @param {String}ClassId 部门Id
     * @param {String}CaseId 案件Id
     * @param {Function}CallBack 回调函数
     */
    GetCaseUserList (ClassId, CaseId, CallBack) {
      WaitingFuncAndDo('UserTool', 'getCaseUserList', [ClassId, CaseId, CallBack])
    },
    /**
     * 获取案件的所有共享人
     * @param {String}CaseId 案件Id
     * @param {Function}CallBack 回调函数
     */
    GetCaseManager (CaseId, CallBack) {
      WaitingFuncAndDo('UserTool', 'getCaseManagers', [CaseId, CallBack])
    }
  },
  /**
   * 导出类
   */
  Export: {
    /**
     * 导出到HTML
     * @param {Object} Param 导出参数
     * @param {Function} CallBack 回调函数
     */
    ToHtml: (Param, CallBack) => {
      WaitingFuncAndDo('ExportFileHtml', 'export', [JSON.stringify(Param), CallBack])
    }
  },
  /**
   * 关系图类
   */
  RelationShip: {
    /**
     * 获取关系图数据
     * @param {Array} Param 参数
     * @param {String} Type 类型
     * @param {Object} Filter 数据过滤
     * @param {Function}CallBack 回调函数
     */
    GetShipData: (Param, Type, Filter, CallBack) => {
      let cb = (MSG) => {
        if (MSG.State) {
          let Path = path.resolve(__dirname, 'app/data/relationship.json');
          Common.CheckAndCreatePath(path.dirname(Path));
          fs.writeFile(path.join(__dirname, 'app/data/relationship.json'), MSG.Data, (err) => {
            if (err) {
              LogHelper.writeErr(err);
              MSG.State = false;
              MSG.Msg = 'Write Data To JSON Error';
              CallBack(MSG)
            } else {
              CallBack(MSG)
            }
          })
        } else {
          CallBack(MSG)
        }
      };
      WaitingFuncAndDo('RelationShip', 'reShip', [JSON.stringify(Param), Type, JSON.stringify(Filter), cb])
    },
    /**
     * 关系图所有邮件地址
     * @param {Function}CallBack 回调函数
     */
    ReAllAddress: (CallBack) => {
      WaitingFuncAndDo('RelationShip', 'reAllAdress', [CallBack])
    },
    /**
     * 获取地址不同昵称
     * @param {String}Address 邮件地址
     * @param {Function}CallBack 回调函数
     */
    RePerson (Address, CallBack) {
      WaitingFuncAndDo('RelationShip', 'rePerson', [Address, CallBack])
    },
    /**
     * 获取昵称不同地址
     * @param {String}Person 昵称
     * @param {Function}CallBack 回调函数
     * @constructor
     */
    ReAddress (Person, CallBack) {
      WaitingFuncAndDo('RelationShip', 'reAdress', [Person, CallBack])
    }
  },
  /**
   * 话单类
   */
  Phone: {
    /**
     * 添加证据
     * @param {Array} FilePath 文件路径
     * @param {String} ModelName 模版名称
     * @param {String} CaseId 案件ID
     * @param {String} EvidenceName 证据名称
     * @param {String} Creator 创建人
     * @param {String} Description 描述
     * @param {Function}CallBack 回调函数
     */
    AddEvidence: (CaseId, EvidenceName, Creator, FilePath, Description, ModelName, CallBack) => {
      WaitingFuncAndDo('PhoneTool', 'addEvidence', [CaseId, EvidenceName, Creator, JSON.stringify(FilePath), Description, ModelName, CallBack])
    },
    /**
     * 创建模版
     * @param {String} Name 模版名称
     * @param {Number} MyNum 主叫号码
     * @param {Number} ONum 被叫号码
     * @param {Number} DateNum 通话时间
     * @param {Number} TimeNum 通话时长
     * @param {Number} TypeNum 通话类型
     * @param {Function} CallBack 回调函数
     */
    CreateModel: (Name, MyNum, ONum, DateNum, TimeNum, TypeNum, CallBack) => {
      WaitingFuncAndDo('PhoneTool', 'createModel', [Name, MyNum, ONum, DateNum, TimeNum, TypeNum, CallBack])
    },
    /**
     * 获取模版列表
     * @param {Function} CallBack
     */
    GetModelList: (CallBack) => {
      WaitingFuncAndDo('PhoneTool', 'getModelList', [CallBack])
    },
    /**
     * 获取模版
     * @param {String} ModelName 模版名称
     * @param {Function} CallBack 回调函数
     */
    GetModel: (ModelName, CallBack) => {
      WaitingFuncAndDo('PhoneTool', 'getModel', [ModelName, CallBack])
    },
    /**
     * 更新模版
     * @param {String} Name 模版名称
     * @param {Number} MyNum 主叫号码
     * @param {Number} ONum 被叫号码
     * @param {Number} DateNum 通话时间
     * @param {Number} TimeNum 通话时长
     * @param {Number} TypeNum 通话类型
     * @param {Function} CallBack 回调函数
     */
    UpdateModel: (Name, MyNum, ONum, DateNum, TimeNum, TypeNum, CallBack) => {
      WaitingFuncAndDo('PhoneTool', 'createModel', [Name, MyNum, ONum, DateNum, TimeNum, TypeNum, CallBack])
    },
    /**
     * 删除模版
     * @param {String} ModelName 模版名称
     * @param {Function} CallBack 回调函数
     */
    DeleteModel: (ModelName, CallBack) => {
      WaitingFuncAndDo('PhoneTool', 'getModel', [ModelName, CallBack])
    }
  },
  /**
   * 检测时间类
   */
  CheckTime: {
    /**
     * 检测
     * @param CallBack 回调函数
     */
    Check: (CallBack) => {
      WaitingFuncAndDo('CheckTime', 'check', [CallBack])
    }
  },
  /**
   * 部门类
   */
  Class: {
    /**
     * 添加一个部门
     * @param {String}ClassName 部门名称
     * @param {String=}FatherId 上级部门Id
     * @param {Function}CallBack 回调函数
     */
    AddClass (ClassName, FatherId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'addOne', [ClassName, FatherId, CallBack])
    },
    /**
     * 获取所有部门列表
     * @param {Function}CallBack 回调函数
     */
    GetList (CallBack) {
      WaitingFuncAndDo('ClassTool', 'getList', [CallBack])
    },
    /**
     * 删除部门
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack
     */
    DeleteClass (ClassId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'deletOne', [ClassId, CallBack])
    },
    /**
     * 修改部门
     * @param {String}ClassId 部门Id
     * @param {String}NewClassName 新部门名称
     * @param {String}FatherId 父级部门Id
     * @param {Function}CallBack 回调函数
     */
    UpdateClass (ClassId, NewClassName, FatherId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'updataClass', [ClassId, NewClassName, FatherId, CallBack])
    },
    /**
     * 获取用户日志
     * @param {String}UserId 用户Id
     * @param {Function}CallBack 回调函数
     */
    GetUserLog (UserId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'getUserLog', [UserId, CallBack])
    },
    /**
     * 获取当前部门日志
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    GetClassLog (ClassId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'getClassLog', [ClassId, CallBack])
    },
    /**
     * 获取当前部门及子部门
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     * @constructor
     */
    GetAllClassLog (ClassId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'getAllClassLog', [ClassId, CallBack])
    },
    /**
     * 获取所有日志
     * @param {Function}CallBack 回调函数
     */
    GetAllLog (CallBack) {
      WaitingFuncAndDo('ClassTool', 'getAlllog', [CallBack])
    },
    /**
     * 获取案件日志
     * @param {String}CaseId 案件Id
     * @param {Function}CallBack 回调函数
     */
    GetCaseLog (CaseId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'getCaseLog', [CaseId, CallBack])
    },
    /**
     * 获取当前和子集部门
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    GetChildrenList (ClassId, CallBack) {
      WaitingFuncAndDo('ClassTool', 'getChildrenList', [ClassId, CallBack])
    }
  }
};

let Started = false;

/**
 * 初始化Java
 */
function Init () {
  try {
    java.classpath.push(path.resolve(__dirname, '../Java/FileAnalysis.jar'));//引用jar包
    StaticInfo = java.import('Static.StaticInfo')//引用静态类
  } catch (e) {
    LogHelper.writeErr(e);
    ee.emit('Error', {State: 'err', Msg: Error['-3']})
  }

  java.newInstance('tool.Start', (err, Start) => {//实例化Start类
    if (err) {
      LogHelper.writeErr(err);
      ee.emit('Error', {State: 'err', Msg: Error['-1']})
    } else {
      Start.start((err) => {//初始化程序
        if (err) {
          LogHelper.writeErr(err);
          ee.emit('Error', {State: 'err', Msg: Error['-2']})
        } else {
          LogHelper.writeInfo('Application Init');
          Started = true;
          ee.emit('Started')
        }
      })
    }
  });
  ee.on('Started', () => {
    WaitingStart()
  })
}

/**
 * 等待Java程序初始化
 */
function WaitingStart () {
  for (let Class in JavaClass) {//遍历需要实例化的Java类
    java.newInstance('tool.' + Class, (err, NewClass) => {//实例化Java类
      if (err) {//实例化错误
        LogHelper.writeErr(err);
        ee.emit('Error', {State: 'err', Msg: 'Init Class:' + Class + ' Error'})
      } else {
        JavaClass[Class] = NewClass;
        ee.emit('Init' + Class)
      }
    })
  }
}

/**
 * 检测Jre环境是否存在
 */
function CheckedJre () {
  LogHelper.writeInfo('Checking Jre');

  let dll, dylib, so, soFiles, binary, home = __dirname,
    jvmPathx86 = path.resolve(__dirname, '../jre/bin/client/jvm.dll'),
    jvmPathx64 = path.resolve(__dirname, '../jre/bin/server/jvm.dll');
  dll = fs.existsSync(jvmPathx86) ? jvmPathx86 : jvmPathx64;

  binary = dll || dylib || so;

  let jvm_dll_path = path.resolve(__dirname, '../node_modules/java/build/jvm_dll_path.json');
  let jvmPath = binary ? JSON.stringify(path.delimiter + path.dirname(path.resolve(home, binary))) : '""';
  if (fs.existsSync(jvm_dll_path)) {
    fs.readFile(jvm_dll_path, (err, text) => {
      if (err) LogHelper.writeErr(err);
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
    LogHelper.writeInfo('WriteJvmPath');
    fs.writeFile(jvm_dll_path, jvmPath, (err) => {
      if (!err) {ImportJava()} else {
        LogHelper.writeErr(err)
      }
    })
  }

  /**
   * 导入java
   */
  function ImportJava () {
    LogHelper.writeInfo('ImportJava');
    import('java').then((module) => {
      java = module;
      Init()
    }).catch((err) => {
      LogHelper.writeErr(err)
    })
  }

}

/**
 * 等待类实例化并统一执行
 * @param ClassName 类名
 * @param FuncName 方法名
 * @param Args 参数
 */
function WaitingFuncAndDo (ClassName, FuncName, Args) {
  if (JavaClass[ClassName]) {
    DoFunc()
  } else {
    ee.on('Init' + ClassName, () => {
      DoFunc()
    })
  }

  function DoFunc () {
    if (typeof FuncName === 'string') {//如果为调用方法名,则执行统一回调函数
      let CallBack = Args[Args.length - 1];
      Args[Args.length - 1] = (err, Msg) => {
        CallBackDone(err, Msg, FuncName, CallBack)
      };
      JavaClass[ClassName][FuncName](...Args)
    } else {//如果不是则执行回调函数
      FuncName()
    }
  }
}

/**
 * Java调用统一回调函数
 */
function CallBackDone (err, Msg, FuncName, CallBack) {
  if (err) {//调用失败
    LogHelper.writeErr(err);
    ee.emit('Error', {State: false, Msg: 'Call Method:' + FuncName + ' Error'});
    CallBack({State: false, Msg: 'Call Method:' + FuncName + ' Error'})
  } else {//调用成功
    let Res;
    try {
      Res = JSON.parse(Msg)//解析消息体
    } catch (err) {
      LogHelper.writeErr(err);
      ee.emit('Error', {State: false, Msg: '无法解析数据:' + Msg});
      CallBack({State: false, Msg: '无法解析数据:' + Msg})
    }
    if (Res.State) {//成功消息
      CallBack({State: true, Msg: Res.Msg, Data: Res.Data})
    } else {//错误消息
      ee.emit('Error', {State: false, Msg: Res.Msg});
      CallBack({State: false, Msg: Res.Msg})
    }
  }
}

CheckedJre();
export default $this
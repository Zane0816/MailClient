/**
 * Created by admin on 2017/3/27.
 */


'use strict';
import LogHelper from './LogHelper'
import {EventEmitter} from 'events'
import Common from './Common'
import {delimiter, dirname, join, resolve} from "path";
import {existsSync, readFile, writeFile} from "fs";

const ee = new EventEmitter();//声明事件发生器
let java, StaticInfo, JavaClass = {};//声明java 对象和静态类声明java包

class Case {
    constructor() {
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
    async AddCase(CaseName, Creator, CasePath, TempPath, Description, EvidencePaths) {
        await WaitingFuncAndDo('LocalCaseTool', 'addCase', [CaseName, Creator, CasePath, TempPath, Description, JSON.stringify(EvidencePaths)])
    }

    /**
     * 获取案件列表
     */
    async GetCaseList() {
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
    AddEvidence(CaseId, Evidence, Creator, Path, Description, EvidentType, CallBack) {
        let Timer;

        function GetProgress() {
            if (StaticInfo.progressBar) {
                let Progress = JSON.parse(StaticInfo.progressBar);
                CallBack({
                        State: true, Msg: Progress.outPath, Progress: Progress.proNum / Progress.total
                    }
                );
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
    }

    /**
     * 打开案件
     * @param {String} CaseId 案件Id
     * @param {Array} Type 证据类型
     */
    async OpenCase(CaseId, Type) {
        await   WaitingFuncAndDo('LocalCaseTool', 'openCase', [CaseId, JSON.stringify(Type)])
    }

    /**
     * 暂停解析
     */
    async StopProcess() {
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
    async SetTempPath(Path) {
        await WaitingFuncAndDo('PathTool', 'setTempPath', [Path])
    }

    /**
     * 设置案件目录
     * @param Path 路径
     */
    async SetCasePath(Path) {
        await WaitingFuncAndDo('PathTool', 'setCasesPath', [Path])
    }


    /**
     * 获取案件证据结构
     * @param {String} CaseId 案件Id
     * @param {String=} Type 类型
     */
    async GetEvidence(CaseId: string, Type?: string) {
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
    async DeleteCase(CaseId: string) {
        await WaitingFuncAndDo('LocalCaseTool', 'deleteCase', [CaseId])
    }

    /**
     * 添加网络案件
     * @param {String}CaseName 案件名
     * @param {String}Creator 创建人
     * @param {String}Description 案件描述
     */
    async AddNetCase(CaseName: string, Creator: string, Description: string) {
        await WaitingFuncAndDo('NetCaseTool', 'addCase', [CaseName, Creator, Description])
    }

    /**
     * 共享案件
     * @param {String}NetCaseId 网络案件Id
     * @param {Array}UserId 共享用户Id
     * @param {Array}Powers 共享权限
     */
    async ShareCase(NetCaseId: string, UserId: Array<string>, Powers: Array<string>) {
        await  WaitingFuncAndDo('NetCaseTool', 'shareCase', [NetCaseId, JSON.stringify(UserId), JSON.stringify(Powers)])
    }

    /**
     * 修改共享信息
     * @param {String}NetCaseId 共享案件Id
     * @param {Array}UserId 共享用户Id
     * @param {Array}Powers 共享权限
     */
    async UpdateShareCase(NetCaseId, UserId, Powers) {
        await WaitingFuncAndDo('NetCaseTool', 'updataSharaCase', [NetCaseId, JSON.stringify(UserId), JSON.stringify(Powers)])
    }

    /**
     * 取消案件共享
     * @param {String}NetCaseId 共享案件Id
     * @param {Array}UserId 共享用户Id
     */
    async CancelShare(NetCaseId, UserId) {
        await WaitingFuncAndDo('NetCaseTool', 'reShareCase', [NetCaseId, JSON.stringify(UserId)])
    }

    /**
     * 获取网络案件
     */
    async GetNetCaseList() {
        await WaitingFuncAndDo('LocalCaseTool', 'getNetCaseList')
    }

    /**
     * 上传数据
     * @param Evidences 证据数组
     * @param MetCaseId 网络案件Id
     */
    async UploadData(Evidences, MetCaseId,) {
        await WaitingFuncAndDo('NetCaseTool', 'uploadData', [JSON.stringify(Evidences), MetCaseId])
    }

    /**
     * 获取网络案件证据结构
     * @param Evidences 证据数组
     * @param MetCaseId 网络案件Id
     */
    async GetNetCaseEvidence(Evidences, MetCaseId) {
        await WaitingFuncAndDo('NetCaseTool', 'getEvidence', [JSON.stringify(Evidences), MetCaseId])
    }

    /**
     * 关闭案件
     */
    async CloseCase() {
        await WaitingFuncAndDo('LocalCaseTool', 'closeCase')
    }

    /**
     * 获取案件路径
     */
    async GetCasesPath() {
        await WaitingFuncAndDo('PathTool', 'getCasesPath')
    }

    /**
     * 获取缓存路径
     */
    async GetTempPath() {
        await WaitingFuncAndDo('PathTool', 'getTempPath')
    }

    /**
     * 案件预览列表
     * @param {String} CaseId 案件Id
     */
    async GetPreviewList(CaseId) {
        await WaitingFuncAndDo('LocalCaseTool', 'getPreviewList', [CaseId])
    }

    /**
     * 预览一个案件
     * @param {String} Message 列表信息
     */
    async GetOnePreview(Message) {
        await WaitingFuncAndDo('LocalCaseTool', 'getOnePreview', [Message])
    }

    /**
     * 添加备注
     * @param {String}Address 邮箱地址
     * @param {String}Remark 备注内容
     * @param {Function}CallBack 回调函数
     */
    AddRemark(Address, Remark, CallBack) {
        WaitingFuncAndDo('LocalCaseTool', 'addRemark', [Address, Remark, CallBack])
    }

    /**
     * 获取地址备注
     * @param {String}Address 邮箱地址
     */
    async GetOneRemark(Address) {
        await WaitingFuncAndDo('LocalCaseTool', 'getOneRemark', [Address])
    }

    /**
     * 获取备注集合
     */
    async GetRemarkList() {
        await WaitingFuncAndDo('LocalCaseTool', 'getRemarkList')
    }

    /**
     * 去重
     * @param {Boolean} Flag
     */
    async ReMd5(Flag) {
        await WaitingFuncAndDo('LocalCaseTool', 'ReMd5', [Flag])
    }

    /**
     * 判断案件是否有数据
     * @param {String}CaseId 案件Id
     */
    async CaseIsEmpty(CaseId) {
        await WaitingFuncAndDo('LocalCaseTool', 'caseIsEmpty', [CaseId])
    }

    /**
     * 打开文件
     * @param Id 文件Id
     */
    async OpenFile(Id) {
        await WaitingFuncAndDo('LocalCaseTool', 'openFile', [Id])
    }

    /**
     * 删除解析后生产的缓存文件
     * @param CaseId 案件Id
     */
    async DeleteTemp(CaseId) {
        await  WaitingFuncAndDo('LocalCaseTool', 'delectTemp', [CaseId])
    }

    /**
     * 将本地案件变为网络案件
     * @param {String}LocalCaseId 本地案件Id
     * @param {String}Path 网络案件保存路径
     */
    async UploadCase(LocalCaseId, Path) {
        await WaitingFuncAndDo('NetCaseTool', 'uploadCase', [LocalCaseId, Path])
    }

    /**
     * 将刚提交的成网络案件的数据上传
     * @param {String}LocalCaseId 本地案件Id
     * @param {Function}CallBack 回调函数
     */
    UploadAllEvidences(LocalCaseId, CallBack) {
        let Timer;

        function GetProgress() {
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
    }

    /**
     * 上传本地数据到网络案件
     * @param {Array}Evidences 证据Id
     * @param {String}NetCaseId 网络案件id
     * @param {Function}CallBack 回调函数
     */
    UploadEvidences(Evidences, NetCaseId, CallBack) {
        let Timer;

        function GetProgress() {
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
    }

    /**
     * 获取用户对案件的权限
     * @param {String}NetCaseId 网络案件Id
     * @param {String}UserId 用户Id
     */
    async GetNetCasePowers(NetCaseId, UserId) {
        await WaitingFuncAndDo('NetCaseTool', 'getCasePowers', [NetCaseId, UserId])
    }

    /**
     * 离线案件
     * @param {String}NetCaseId 网络案件Id
     */
    async OfflineCase(NetCaseId) {
        await WaitingFuncAndDo('NetCaseTool', 'getCase', [NetCaseId])
    }

    /**
     * 判断网络案件是否离线
     * @param {String}NetCaseId 网络案件Id
     */
    async OfflineCaseJudge(NetCaseId) {
        await WaitingFuncAndDo('NetCaseTool', 'offOnline', [NetCaseId])
    }

    /**
     * 下载网络案件数据
     * @param {String}NetCaseId 网络案件Id
     * @param {String}CasePath 存放目录
     * @param {Function}CallBack 回调函数
     */
    DownloadNetCase(NetCaseId, CasePath, CallBack) {
        let Timer;

        function GetProgress() {
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
    }

    /**
     * 下载网络案件单个证据
     * @param {String}NetCaseId 网络案件Id
     * @param {String}EvidenceId 证据Id
     */
    DownloadNetCaseEvidence(NetCaseId, EvidenceId, CallBack) {
        let Timer;

        function GetProgress() {
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
    }

    /**
     * 获取案件是否下载数据
     * @param {String}NetCaseId 网络案件Id
     */
    async GetNetCaseState(NetCaseId) {
        await   WaitingFuncAndDo('NetCaseTool', 'getCaseState', [NetCaseId])
    }

    /**
     * 清除网络案件缓存
     * @param {String}NetCaseId 网络案件Id
     */
    async ClearNetCaseData(NetCaseId) {
        await WaitingFuncAndDo('NetCaseTool', 'clearCaseData', [NetCaseId])
    }

    /**
     * 删除网络案件
     * @param {String}NetCaseId 网络案件Id
     */
    async DeleteNetCase(NetCaseId) {
        await WaitingFuncAndDo('NetCaseTool', 'deleteCase', [NetCaseId])
    }

    /**
     * 缓存网络案件临时数据
     * @param {String}NetCaseId 网络案件
     */
    async GetNetCaseTemp(NetCaseId) {
        await WaitingFuncAndDo('NetCaseTool', 'getCaseTemp', [NetCaseId])
    }

    /**
     * 取消上传
     */
    async StopUpload() {
        await WaitingFuncAndDo('NetCaseTool', 'stopUpload')
    }
}

class Mark {
    constructor() {
    }

    /**
     * 创建标记
     * @param MarkName 标记名称
     * @param Description 标记描述
     * @param Color 颜色
     */
    async CreateMark(MarkName, Description, Color) {
        await WaitingFuncAndDo('MarkTool', 'createMark', [MarkName, Description, Color])
    }

    /**
     * 添加标记
     * @param {String} MarkName 标记名称
     * @param {Array} Id 数据Id
     */
    async AddMark(MarkName, Id) {
        await WaitingFuncAndDo('MarkTool', 'addMark', [MarkName, JSON.stringify(Id)])
    }

    /**
     * 获取标记列表
     */
    async GetMarkList() {
        await   WaitingFuncAndDo('MarkTool', 'getMarkList')
    }

    /**
     * 删除标记
     * @param {Array}MarkName 标记名称
     */
    async DeleteMark(MarkName) {
        await WaitingFuncAndDo('MarkTool', 'delectMark', [JSON.stringify(MarkName)])
    }

    /**
     * 移除标记
     * @param {Array} Ids 邮件id
     */
    async RemoveMark(Ids, CallBack) {
        await WaitingFuncAndDo('MarkTool', 'removeMark', [JSON.stringify(Ids)])
    }

    /**
     * 标记所有
     * @param {String} MarkName 标记名称
     */
    async MarkAll(MarkName, CallBack) {
        await WaitingFuncAndDo('MarkTool', 'addAll', [MarkName])
    }

    /**
     * 获取所有标记过的邮件列表
     * 无效
     * @param {Array} MarkName 标记名称
     * @param {Function} CallBack 回调函数
     */
    async GetNetMarkMailList(MarkName) {
        await WaitingFuncAndDo('NetMarkTool', 'getAllList', [JSON.stringify(MarkName)])
    }

    /**
     * 获取网络标记列表
     */
    async GetNetMarkList() {
        await WaitingFuncAndDo('NetMarkTool', 'getAllMarks')
    }

    /**
     * 创建网络标记
     * @param {String}MarkName 标记名称
     * @param {String}Description 标记描述
     * @param {String}Color 标记颜色
     * @param {Boolean}IsPublic 是否公开
     */
    async AddNetMark(MarkName, Description, Color, IsPublic) {
        await WaitingFuncAndDo('NetMarkTool', 'addMark', [MarkName, Description, Color, IsPublic])
    }

    /**
     * 删除网络标记
     * @param {Array}MarkName 标记名称
     * @param {Function}CallBack 回调函数
     */
    async DelNetMark(MarkName, CallBack) {
        await WaitingFuncAndDo('NetMarkTool', 'delMark', [JSON.stringify(MarkName)])
    }

    /**
     * 网络标记数据
     * @param {Array}Ids 邮件Id
     * @param {String}MarkName 标记名称
     */
    async NetMarkMail(Ids, MarkName, CallBack) {
        await WaitingFuncAndDo('NetMarkTool', 'addMailMarks', [JSON.stringify(Ids), MarkName])
    }

    /**
     * 更新网络标记
     * @param {String}MarkName 标记名称
     * @param {String}Description 标记描述
     * @param {String}Color 标记颜色
     * @param {Boolean}IsPublic 是否公开
     */
    async UpdateNetMark(MarkName, Description, Color, IsPublic) {
        await  WaitingFuncAndDo('NetMarkTool', 'updateMark', [MarkName, Description, Color, IsPublic])
    }

    /**
     * 移除网络标记
     * @param {Array}Ids 邮件Id
     */
    async RemoveNetMarkMail(Ids, CallBack) {
        await  WaitingFuncAndDo('NetMarkTool', 'removeMailMark', [JSON.stringify(Ids)])
    }

    /**
     * 更新网络邮件的标记
     * 无效
     * @param Ids 邮件Id
     * @param MarkName 标记名称
     */
    async UpdateNetMarkMail(Ids, MarkName) {
        await  WaitingFuncAndDo('NetMarkTool', 'updateMailMark', [JSON.stringify(Ids), MarkName])
    }

    /**
     * 网络标记所有数据
     * @param {String}MarkName 标记名称
     */
    async AddAllMailMark(MarkName) {
        await   WaitingFuncAndDo('NetMarkTool', 'addAllMailMark', [MarkName])
    }
}

class Search {
    constructor() {
    }

    /**
     * 预览单条数据
     * @param Id 数据Id
     */
    async SearchOne(Id) {
        await  WaitingFuncAndDo('SearchTool', 'searchOne', [Id])
    }

    /**
     * 获取单页数据
     * @param Query 查询条件
     * @param Start 其实页
     * @param RowCount 页大小
     * @param Sort 排序
     */
    async GetPage(Query, Start, RowCount, Sort) {
        await WaitingFuncAndDo('SearchTool', 'getPage', [JSON.stringify(Query), Start, RowCount, JSON.stringify(Sort)])
    }

    /**
     * 添加已读文件
     * @param Id 邮件Id
     * @param CallBack 回调函数
     */
    async ReadFile(Id, CallBack) {
        await WaitingFuncAndDo('SearchTool', 'readFile', [Id])
    }

    /**
     * 获取已读文件列表
     * @param CallBack 回调函数
     */
    async GetReadFiles() {
        await WaitingFuncAndDo('SearchTool', 'getReadFiles')
    }

    /**
     * 获取智能统计数据
     * @param {Array} Query 查询条件
     * @param {String} Type 类型
     */
    async GetTaxoData(Query, Type) {
        await   WaitingFuncAndDo('SearchTool', 'getTaxoData', [JSON.stringify(Query), Type])
    }

    /**
     * 获取搜索历史
     * @param {String} Type 类型
     * @param {Function} CallBack 回调函数
     */
    async GetHistory(Type, CallBack) {
        await WaitingFuncAndDo('SearchTool', 'getHistory', [Type])
    }

    /**
     * 删除搜索记录
     * @param {String} Query 需要删除的搜索记录
     * @param {String} Type 类型
     */
    async DeleteHistory(Query, Type) {
        await WaitingFuncAndDo('SearchTool', 'deleteHistory', [Query, Type])
    }

    /**
     * 清除历史搜索
     * @param {String} Type 类型
     */
    async ClearHistory(Type) {
        await    WaitingFuncAndDo('SearchTool', 'clearHistory', [Type])
    }

    /**
     * 所有邮件地址
     */
    async ReAllAddress() {
        await  WaitingFuncAndDo('SearchTool', 'reAllAdress')
    }

    /**
     * 导出视图
     * @param {String} Name 文件名
     * @param {String} Path 文件路径
     * @param {String} Id 导出证据ID
     */
    async ExportDataSource(Name, Path, Id) {
        await    WaitingFuncAndDo('SearchTool', 'ExportDataSource', [Name, Path, Id])
    }
}

class Role {
    constructor() {
    }

    /**
     * 创建角色
     * @param {String}RoleName 角色名称
     * @param {Array}Powers 角色权限
     * @param {String}ClassId 部门Id
     */
    async CreateRole(RoleName, Powers, ClassId) {
        await WaitingFuncAndDo('RoleTool', 'createRole', [RoleName, JSON.stringify(Powers), ClassId])
    }

    /**
     * 更新角色
     * @param {String}RoleName 角色名称
     * @param {Array}Powers 角色权限
     * @param {String}ClassId 部门名
     */
    async UpdateRole(RoleName, Powers, ClassId) {
        await WaitingFuncAndDo('RoleTool', 'updataRole', [RoleName, JSON.stringify(Powers), ClassId])
    }

    /**
     * 删除角色
     * @param {Array}RoleName 角色名称
     * @param {String}ClassId 部门名
     */
    async DeleteRole(RoleName, ClassId) {
        await WaitingFuncAndDo('RoleTool', 'deleteRole', [JSON.stringify(RoleName), ClassId])
    }

    /**
     * 添加角色到用户
     * @param RoleName 角色名称
     * @param UserId 用户Id
     */
    async AddRole(RoleName, UserId) {
        await WaitingFuncAndDo('RoleTool', 'addRole', [RoleName, UserId])
    }

    /**
     * 获取当前部门的角色列表
     * @param {String}ClassId 部门Id
     */
    async GetRoleList(ClassId) {
        await WaitingFuncAndDo('RoleTool', 'getRoleList', [ClassId])
    }

    /**
     * 获取当前部门及子部门的角色
     * @param ClassId 部门Id
     */
    async GetAllRoleList(ClassId) {
        await WaitingFuncAndDo('RoleTool', 'getAllRoleList', [ClassId])
    }
}

class User {
    constructor() {
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
    async CreateUser(UserName, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name) {
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
    async UpdateUser(UserId, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name) {
        await        WaitingFuncAndDo('UserTool', 'updataUser', [UserId, PassWord, ClassId, Number, Phone, RoleName, IdCard, Name])
    }

    /**
     * 用户登录
     * @param UserName 用户名
     * @param PassWord 密码
     */
    async Login(UserName, PassWord) {
        await        WaitingFuncAndDo('UserTool', 'login', [UserName, PassWord])
    }


    /**
     * 删除用户
     * @param {Array}UserId 用户Id
     */
    async DeleteUser(UserId) {
        await  WaitingFuncAndDo('UserTool', 'deleteUser', [JSON.stringify(UserId)])
    }

    /**
     * 获取用户列表
     * @param {String}ClassId 部门Id
     */
    async GetUserList(ClassId, CallBack) {
        await WaitingFuncAndDo('UserTool', 'getUserList', [ClassId])
    }

    /**
     * 获取当前部门及子部门的用户列表
     * @param ClassId 部门Id
     */
    async GetAllUserList(ClassId) {
        await WaitingFuncAndDo('UserTool', 'getAllUserList', [ClassId])
    }

    /**
     * 给用户添加角色
     * @param {String}RoleName 角色名
     * @param {String}UserId 用户Id
     */
    async AddRole(RoleName, UserId) {
        await   WaitingFuncAndDo('UserTool', 'addRole', [RoleName, UserId])
    }

    /**
     * 判断用户是否登录
     */
    async IsOnLine() {
        await    WaitingFuncAndDo('UserTool', 'isOnline')
    }

    /**
     * 获取权限
     * @param {String}ClassId 部门Id
     */
    async GetPowers(ClassId) {
        await WaitingFuncAndDo('UserTool', 'getPowers', [ClassId])
    }


    /**
     * 测试连接
     * @param {String}Address Ip地址
     */
    async GetOnline(Address) {
        await        WaitingFuncAndDo('UserTool', 'getOnline', [Address])
    }


    /**
     * 退出登录
     */
    async Logout() {
        await WaitingFuncAndDo('UserTool', 'logout')
    }

    /**
     * 获取Ip
     */
    async GetIp() {
        await WaitingFuncAndDo('UserTool', 'getIp')
    }


    /**
     * 设置Ip
     * @param {String}Ip Ip地址
     */
    async SetIp(Ip) {
        await        WaitingFuncAndDo('UserTool', 'setIp', [Ip])
    }


    /**
     * 获取分享案件的部门用户
     * @param {String}ClassId 部门Id
     * @param {String}CaseId 案件Id
     */
    async GetCaseUserList(ClassId, CaseId) {
        await WaitingFuncAndDo('UserTool', 'getCaseUserList', [ClassId, CaseId])
    }

    /**
     * 获取案件的所有共享人
     * @param {String}CaseId 案件Id
     */
    async GetCaseManager(CaseId) {
        await WaitingFuncAndDo('UserTool', 'getCaseManagers', [CaseId])
    }
}

class Export {
    /**
     * 导出到HTML
     * @param {Object} Param 导出参数
     */
    async ToHtml(Param) {
        await WaitingFuncAndDo('ExportFileHtml', 'export', [JSON.stringify(Param)])
    }
}

class RelationShip {
    constructor() {
    }

    /**
     * 获取关系图数据
     * @param {Array} Param 参数
     * @param {String} Type 类型
     * @param {Object} Filter 数据过滤
     * @param {Function}CallBack 回调函数
     */
    GetShipData(Param, Type, Filter, CallBack) {
        let cb = (MSG) => {
            if (MSG.State) {
                let Path = resolve(__dirname, 'app/data/relationship.json');
                Common.CheckAndCreatePath(dirname(Path));
                writeFile(join(__dirname, 'app/data/relationship.json'), MSG.Data, (err) => {
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
    }

    /**
     * 关系图所有邮件地址
     */
    async ReAllAddress() {
        await WaitingFuncAndDo('RelationShip', 'reAllAdress')
    }

    /**
     * 获取地址不同昵称
     * @param {String}Address 邮件地址
     */
    async RePerson(Address) {
        await  WaitingFuncAndDo('RelationShip', 'rePerson', [Address])
    }

    /**
     * 获取昵称不同地址
     * @param {String}Person 昵称
     */
    async ReAddress(Person) {
        await WaitingFuncAndDo('RelationShip', 'reAdress', [Person])
    }
}

class Phone {
    constructor() {
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
    async AddEvidence(CaseId, EvidenceName, Creator, FilePath, Description, ModelName) {
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
    async CreateModel(Name, MyNum, ONum, DateNum, TimeNum, TypeNum) {
        await WaitingFuncAndDo('PhoneTool', 'createModel', [Name, MyNum, ONum, DateNum, TimeNum, TypeNum])
    }

    /**
     * 获取模版列表
     */
    async GetModelList() {
        await WaitingFuncAndDo('PhoneTool', 'getModelList')
    }

    /**
     * 获取模版
     * @param {String} ModelName 模版名称
     */
    async GetModel(ModelName) {
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
    async UpdateModel(Name, MyNum, ONum, DateNum, TimeNum, TypeNum) {
        await WaitingFuncAndDo('PhoneTool', 'createModel', [Name, MyNum, ONum, DateNum, TimeNum, TypeNum])
    }

    /**
     * 删除模版
     * @param {String} ModelName 模版名称
     */
    async DeleteModel(ModelName) {
        await  WaitingFuncAndDo('PhoneTool', 'getModel', [ModelName])
    }
}

class CheckTime {
    constructor() {
    }

    /**
     * 检测
     */
    async Check() {
        await WaitingFuncAndDo('CheckTime', 'check')
    }
}

class Class {
    constructor() {
    }

    /**
     * 添加一个部门
     * @param {String}ClassName 部门名称
     * @param {String=}FatherId 上级部门Id
     */
    async AddClass(ClassName, FatherId) {
        await WaitingFuncAndDo('ClassTool', 'addOne', [ClassName, FatherId])
    }

    /**
     * 获取所有部门列表
     */
    async GetList() {
        await   WaitingFuncAndDo('ClassTool', 'getList')
    }

    /**
     * 删除部门
     * @param {String}ClassId 部门Id
     */
    async DeleteClass(ClassId) {
        await WaitingFuncAndDo('ClassTool', 'deletOne', [ClassId])
    }

    /**
     * 修改部门
     * @param {String}ClassId 部门Id
     * @param {String}NewClassName 新部门名称
     * @param {String}FatherId 父级部门Id
     */
    async UpdateClass(ClassId, NewClassName, FatherId) {
        await WaitingFuncAndDo('ClassTool', 'updataClass', [ClassId, NewClassName, FatherId])
    }

    /**
     * 获取用户日志
     * @param {String}UserId 用户Id
     */
    async GetUserLog(UserId) {
        await  WaitingFuncAndDo('ClassTool', 'getUserLog', [UserId])
    }

    /**
     * 获取当前部门日志
     * @param {String}ClassId 部门Id
     */
    async GetClassLog(ClassId) {
        await WaitingFuncAndDo('ClassTool', 'getClassLog', [ClassId])
    }

    /**
     * 获取当前部门及子部门
     * @param {String}ClassId 部门Id
     */
    async GetAllClassLog(ClassId) {
        await WaitingFuncAndDo('ClassTool', 'getAllClassLog', [ClassId])
    }

    /**
     * 获取所有日志
     * @param {Function}CallBack 回调函数
     */
    async GetAllLog(CallBack) {
        await  WaitingFuncAndDo('ClassTool', 'getAlllog')
    }

    /**
     * 获取案件日志
     * @param {String}CaseId 案件Id
     */
    async GetCaseLog(CaseId) {
        await WaitingFuncAndDo('ClassTool', 'getCaseLog', [CaseId])
    }

    /**
     * 获取当前和子集部门
     * @param {String}ClassId 部门Id
     * @param {Function}CallBack 回调函数
     */
    async GetChildrenList(ClassId, CallBack) {
        await WaitingFuncAndDo('ClassTool', 'getChildrenList', [ClassId])
    }
}

/**
 * 初始化Java
 */
function Init() {
    try {
        java.classpath.push(resolve(__dirname, '../Java/FileAnalysis.jar'));//引用jar包
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
                    ee.emit('Started')
                }
            })
        }
    });
}


/**
 * 检测Jre环境是否存在
 */
function CheckedJre() {
    LogHelper.writeInfo('Checking Jre');

    let dll, dylib, so, soFiles, binary, home = __dirname,
        jvmPathx86 = resolve(__dirname, '../jre/bin/client/jvm.dll'),
        jvmPathx64 = resolve(__dirname, '../jre/bin/server/jvm.dll');
    dll = existsSync(jvmPathx86) ? jvmPathx86 : jvmPathx64;

    binary = dll || dylib || so;

    let jvm_dll_path = resolve(__dirname, '../node_modules/java/build/jvm_dll_path.json');
    let jvmPath = binary ? JSON.stringify(delimiter + dirname(resolve(home, binary))) : '""';
    if (existsSync(jvm_dll_path)) {
        readFile(jvm_dll_path, (err, text) => {
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
    function WriteJvmPath() {
        LogHelper.writeInfo('WriteJvmPath');
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
    function ImportJava() {
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
 *@param {String} Class 类名
 * 等待Java程序初始化
 */
function InitClass(Class) {
    return new Promise((resolve, reject) => {
        java.newInstance('file.' + Class, (err, NewClass) => {//实例化Java类
            if (err) {//实例化错误
                LogHelper.writeErr(err);
                reject(err)
            } else {
                JavaClass[Class] = NewClass;
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
async function WaitingFuncAndDo(ClassName: string, FuncName: string, Args?: Array<number | string | Function>) {
    return new Promise(async (resolve, reject) => {
        if (!JavaClass[ClassName]) if (!await InitClass(ClassName)) throw new Error(`类:${ClassName} 实例化失败`);
        if (!Args) Args = [];
        Args[Args.length] = (err, Msg) => {
            if (err) {//调用失败
                LogHelper.writeErr(err);
                resolve({State: false, Msg: 'Call Method:' + FuncName + ' Error'})
            } else {//调用成功
                let Res;
                try {
                    Res = JSON.parse(Msg)//解析消息体
                } catch (err) {
                    LogHelper.writeErr(err);
                    resolve({State: false, Msg: '无法解析数据:' + Msg})
                }
                if (Res.State) {//成功消息
                    resolve({State: true, Msg: Res.Msg, Data: Res.Data})
                } else {//错误消息
                    resolve({State: false, Msg: Res.Msg})
                }
            }
        };
        JavaClass[ClassName][FuncName](...Args)
    })
}

// export default $this;

export default class {
    public Case: Case;
    public Mark: Mark;
    public Search: Search;
    public Role: Role;
    public User: User;
    public Export: Export;
    public Phone: Phone;
    public Class: Class;

    constructor() {
        CheckedJre();
        this.Case = new Case();
        this.Mark = new Mark();
        this.Search = new Search();
        this.Role = new Role();
        this.User = new User();
        this.Export = new Export();
        this.Phone = new Phone();
        this.Class = new Class()
    }
}
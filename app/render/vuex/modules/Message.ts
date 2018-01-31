import types from '../mutation-types'

const state: any = {
  Messages: []
}
const getters = {
  GetAllMessages (state: any): any {
    state.Messages.forEach((d: any) => {
      switch (d.Type.toUpperCase()) {
        case 'ERROR':
          d.Type = 'alert-danger'
          break
        case 'INFO':
          d.Type = 'alert-info'
          break
        case 'SUCCESS':
          d.Type = 'alert-success'
          break
        case 'WARNING':
          d.Type = 'alert-warning'
          break
        default:
          d.Type = 'alert-danger'
          break
      }
    })
    return state.Messages
  }
}
const actions: any = {
  AddMessage (dispatch: any, commit: any, Msg: any): any {
    if (Msg.Message.length > 0) {//不输出空的消息
      Msg.Id = new Date().getTime()//给消息生成一个Id
      setTimeout(() => {//添加定时器,定时移除消息
        dispatch('RemoveMessage', Msg.Id)
      }, Msg.Time ? Msg.Time : 5000)
      commit(types.Add_To_Messages, Msg)
    }
  },
  RemoveMessage (commit: any, MsgId: string): any {
    let Index = 0
    let Has = state.Messages.find((d: any, i: number) => {//寻找消息,并获取消息所在位置
      if (d.Id === MsgId) {
        Index = i
        return true
      }
      return false
    })
    if (Has) commit(types.Remove_Messages_ById, Index)
  }
}
const mutations: any = {
  [types.Add_To_Messages] (state: any, Msg: any): any {
    state.Messages.push(Msg)
  },
  [types.Remove_Messages_ById] (state: any, Index: number): any {
    state.Messages.splice(Index, 1)
  }
}

export default {state, getters, actions, mutations}
import types from '../mutation-types'

const state = {
  Messages: []
}
const getters = {
  GetAllMessages (state) {
    state.Messages.forEach((d) => {
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
const actions = {
  AddMessage ({dispatch, commit}, Msg) {
    if (Msg.Message.length > 0) {//不输出空的消息
      Msg.Id = new Date().getTime()//给消息生成一个Id
      setTimeout(() => {//添加定时器,定时移除消息
        dispatch('RemoveMessage', Msg.Id)
      }, Msg.Time ? Msg.Time : 5000)
      commit(types.Add_To_Messages, Msg)
    }
  },
  RemoveMessage ({commit}, MsgId) {
    let Index = 0
    let Has = state.Messages.find((d, i) => {//寻找消息,并获取消息所在位置
      if (d.Id === MsgId) {
        Index = i
        return true
      }
    })
    if (Has) commit(types.Remove_Messages_ById, Index)
  }
}
const mutations = {
  [types.Add_To_Messages] (state, Msg) {
    state.Messages.push(Msg)
  },
  [types.Remove_Messages_ById] (state, Index) {
    state.Messages.splice(Index, 1)
  }
}

export default {state, getters, actions, mutations}
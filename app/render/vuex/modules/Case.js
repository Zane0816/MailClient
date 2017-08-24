import types from '../mutation-types'

const state = {
  Cases: [{Id: 'test', Text: 'test', Children: [{Id: 'test1', Text: 'test001'}]}],
  CurrentCase: {}
}

const getters = {
  GetAllCase () {
    return state.Cases
  }
}
const actions = {
  AddCase () {

  }
}
const mutations = {}
export default {state, getters, actions, mutations}
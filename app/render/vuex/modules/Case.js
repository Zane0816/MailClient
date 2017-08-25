import types from '../mutation-types'

const state = {
  Cases: [{Id: 'test', Text: 'test', Children: [{Id: 'test1', Text: 'test001'}]}, {
    Id: 'test2',
    Text: 'test002',
    Checked: true
  }, {
    Id: 'test3',
    Text: 'test003',
    Checked: false,
    Icon: 'glyphicon glyphicon-heart',
    Children: [{
      Id: 'test31',
      Text: 'test0031',
      Checked: false,
      Children: [{
        Id: 'test311',
        Text: 'test00313',
        Checked: false,
      }]
    }]
  }],
  CurrentCase: {}
}

const getters = {
  GetAllCase () {
    return state.Cases
  },
  GetCurrentCase () {
    return state.CurrentCase
  }
}
const actions = {
  AddCase () {

  },
  SetCurrentCase ({commit}, Case) {
    commit(types.Set_Current_Case, Case)
  }
}
const mutations = {
  [types.Set_Current_Case] ({state}, Case) {
    state.CurrentCase = Case
  }
}
export default {state, getters, actions, mutations}
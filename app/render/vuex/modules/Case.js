import types from '../mutation-types'

const state = {
  Cases: [{Id: 'test', Text: 'test', Children: [{Id: 'test1', Text: 'test001', Type: 'Evidence'}], Type: 'Case'}, {
    Id: 'test2',
    Text: 'test002',
    Checked: true,
    Type: 'Case'
  }, {
    Id: 'test3',
    Text: 'test003',
    Checked: false,
    Icon: 'glyphicon glyphicon-heart',
    Children: [{
      Id: 'test31',
      Text: 'test0031',
      Checked: false,
      Type: 'Evidence'
    }]
  }],
  CurrentCase: {}
}

const getters = {
  GetAllCase () {
    return state.Cases
  },
  GetCurrentCase () {
    if (!state.CurrentCase.Id)
      state.CurrentCase = state.Cases[0]
    return state.CurrentCase
  }
}
const actions = {
  AddCase ({commit}, Case) {
    commit(types.Add_Case, Case)
  },
  SetCurrentCase ({commit}, Case) {
    commit(types.Set_Current_Case, Case)
  }
}
const mutations = {
  [types.Set_Current_Case] (state, Case) {
    state.CurrentCase = Case
  },
  [types.Add_Case] (state, Case) {
    state.Cases.push(Case)
  }
}
export default {state, getters, actions, mutations}
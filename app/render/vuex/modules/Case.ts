import types from '../mutation-types'

const state: any = {
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
  CurrentCase: {Id: ''}
}

const getters: any = {
  GetAllCase (): any {
    return state.Cases
  },
  GetCurrentCase (state: any): any {
    if (!state.CurrentCase.Id)
      state.CurrentCase = state.Cases[0]
    return state.CurrentCase
  }
}
const actions: any = {
  AddCase (commit: any, Case: any): any {
    commit(types.Add_Case, Case)
  },
  SetCurrentCase (commit: any, Case: any): any {
    commit(types.Set_Current_Case, Case)
  }
}
const mutations: any = {
  [types.Set_Current_Case] (state: any, Case: any): any {
    state.CurrentCase = Case
  },
  [types.Add_Case] (state: any, Case: any): any {
    state.Cases.push(Case)
  }
}
export default {state, getters, actions, mutations}
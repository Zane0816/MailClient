import types from '../mutation-types';
var state = {
    Cases: [{ Id: 'test', Text: 'test', Children: [{ Id: 'test1', Text: 'test001', Type: 'Evidence' }], Type: 'Case' }, {
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
    CurrentCase: { Id: '' }
};
var getters = {
    GetAllCase: function () {
        return state.Cases;
    },
    GetCurrentCase: function () {
        if (!state.CurrentCase.Id)
            state.CurrentCase = state.Cases[0];
        return state.CurrentCase;
    }
};
var actions = {
    AddCase: function (_a, Case) {
        var commit = _a.commit;
        commit(types.Add_Case, Case);
    },
    SetCurrentCase: function (_a, Case) {
        var commit = _a.commit;
        commit(types.Set_Current_Case, Case);
    }
};
var mutations = (_a = {},
    _a[types.Set_Current_Case] = function (state, Case) {
        state.CurrentCase = Case;
    },
    _a[types.Add_Case] = function (state, Case) {
        state.Cases.push(Case);
    },
    _a);
export default { state: state, getters: getters, actions: actions, mutations: mutations };
var _a;
//# sourceMappingURL=Case.js.map
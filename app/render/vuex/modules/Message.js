import types from '../mutation-types';
var state = {
    Messages: []
};
var getters = {
    GetAllMessages: function (state) {
        state.Messages.forEach(function (d) {
            switch (d.Type.toUpperCase()) {
                case 'ERROR':
                    d.Type = 'alert-danger';
                    break;
                case 'INFO':
                    d.Type = 'alert-info';
                    break;
                case 'SUCCESS':
                    d.Type = 'alert-success';
                    break;
                case 'WARNING':
                    d.Type = 'alert-warning';
                    break;
                default:
                    d.Type = 'alert-danger';
                    break;
            }
        });
        return state.Messages;
    }
};
var actions = {
    AddMessage: function (_a, Msg) {
        var dispatch = _a.dispatch, commit = _a.commit;
        if (Msg.Message.length > 0) {
            Msg.Id = new Date().getTime(); //给消息生成一个Id
            setTimeout(function () {
                dispatch('RemoveMessage', Msg.Id);
            }, Msg.Time ? Msg.Time : 5000);
            commit(types.Add_To_Messages, Msg);
        }
    },
    RemoveMessage: function (_a, MsgId) {
        var commit = _a.commit;
        var Index = 0;
        var Has = state.Messages.find(function (d, i) {
            if (d.Id === MsgId) {
                Index = i;
                return true;
            }
        });
        if (Has)
            commit(types.Remove_Messages_ById, Index);
    }
};
var mutations = (_a = {},
    _a[types.Add_To_Messages] = function (state, Msg) {
        state.Messages.push(Msg);
    },
    _a[types.Remove_Messages_ById] = function (state, Index) {
        state.Messages.splice(Index, 1);
    },
    _a);
export default { state: state, getters: getters, actions: actions, mutations: mutations };
var _a;
//# sourceMappingURL=Message.js.map
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './vuex'
import App from './App.vue'
import Loading from './pages/Loading.vue'
import Home from './pages/Home.vue'
import Manager from './pages/Manager.vue'
import ManagerCase from './pages/ManagerCase.vue'
import ManagerUser from './pages/ManagerUser.vue'
import AddCase from './pages/AddCase.vue'
import CaseInfo from './pages/CaseInfo.vue'
import EvidenceInfo from './pages/EvidenceInfo.vue'
import AddEvidence from './pages/AddEvidence.vue'

Vue.use(VueRouter)
// Vue.config.debug = true;

const routes = [{
  path: '/',
  component: Loading
},
  {
    path: '/Home',
    component: Home,
    children: [
      {
        path: '/',
        component: Manager,
        children: [
          {
            path: 'Case',
            component: ManagerCase,
            children: [
              {
                path: 'Add',
                component: AddCase
              }, {
                path: '/',
                component: CaseInfo
              }, {
                path: 'Evidence',
                component: EvidenceInfo
              }, {
                path: 'AddEvidence',
                component: AddEvidence
              },
            ]
          },
          {
            path: 'User',
            component: ManagerUser
          }
        ]
      },
      {
        path: '/Main',
        component: ManagerCase
      }
    ]
  },
  {
    path: '*',
    component: Loading
  }
]

const router = new VueRouter({routes})

new Vue({el: '#app', store, router, render: h => h(App)})


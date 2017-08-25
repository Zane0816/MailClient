import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Loading from './pages/Loading'
import Home from './pages/Home'
import Manager from './pages/Manager'
import ManagerCase from './pages/ManagerCase'
import ManagerUser from './pages/ManagerUser'
import AddCase from './pages/AddCase'
import CaseInfo from './pages/CaseInfo'

Vue.use(VueRouter)
Vue.config.debug = true

const routes = [{
  path: '/',
  component: Loading
}, {
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
}, {
  path: '*',
  component: Loading
}]

const Router = new VueRouter({routes})

// Vue.directive('ChooseDirectory', (el, binding) => {
//   el.onclick = () => {}
// })

new Vue({el: '#app', router: Router, render: h => h(App)})


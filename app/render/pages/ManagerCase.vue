<template>
  <div class="container-full ManagerContent">
    <div class="panel panel-default container-full ManagerLeftContent">
      <div class="panel-heading"><h3 class="panel-title">案件列表</h3></div>
      <div class="panel-body">
        <Tree :Data="CaseList" :Options="TreeConfig"></Tree>
      </div>
    </div>
    <router-view transition='display' transition-mode='out-in' keep-alive></router-view>
  </div>
</template>
<script>
  import Tree from '../components/Tree'
  import ChooseDirectory from '../components/ChooseDirectory'
  import store from '../vuex'

  export default {
    components: {Tree, ChooseDirectory},
    data () {
      return {
        TreeConfig: {
          Click ($this, item) {
            if ($this.$route.path !== '/Home/Case' && item.Type === 'Case') {
              $this.$router.push({path: '/Home/Case', query: {Id: item.Id}})
            }
            if ($this.$route.path !== '/Home/Case/Evidence' && item.Type === 'Evidence') {
              $this.$router.push('/Home/Case/Evidence')
            }
            store.dispatch('SetCurrentCase', item)
          },
        },
        CasePath: {Path: '', placeholder: '请选择案件路径'},
      }
    }, mounted () {
      if (!this.TreeConfig.SelectedId)
        this.$set(this.TreeConfig, 'SelectedId', this.CaseList[0].Id)

    },
    methods: {},
    computed: {
      CaseList () {
        return store.getters.GetAllCase
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (to.path === '/Home/Case' && !to.query.Id) {
        this.$set(this.TreeConfig, 'SelectedId', this.CaseList[0].Id)
        store.dispatch('SetCurrentCase', this.CaseList[0])
      }
      next()
    },
  }
</script>
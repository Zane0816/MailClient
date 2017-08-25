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
//            $this.$router.push('/Home/Case/' + item.Id)
            store.dispatch('SetCurrentCase', item)
          }
        },
        CasePath: {Path: '', placeholder: '请选择案件路径'},
      }
    }, mounted () {
//      this.$router.push('/Home/Case/' + this.CaseList[0].Id)
    },
    methods: {},
    computed: {
      CaseList () {
        return store.getters.GetAllCase
      }
    }
  }
</script>
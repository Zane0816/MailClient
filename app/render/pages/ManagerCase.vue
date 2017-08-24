<template>
  <div class="container-full ManagerContent">
    <div class="panel panel-default container-full ManagerLeftContent">
      <div class="panel-heading"><h3 class="panel-title">案件列表</h3></div>
      <div class="panel-body">
        <Tree :Data="CaseList"></Tree>
      </div>
    </div>

    <div class="panel panel-default container-full ManagerRightContent">
      <div class="panel-heading">
        <h3 class="panel-title">案件属性</h3>
      </div>
      <div class="panel-body">
        
      </div>
    </div>
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
        TreeConfig: {},
        CaseList: [{Text: 'test', Children: [{Text: 'test1'}]}],
        CasePath: {Path: '', placeholder: '请选择案件路径'},
      }
    }, mounted () {
    },
    methods: {}
  }
</script>
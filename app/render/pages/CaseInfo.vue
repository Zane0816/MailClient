<template>
  <div class="panel panel-default container-full ManagerRightContent">
    <div class="panel-heading">
      <h3 class="panel-title">案件属性</h3>
      <div class="Tool">
        <router-link to="/Home/Case/AddEvidence" class="btn btn-default">添加证据</router-link>
        <button type="submit" class="btn btn-default">案件报告</button>
        <button type="submit" class="btn btn-primary">进入案件</button>
      </div>
    </div>
    <div class="panel-body">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">案件名:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">创建人:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">创建时间:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">缓存文件目录:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">索引文件目录:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">描述:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import state from '../vuex'

  export default {
    computed: {
      CurrentCase () {
        return state.getters.GetCurrentCase
      },
    }
  }
</script>
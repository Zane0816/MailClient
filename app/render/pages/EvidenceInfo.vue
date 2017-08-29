<template>
  <div class="panel panel-default container-full ManagerRightContent">
    <div class="panel-heading">
      <h3 class="panel-title">证据属性</h3>
      <div class="Tool">
        <button type="submit" class="btn btn-default">案件报告</button>
        <button type="submit" class="btn btn-primary">进入案件</button>
      </div>
    </div>
    <div class="panel-body">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">证据名:</label>
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
          <label class="col-sm-2 control-label">证据数量:</label>
          <div class="col-sm-10">
            <p class="form-control-static"> {{CurrentCase.Text}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">添加时间:</label>
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
          <label class="col-sm-2 control-label">原始文件目录:</label>
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
      }
    }
  }
</script>
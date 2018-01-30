<template>
  <div class="panel panel-default container-full ManagerRightContent">
    <div class="panel-heading">
      <h3 class="panel-title">新建案件</h3>
    </div>
    <div class="panel-body">
      <form class="form-horizontal" @submit="AddCase">
        <div class="form-group">
          <label for="CaseName" class="col-sm-2 control-label">案件名:</label>
          <div class="col-sm-10">
            <input class="form-control" id="CaseName" placeholder="案件名" v-model="Case.Text">
          </div>
        </div>
        <div class="form-group">
          <label for="Creator" class="col-sm-2 control-label">创建人:</label>
          <div class="col-sm-10">
            <input class="form-control" id="Creator" placeholder="创建人" v-model="Case.Creator">
          </div>
        </div>
        <div class="form-group">
          <label for="CaseDataDir" class="col-sm-2 control-label">案件数据目录:</label>
          <div class="col-sm-10">
            <div class="input-group">
              <input class="form-control" id="CaseDataDir" placeholder="案件数据目录" v-model="Case.CaseDataDir" readonly>
              <div class="input-group-btn">
                <button class="btn btn-default" type="button" @click="Choose('CaseDataDir')">
                  <span class="glyphicon glyphicon-search"></span></button>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="CompositeFilesDir" class="col-sm-2 control-label">复合文件目录:</label>
          <div class="col-sm-10">
            <div class="input-group">
              <input class="form-control" id="CompositeFilesDir" placeholder="案件数据目录" v-model="Case.CompositeFilesDir"
                     readonly>
              <div class="input-group-btn">
                <button class="btn btn-default" type="button" @click="Choose('CaseDataDir')">
                  <span class="glyphicon glyphicon-search"></span></button>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="Description" class="col-sm-2 control-label">描述:</label>
          <div class="col-sm-10">
            <textarea class="form-control" id="Description" placeholder="描述" v-model="Case.Description"></textarea>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <input style="display: none" type="file" nwdirectory @change="PathChange" />
            <button type="submit" class="btn btn-default">创建</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
  import state from '../vuex/index'
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class AddCase extends Vue {
    Case = {}
    PathTarget = null

    AddCase () {
      state.dispatch('AddCase', this.Case)
      this.$router.push('/Home/Case')
    }

    PathChange (e) {
      this.$set(this.Case, this.PathTarget, e.target.value)
      e.target.value = null
    }

    Choose (Target) {
      this.PathTarget = Target
      this.$el.querySelector('input[type=file]').click()
    }
  }
</script>
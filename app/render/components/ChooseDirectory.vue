<template>
  <div class="input-group">
    <input style="display: none" type="file" nwdirectory @change="PathChange" />
    <input class="form-control" :placeholder="Options.placeholder" :value="Options.Path">
    <span class="input-group-btn">
        <button class="btn btn-default" type="button" @click="Choose">
          <span class="glyphicon glyphicon-search"></span></button>
      </span>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class extends Vue {
    Options: { placeholder: '', Path: '' }

    Choose () {
      this.$el.querySelector('input[type=file]').click()
    }

    PathChange (e) {
      this.Options.Path = e.target.value
      e.target.value = null
    }

  }
</script>
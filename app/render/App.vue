<template>
  <router-view transition='display' transition-mode='out-in' keep-alive></router-view>
</template>
<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.css'
  import '../css/index.css'
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component({})
  export default class App extends Vue {

  }
</script>　
<template>
  <div class="LoadingBG">
    <!--LOGO-->
    <div class="Logo">
      <img src="../../img/login.png" alt="">
    </div>
    <!--进度条-->
    <div class="progress">
      <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0"
           aria-valuemax="100" :style="{width:progress+'%'}">
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component({})
  export default class Loading extends Vue {
    // progress = 0
    // time = null
    //
    // mounted () {
    //   this.Loading()
    // }
    //
    // Loading () {
    //   this.progress += 1
    //   if (this.progress >= 100) {
    //     clearTimeout(this.time)
    //     this.$router.push('/Home')
    //   }
    //   else {
    //     this.time = setTimeout(() => {
    //       this.Loading()
    //     }, 50)
    //   }
    // }
  }
</script>
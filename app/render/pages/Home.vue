<template>
  <div class="container-full">
    <!--星云文件分析系统导航-->
    <div id="nav">
      <span class="nav-logo"></span>
      <span class="nav-title">星云文件分析系统</span>
      <div class="rg">
        <a class="WinSmall" @click="WinSmall"></a>
        <a class="WinMax" :class="{active:IsMax}" @click="WinMax"></a>
        <a class="WinClose" @click="WinClose"></a>
      </div>
    </div>
    <router-view transition='display' transition-mode='out-in' keep-alive></router-view>
    <AlertMsg></AlertMsg>
  </div>
</template>
<script>
  import { remote } from 'electron'
  import AlertMsg from '../components/AlertMsg'

  const Win = remote.getCurrentWindow()
  export default {
    components: {AlertMsg},
    data () {
      return {
        IsMax: false
      }
    },
    methods: {
      WinClose () {
        Win.close()
      },
      WinSmall () {
        Win.minimize()
      },
      WinMax () {
        if (this.IsMax) {
          Win.unmaximize()
        } else {
          Win.maximize()
        }
      },

    },
    mounted () {
      Win.on('maximize', () => {
        this.IsMax = true
      })
      Win.on('unmaximize', () => {
        this.IsMax = false
      })
    }
  }
</script>
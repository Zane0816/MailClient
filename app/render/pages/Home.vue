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
  import store from '../vuex/index'
  import AlertMsg from '../components/AlertMsg'

  const win = nw.Window.get()
  export default {
    components: {AlertMsg},
    data () {
      return {
        IsMax: false
      }
    },
    methods: {
      WinClose () {
        win.close()
        if (win.appWindow.id === '') {
          nw.App.quit()
        }
      },
      WinSmall () {
        win.minimize()
      },
      WinMax () {
        if (this.IsMax) {
          win.restore()
        } else {
          win.maximize()
        }
      }
    },
    mounted () {
      win.removeAllListeners('maximize')
      win.removeAllListeners('restore')
      win.on('maximize', () => {
        this.IsMax = true
      })
      win.on('restore', () => {
        this.IsMax = false
      })
    }
  }
</script>
<template>
  <div class="container-full HomeContent">
    <nav class="navbar navbar-default" id="ManagerNav">
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li><a>开始</a>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/Home/Case/Add">新建案件</router-link>
                </li>
                <li><a>退出系统</a></li>
              </ul>
            </li>
            <li><a>登录</a>
              <ul class="dropdown-menu">
                <li><a>退出登录</a></li>
              </ul>
            </li>
            <li>
              <a>设置</a>
            </li>
            <li>
              <a @click="ShowAbout">关于</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="ManagerTab">
      <ul id="tabs-nav">
        <li>
          <router-link to="/Home/Case" activeClass="active">案件管理</router-link>
        </li>
        <li v-if="IsLogged">
          <router-link to="/Home/User" activeClass="active">用户管理</router-link>
        </li>
      </ul>
    </div>
    <router-view transition='display' transition-mode='out-in' keep-alive></router-view>
    <Modal :Options="AboutConfig">
      <h4 slot="header">关于我们</h4>
      <div slot="body">
        <h1>这是一个用electron+vue.js写的应用</h1>
        <h2>至于有什么用</h2>
        <h3>暂时还没有吧</h3>
        <h4>只是想用这俩个技术</h4>
        <h5>写个东西</h5>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
  import Modal from '../components/Modal'
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component({
    components: {Modal}
  })
  export default class Manager extends Vue {
    AboutConfig = {Show: true, Size: 1, NoFooter: true}
    IsLogged: false

    ShowAbout () {
      this.AboutConfig.Show = !this.AboutConfig.Show
    }

    mounted () {
      this.$router.push('/Home/Case')
    }
  }
</script>
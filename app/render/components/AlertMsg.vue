<template>
  <div class="AlertMsg">
    <div v-for="item in Messages" class="alert alert-dismissible " :class="item.Type" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="CloseMsg(item.Id)"><span
        aria-hidden="true">&times;</span></button>
      <div v-html="item.Message"></div>
    </div>
    <!--<p v-for="item in Messages">{{item.Message}}</p>-->
  </div>
</template>
<script lang="ts">
  import store from '../vuex/index'
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class AlertMsg extends Vue {

    get Messages () {
      return store.getters.GetAllMessages
    }

    CloseMsg (MsgId) {
      store.dispatch('RemoveMessage', MsgId)
    }

  }
</script>
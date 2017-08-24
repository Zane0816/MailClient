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
<script>
  import store from '../vuex/index'

  export default {
    computed: {
      Messages () {
        return store.getters.GetAllMessages
      }
    },
    methods: {
      CloseMsg (MsgId) {
        store.dispatch('RemoveMessage', MsgId)
      }
    }
  }
</script>
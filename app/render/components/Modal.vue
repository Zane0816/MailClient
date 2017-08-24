<template>
  <transition name="modal" v-if="Options.Show" @enter="focus">
    <div class="modal" tabindex="-1" role="dialog" @click="close" @keyup.esc="close">
      <div class="modal-dialog" role="document" :class="{'modal-lg':Options.Size===1,'modal-sm':Options.Size===0}">
        <div class="modal-content">
          <div class="modal-header" v-if="!Options.NoHeader">
            <button type="button" class="close" @click="close">&times;</button>
            <slot name="header"></slot>
          </div>
          <div class="modal-body" :style="Options.BodyStyle">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer" v-if="!Options.NoFooter">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      Options: {Show: false, Size: 0, NoHeader: false, NoFooter: false, BodyStyle: {}}
    },
    computed: {},
    watch: {},
    methods: {
      close (e) {
        if (e.target.className === 'modal' || e.target.className === 'close') this.Options.Show = false
      },
      focus (el) {
        el.focus()
      }
    },
    mounted () {
    }
  }
</script>

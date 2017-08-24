<template>
  <ul>
    <li v-for="item in Data">
      <input v-if="item.Checked" type="checkbox" :checked="{checked:item.Checked}" />
      <span v-if="item.Icon" :class="item.Icon"></span>
      {{item.Text}}
      <Tree v-if="item.Children" :Data="item.Children"></Tree>
    </li>
  </ul>
</template>
<script>

  export default {
    name: 'Tree',
    data () {
      return {open: false}
    },
    props: {
      Data: Array,
      Options: Object
    },
    computed: {
      isFolder: function () {
        return this.Data.children &&
          this.Data.children.length
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      }
    }
  }
</script>
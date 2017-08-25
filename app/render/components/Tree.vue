<template>
  <ul class="Tree list-group">
    <li v-for="item in Data" class="list-group-item"
        :class="{active:Options.SelectedId===item.Id,disabled :item.Selectable}"
        @click.stop="Select(item)">
      <p>
        <span v-if="item.Children" class="glyphicon" :class="item.Expanded?'glyphicon-minus':'glyphicon-plus'"
              @click.stop="Toggle(item)"></span>
        <span v-if="item.hasOwnProperty('Checked')" class="glyphicon"
              :class="item.Checked?'glyphicon glyphicon-check':'glyphicon glyphicon-unchecked'"
              @click.stop="Check(item)"></span>
        <span v-if="item.Icon" :class="item.Icon"></span>
        {{item.Text}}
        <span class="badge" v-if="item.Notes">{{item.Notes}}</span></p>
      <Tree v-if="item.Children&&item.Expanded" :Data="item.Children" :Options='Options'></Tree>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'Tree',
    data () {
      return {}
    },
    props: {
      Data: Array,
      Options: Object
    },
    computed: {},
    methods: {
      Toggle (item) {
        this.$set(item, 'Expanded', !item.Expanded)
      },
      Select (item) {
        if (!item.Selectable) {
          this.$set(this.Options, 'SelectedId', item.Id)
          this.Options.Click(this, item)
        }
      }, Check (item) {
        this.$set(item, 'Checked', !item.Checked)
      }
    }
  }
</script>
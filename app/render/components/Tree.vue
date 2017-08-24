<template>
  <ul class="Tree list-group">
    <li v-for="(item,i) in Data" class="list-group-item" :class="{active:item.Selected,disabled :item.Selectable}"
        @click="Select(item,i)">
      <span v-if="item.Children" class="glyphicon" :class="item.Expanded?'glyphicon-minus':'glyphicon-plus'"
            @click="Toggle(item,i)"></span>
      <span v-if="item.Checked" class="glyphicon"
            :class="item.Checked?'glyphicon glyphicon-check':'glyphicon glyphicon-unchecked'"></span>
      <span v-if="item.Icon" :class="item.Icon"></span>
      {{item.Text}}
      <span class="badge" v-if="item.Notes">{{item.Notes}}</span>
      <Tree v-if="item.Children&&item.Expanded" :Data="item.Children"></Tree>
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
    computed: {},
    methods: {
      Toggle (item, i) {
        item.Expanded = !item.Expanded
        this.Data.splice(i, 1, item)
      },
      Select (item, i) {
        if (!item.Selectable) {
          this.RemoveSelected()
          item.Selected = true
          this.Data.splice(i, 1, item)
        }
      },
      RemoveSelected () {
        this.Data.forEach((d) => {
          console.log(d)
          delete d.Selected
          if(d.Children){
            d.Children.forEach((dc)=>{
              delete dc.Selected
            })
          }
        })
      }
    }
  }
</script>
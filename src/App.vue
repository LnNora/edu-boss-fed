<template>
  <div id="app">
    <!--根路由出口-->
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      count: 2,
      name: 'iPhone',
      prop: {
        color: 'black',
        type: '11'
      }
    }
  }
})
</script>
<style lang="scss" scoped>
p {
  color: $danger-color;
}
</style>

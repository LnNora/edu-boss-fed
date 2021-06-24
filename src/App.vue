<template>
  <div id="app">
    <!--根路由出口-->
    <h1>Hello Vue</h1>
    <p>{{ name }}</p>
    <router-view />
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type='primary'>主要按钮</el-button>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {
  count = 2;
  name = 'iPhone';
  prop = {
    color: 'black',
    type: '11'
  };

  test () {
    console.log(this.name)
  }
}
</script>
<style lang="scss" scoped>
p {
  color: $danger-color;
}
</style>

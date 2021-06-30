<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>
      <el-tree ref="menu-tree" :data="menus" node-key="id" :props="defaultProps" show-checkbox default-expand-all @node-click="handleNodeClick"></el-tree>
    </el-card>
    <div style="text-align:center">
      <el-button>清空</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenu } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AlloMenu',
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      }
    }
  },
  created () {
    this.loadMenus()
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      console.log(data)
      this.menus = data.data
    },
    handleNodeClick (data: any) {
      console.log(data)
    },
    async onSave () {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      await allocateRoleMenu({
        roleId: this.roleId,
        menuIdList: menuIdList
      })
      this.$message.success('操作成功')
      this.$router.back()
    }
  }
})
</script>

<style>

</style>

<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button @click="addRole">添加角色</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="roles"
        style="width: 100%;margin-bottom: 20px">
        <el-table-column
          type="index"
          label="编号"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button @click="$router.push({ name: 'alloc-menu', params: { roleId: scope.row.id } })" type="text" size="small">分配菜单</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">分配资源</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <CreateOrEdit v-if="dialogVisible" @success="onSuccess" @cancel="dialogVisible=false" :isEdit="isEdit" :roleId="roleId"/>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [],
      form: {
        name: ''
      },
      isLoading: true,
      dialogVisible: false,
      isEdit: false,
      roleId: null
    }
  },
  created () {
    this.loadResources()
  },
  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        this.roles = data.data.records
      }
      this.isLoading = false
    },
    onSubmit () {
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.loadResources()
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadResources()
    },
    addRole () {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleEdit (role: any) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

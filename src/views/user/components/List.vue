<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="手机号" ></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onDateChange"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="isLoading"
        :data="resources"
        style="width: 100%;margin-bottom: 20px">
        <el-table-column
          type="index"
          label="编号"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button  @click="handleAllot(scope.row)" type="text" size="small">分配角色</el-button>
            <el-button @click="handleForbidden(scope.row)" type="text" size="small" >禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
    </el-pagination>
    </el-card>
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      date: '',
      resources: [],
      form: {
        phone: '',
        currentPage: 1, // 默认查询第1页
        pageSize: 10, // 每页大小
        startCreateTime: '',
        endCreateTime: ''
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: true,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentUser: {}
    }
  },
  created () {
    this.loadResources()
  },
  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getUserPages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    onSubmit () {
      this.form.currentPage = 1
      this.loadResources()
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadResources()
    },
    onDateChange (val: any) {
      this.form.startCreateTime = val[0]
      this.form.endCreateTime = val[1]
    },
    async handleAllot (role: any) {
      this.currentUser = role
      const { data } = await getAllRoles()
      this.roles = data.data
      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      this.roleIdList = userRoles.map((item: any) => item.id)
      this.dialogVisible = true
    },
    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      this.$message.success('分配成功')
      this.dialogVisible = false
      this.roleIdList = []
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="position:relative">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="form.courseName" placeholder="课程名称" ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="状态" clearable>
              <el-option v-for="item in ttt" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button @click="$router.push({ name: 'course-create' })" style="position:absolute;top:0;right:0" type="primary"><i class="el-icon-upload el-icon-plus"></i>新建课程</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="courses"
        style="width: 100%;margin-bottom: 20px">
        <el-table-column
          prop="id"
          label="ID"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button @click="onStateChange(scope.row)" size="small" type="success">上架</el-button>
            <el-button @click="handleEdit(scope.row)" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)"  size="small" >内容管理</el-button>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCoursePages, changeState } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      courses: [],
      form: {
        courseName: '',
        status: 0,
        currentPage: 1, // 默认查询第1页
        pageSize: 10 // 每页大小
      },
      totalCount: 0,
      ttt: [],
      isLoading: true
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      this.isLoading = true
      const { data } = await getCoursePages(this.form)
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadCourses()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadCourses()
    },
    async onStateChange (course: any) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      course.isStatusLoading = false
      this.$message.success(`${course.status === 0 ? '下架成功' : '上架成功'}`)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

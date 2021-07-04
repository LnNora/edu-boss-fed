<template>
  <div class="course-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(step, index) in steps"
            :key="step.title"
            :title="step.title"
            :icon="step.icon"
            @click.native="activeStep=index"
          ></el-step>
        </el-steps>
      </div>
      <el-form label-width="80px">
        <!--基本信息-->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input v-model="course.previewFirstField" type="textarea" placeholder="概述1" style="margin-bottom:10px"></el-input>
            <el-input v-model="course.previewSecondField" type="textarea" placeholder="概述2"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number label="排序" v-model="course.sortNum"></el-input-number>
          </el-form-item>
        </div>
        <!--课程封面-->
        <div v-show="activeStep === 1">
          <el-form-item label="课程封面">
            <course-image v-model="course.courseListImg" />
          </el-form-item>
          <el-form-item label="解锁封面">
            <course-image v-model="course.courseImgUrl" />
          </el-form-item>
        </div>
        <!--销售信息-->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input placeholder="请输入售卖价格" v-model="course.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="原价">
            <el-input placeholder="请输入原价" v-model="course.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input placeholder="请输入销量" v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input placeholder="请输入活动标签" v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>
        <!--秒杀活动-->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input placeholder="请输入秒杀价" v-model="course.activityCourseDTO.amount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input placeholder="请输入秒杀库存" v-model="course.activityCourseDTO.stock">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>

        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
              <TextEditor v-model="course.courseDescriptionMarkDown"/>
          </el-form-item>
          <el-form-item label="是否发布">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button v-if="activeStep >= 0 && activeStep < 4" @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse } from '@/services/course'
import CourseImage from './components/CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'

export default Vue.extend({
  components: {
    CourseImage,
    TextEditor
  },
  name: 'CourseCreate',
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      course: {
        // id: 0,
        courseName: "课程名称",
        brief: "课程简介",
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: "讲师姓名",
          teacherHeadPicUrl: "",
          position: "",
          description: "讲师简介"
        },
        courseDescriptionMarkDown: "课程详情",
        price: 5000,
        discounts: 2000,
        priceTag: "",
        discountsTag: "活动标签",
        isNew: true,
        isNewDes: "",
        courseListImg: "",
        courseImgUrl: "",
        sortNum: 5,
        previewFirstField: "概述1",
        previewSecondField: "概述2",
        status: 0,
        sales: 20,
        activityCourse: true,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: "",
          endTime: "",
          amount: 9.9,
          stock: 10
        },
        autoOnlineTime: ""
      }
    }
  },
  methods: {
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      console.log(data)
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}

</style>

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
            <el-input placeholder="请输入售卖价格" v-model="input2">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="原价">
            <el-input placeholder="请输入原价" v-model="input2">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input placeholder="请输入销量" v-model="input2">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input placeholder="请输入活动标签" v-model="input2"></el-input>
          </el-form-item>
        </div>
        <!--秒杀活动-->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="isSeckill"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="isSeckill">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input placeholder="请输入秒杀价" v-model="input2">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input placeholder="请输入秒杀库存" v-model="input2">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>

        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
              <el-input placeholder="请输入内容" type="textarea">
              </el-input>
            </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
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

export default Vue.extend({
  components: { CourseImage },
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
      imageUrl: '', // 预览图片地址
      isSeckill: true, // 开启秒杀
      value1: '', // 秒杀开始时间
      input2: '',
      course: {
        id: 0,
        courseName: "",
        brief: "",
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: "",
          teacherHeadPicUrl: "",
          position: "",
          description: ""
        },
        courseDescriptionMarkDown: "",
        price: 0,
        discounts: 0,
        priceTag: "",
        discountsTag: "",
        isNew: true,
        isNewDes: "",
        courseListImg: "",
        courseImgUrl: "",
        sortNum: 0,
        previewFirstField: "",
        previewSecondField: "",
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: "",
          endTime: "",
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ""
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}

</style>

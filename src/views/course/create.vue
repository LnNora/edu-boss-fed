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
            <el-upload
              action=""
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="handleUpload"
              >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="解锁封面">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="course.courseListImg" :src="course.courseListImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
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
import { saveOrUpdateCourse, uploadCourseImage } from '@/services/course'

export default Vue.extend({
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
  },
  methods: {
    handleAvatarSuccess (res: any, file: any) {
      console.log(res)
      this.course.courseListImg = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async handleUpload (options: any) {
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd)
      this.course.courseListImg = data.data.name
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<template>
  <div class="course-section">
    <el-card>
      <div slot="header">
        课程名称
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
        >
          <div class="inner" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.sectionName" class="actions">
              <el-button>编辑</el-button>
              <el-button>添加课时</el-button>
              <el-button>状态</el-button>
            </span>
            <span v-else class="actions">
              <el-button>编辑</el-button>
              <el-button>上传视频</el-button>
              <el-button>状态</el-button>
            </span>
          </div>
        </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-sections'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      console.log(data)
      this.sections = data.data
    },
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      // draggingNode拖动的节点
      // dropNode要放置的目标节点
      // type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    async handleSort (dragNode:any, dropNode:any, type:any, event:any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (item.data.lessonDTOS || item.data.lessonDTOS === null) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (err) {
        this.$message.error(err)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>

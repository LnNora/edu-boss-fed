<template>
  <div class="course-create">
    <CreateOrUpdate is-edit :courseId="courseId"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'

export default Vue.extend({
  components: {
    CreateOrUpdate
  },
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}

</style>

<template>
  <div class="headers">
    <el-select v-model="value" class="m-2" placeholder="Select" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  </div>
</template>

<script setup>
import { ref } from "vue";


const value = ref('graph')

const options = [
  {
    value: 'graph',
    label: 'graph模式',
  },
  {
    value: 'tree',
    label: 'tree模式',
  }
]

const handleChange = (value) => {
  console.log(value);
};


</script>


<style scoped>
.headers {
  width: 100%;
  height: 32px;
  /* background-color: gray; */
  border-bottom: 1px solid var(--el-border-color);
}
tools-bar {
  position: relative;
  left: 50%;
}
</style>
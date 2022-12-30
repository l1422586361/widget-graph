<template>
    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
        open
    </el-button>

    <el-drawer v-model="drawer" size="300px" :modal="false" title="I am the title" :with-header="false">
        <span>Hi there!</span>
    </el-drawer>
</template>
  
<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>
  
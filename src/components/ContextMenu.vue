<template>
    <el-row class="tac">
        <el-col :span="12">
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <el-menu-item index="3">
                    <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <span>Navigator Four</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>
  
<script setup>
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>
<style scoped>
.el-row {
    position: absolute;
    z-index: 99999;
    top: 0;
    left: 0;
}
</style>
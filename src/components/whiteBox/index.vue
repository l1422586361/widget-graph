<template>
    <n-space>
        <n-button-group v-for="item in list" :key="item.title">
            <n-button ghost>
                <template #icon>
                    <n-icon><component :is="renderIcon(item.icon)" /></n-icon>
                    <!-- <n-icon><log-in-icon /></n-icon> -->
                </template>
            </n-button>
          
        </n-button-group>
    </n-space>
</template>

<script setup>
import { NButton, NButtonGroup, NIcon, NSpace } from 'naive-ui'
import { LogInOutline as LogInIcon,Accessibility } from "@vicons/ionicons5";
import { reactive,shallowRef,h,component } from 'vue';

const list = reactive([
    {
        title: '11',
        icon: shallowRef(LogInIcon)
    },
    {
        title: '11',
        icon: shallowRef(Accessibility)
    }
])

function renderIcon(item){
    return h(NIcon,null,{ default: ()=>h(item.icon)})
}
</script>
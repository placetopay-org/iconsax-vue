<script setup lang="ts">
import { STab, STabItem, SInput } from '@placetopay/spartan-vue'
import { ref } from 'vue';
import { $activeStyle, $query } from '@/store';
import { useStore } from '@nanostores/vue';

const query = ref('')
const style = useStore($activeStyle)
</script>

<template>
    <div class="flex justify-center flex-col items-center gap-4">
        <SInput :modelValue="query" @update:model-value="$query.set" placeholder="Search all icons" />
        <STab :modelValue="style" @update:model-value="$activeStyle.set" variant="vetches">
            <STabItem>Bold</STabItem>
            <STabItem>Outline</STabItem>
            <STabItem>Bulk</STabItem>
            <STabItem>Linear</STabItem>
            <STabItem>TwoTone</STabItem>
            <STabItem>Broken</STabItem>
        </STab>
    </div>
</template>

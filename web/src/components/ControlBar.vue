<script setup lang="ts">
import { STab, STabItem, SInput } from '@placetopay/spartan-vue'
import { $activeStyle, $query, $activeColor } from '@/store';
import { useStore } from '@nanostores/vue';

let timerId: number;
function changeColorDebounce(event: Event) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        $activeColor.set((event.target as HTMLInputElement).value);
    }, 50);
}

const query = useStore($query)
const color = useStore($activeColor)
const style = useStore($activeStyle)
</script>

<template>
    <div class="flex justify-center flex-col items-center gap-4 w-fit">
        <SInput :modelValue="query" @update:model-value="$query.set" placeholder="Search all icons" />
        <section class="w-full flex justify-between items-center gap-4">
            <STab :modelValue="style" @update:model-value="$activeStyle.set" variant="vetches">
                <STabItem>Bold</STabItem>
                <STabItem>Outline</STabItem>
                <STabItem>Bulk</STabItem>
                <STabItem>Linear</STabItem>
                <STabItem>TwoTone</STabItem>
                <STabItem>Broken</STabItem>
            </STab>

            <div class="flex h-[53px] border relative border-gray-300 bg-gray-100 p-2 rounded-xl shadow">
                <input type="color" class="h-full" :model-value="color" @input="changeColorDebounce" />
            </div>
        </section>
    </div>
</template>

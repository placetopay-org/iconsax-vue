<script setup lang="ts">
import { STab, STabItem, SInput, SSwitch } from '@placetopay/spartan-vue'
import { FilterSearchIcon } from '@placetopay/iconsax-vue/twotone';
import { $activeStyle, $query, $activeColor, $crypto } from '@/store';
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
const crypto = useStore($crypto)
</script>

<template>
    <div class="flex justify-center flex-col items-center gap-4">
        <section class="flex gap-4">
            <SInput class="self-start" :right-icon="FilterSearchIcon" :modelValue="query" @update:model-value="$query.set" placeholder="Search all icons" />
            
            <div class="flex h-[42px] border relative border-gray-300 bg-gray-100 p-1 rounded shadow">
                <input type="color" class="h-full" :model-value="color" @input="changeColorDebounce" />
            </div>
        </section>
        
        <section class="overflow-x-auto w-full">
            <STab class="mx-auto w-fit" :modelValue="style" @update:model-value="$activeStyle.set" variant="vetches">
                <STabItem>Bold</STabItem>
                <STabItem>Outline</STabItem>
                <STabItem>Bulk</STabItem>
                <STabItem>Linear</STabItem>
                <STabItem>TwoTone</STabItem>
                <STabItem>Broken</STabItem>
            </STab>  
        </section>

        <SSwitch class="self-start" :modelValue="crypto" icon @update:model-value="$crypto.set">Crypto Icons</SSwitch>
    </div>
</template>

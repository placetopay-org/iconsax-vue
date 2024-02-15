<script setup lang="ts">
import * as boldIcons from 'iconsax-vue/bold';
import * as outlineIcons from 'iconsax-vue/outline';
import * as bulkIcons from 'iconsax-vue/bulk';
import * as linearIcons from 'iconsax-vue/linear';
import * as twoToneIcons from 'iconsax-vue/twotone';
import * as brokenIcons from 'iconsax-vue/broken';
import { $activeIcon, $activeStyle, $query } from '@/store';
import { useStore } from '@nanostores/vue';

const query = useStore($query);
const activeStyle = useStore($activeStyle);

const isFiltered = (icon: string) => icon.toLocaleLowerCase().includes(query.value.toLocaleLowerCase())

const copyIcon = (icon: string) => {
    $activeIcon.set(icon);
    navigator.clipboard.writeText(icon);
}

const Icons = {
    Bold: boldIcons,
    Outline: outlineIcons,
    Bulk: bulkIcons,
    Linear: linearIcons,
    TwoTone: twoToneIcons,
    Broken: brokenIcons,
}

const icons = Object.keys(boldIcons).map(icon => icon.replace('Icon', ''));
</script>

<template>
    <section class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-x-6 gap-y-4">
        <template v-for="icon in icons">
            <article v-if="Icons[activeStyle][`${icon}Icon`] && isFiltered(icon)" tabindex="0" @click="() => copyIcon(icon)" class="group focus-visible:outline-none">
                <div class="border shadow-sm rounded-md flex justify-center items-center p-8 cursor-pointer group group-hover:scale-110 group-focus-visible:scale-110 active:scale-100 duration-100 ease-in-out">
                    <component :is="Icons[activeStyle][`${icon}Icon`]" class="w-7 h-7 group-hover:scale-150 group-focus-visible:scale-150 duration-100 ease-in-out" />
                </div>
                <p class="text-xs text-center mt-2 text-gray-500 group-hover:text-gray-900">{{icon}}</p>
            </article>
        </template>
    </section>
</template>

<script setup lang="ts">
import * as boldIcons from '@placetopay/iconsax-vue/bold';
import * as outlineIcons from '@placetopay/iconsax-vue/outline';
import * as bulkIcons from '@placetopay/iconsax-vue/bulk';
import * as linearIcons from '@placetopay/iconsax-vue/linear';
import * as twoToneIcons from '@placetopay/iconsax-vue/twotone';
import * as brokenIcons from '@placetopay/iconsax-vue/broken';
import { $activeIcon, $activeStyle, $query, $activeColor } from '@/store';
import { useStore } from '@nanostores/vue';
import { computed } from 'vue';

const query = useStore($query);
const activeColor = useStore($activeColor);
const activeStyle = useStore($activeStyle);

const isFiltered = (icon: string) => icon.toLocaleLowerCase().includes(query.value.toLocaleLowerCase())

const copyIcon = (icon: string) => {
    $activeIcon.set(icon);
    navigator.clipboard.writeText(`${icon}Icon`);
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
                    <component :is="Icons[activeStyle][`${icon}Icon`]" :class="['w-9 h-9 group-hover:scale-150 group-focus-visible:scale-150 duration-100 ease-in-out']" :style="{ color: activeColor }" />
                </div>
                <p class="text-xs text-center mt-2 text-gray-500 group-hover:text-gray-900">{{icon}}</p>
            </article>
        </template>
    </section>
</template>

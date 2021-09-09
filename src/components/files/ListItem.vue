<template>
  <div
    class="group flex flex-grow items-center space-x-4 cursor-pointer select-none"
    @click="open(item.file.path)"
  >
    <div class="flex-shrink-0">
      <img
        :src="getPreviewUrl(item.file)"
        :alt="item.file.name"
        class="object-scale-down w-12 h-full rounded"
      />
    </div>
    <div class="flex flex-col flex-grow">
      <span class="font-medium text-indigo-700 group-hover:underline">{{
        item.file.name
      }}</span>
      <span class="text-xs text-gray-600">{{ item.file.path | filePath }}</span>
    </div>
    <div class="flex-shrink-0">
      <span class="text-sm">{{ item.file.size | fileSize }}</span>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron';
import fileSize from '@/filters/fileSize';

export default {
  name: 'ListItem',
  props: {
    item: {
      required: true,
    },
  },
  filters: { fileSize, filePath: value => value.replace(/\\/g, '/') },
  methods: {
    getPreviewUrl(file) {
      return URL.createObjectURL(file);
    },
    open(path) {
      shell.openPath(path);
    },
  },
};
</script>

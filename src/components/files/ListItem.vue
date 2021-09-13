<template>
  <div
    class="group flex flex-grow items-center space-x-4 cursor-pointer select-none"
    @click="open(item.file.path)"
  >
    <div class="flex overflow-hidden flex-col flex-grow w-0">
      <span
        class="font-medium text-indigo-700 group-hover:underline truncate"
        >{{ item.file.name }}</span
      >
      <span class="text-xs text-gray-600 truncate">{{
        item.file.path | filePath
      }}</span>
    </div>
    <div class="flex-shrink-0">
      <span class="font-mono text-sm">{{ item.file.size | fileSize }}</span>
    </div>
    <div class="flex-shrink-0">
      <badge v-show="item.status === 0" class="bg-indigo-600" rounded>
        <icon-clock class="w-4 h-4" />
      </badge>
      <badge v-show="item.status === 1" class="bg-yellow-600" rounded>
        <icon-spin class="w-4 h-4 animate-spin" />
      </badge>
      <badge v-show="item.status === 2" class="bg-green-600">
        <span class="px-1 text-sm">{{ item.size | fileSize }}</span>
      </badge>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron';
import fileSize from '@/filters/fileSize';
import Badge from '@/components/util/Badge';
import IconClock from '@/components/icons/IconClock';
import IconSpin from '@/components/icons/IconSpin';

export default {
  name: 'ListItem',
  components: { Badge, IconClock, IconSpin },
  props: {
    item: {
      required: true,
    },
  },
  filters: { fileSize, filePath: value => value.replace(/\\/g, '/') },
  methods: {
    open(path) {
      shell.openPath(path);
    },
  },
};
</script>

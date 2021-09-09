<template>
  <div
    class="flex relative flex-1"
    @dragenter.prevent.stop="isActive = true"
    @dragover.prevent.stop="isActive = true"
  >
    <div class="flex flex-1" :style="[isActive ? { filter: 'blur(6px)' } : '']">
      <slot />
    </div>
    <div
      v-show="isActive"
      class="flex absolute inset-0 justify-center items-center bg-blue-200 bg-opacity-75"
      @dragleave.prevent.stop="isActive = false"
      @drop.prevent="onFilesDropped"
      @drop.prevent.stop="isActive = false"
    >
      <label class="flex flex-col justify-center items-center text-blue-900">
        <icon-photograph class="w-24 h-24"></icon-photograph>
        <span class="text-lg">Dateien per Drag and Drop ablegen</span>
      </label>
      <div class="absolute inset-0"></div>
    </div>
  </div>
</template>

<script>
import IconPhotograph from './icons/IconPhotograph';

export default {
  name: 'FileDropzone',
  components: {
    IconPhotograph,
  },
  data: () => ({
    isActive: false,
  }),
  methods: {
    onFilesDropped(event) {
      this.$emit('filesDropped', event.dataTransfer?.files);
    },
  },
};
</script>

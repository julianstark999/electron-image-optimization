<template>
  <span
    class="inline-flex items-center p-0.5 font-mono text-white border border-transparent shadow-sm"
    :class="[this.rounded ? 'rounded-full' : 'rounded-md']"
  >
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    rounded: Boolean,
  },
};
</script>

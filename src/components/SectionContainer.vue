<script setup lang="ts">
const props = defineProps<{
  padding?: string
  align?: 'left' | 'center' | 'right'
}>()
</script>

<template>
  <section
    class="section-container"
    :style="{ padding: props.padding || '40px 0' }"
  >
    <div
      class="section-inner"
      :class="`align-${props.align || 'center'}`"
    >
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section-container {
  width: 100%;
}
.section-inner {
  width: 100%;
  display: flex;
}
.align-center {
  justify-content: center;
}
.align-left {
  justify-content: flex-start;
}
.align-right {
  justify-content: flex-end;
}
</style>

<script setup lang="ts">
import SectionContainer from './SectionContainer.vue'
import GlassCard from './GlassCard.vue'

const props = defineProps<{
  containerPadding?: string
  align?: 'left' | 'center' | 'right'
  maxWidth?: string
  padding?: string
  textAlign?: 'left' | 'center' | 'right'
}>()
</script>

<template>
  <SectionContainer :padding="props.containerPadding" :align="props.align">
    <GlassCard
      :max-width="props.maxWidth"
      :padding="props.padding"
      :text-align="props.textAlign"
    >
      <slot />
    </GlassCard>
  </SectionContainer>
</template>

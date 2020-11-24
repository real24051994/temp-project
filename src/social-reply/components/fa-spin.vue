<template>
  <div>
    <a-spin class="flex items-center">
      <a-icon slot="indicator" type="loading" :style="`font-size: ${size};`" spin />
    </a-spin>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '24px',
      required: false,
    },
  },
}
</script>

<template>
  <div class="list-sources">
    <div class="list-sources-header">
      <div class="w-50">
        Source
      </div>

      <div class="w-25">
        Products
      </div>

      <div class="w-25">
        Import day
      </div>
    </div>

    <div>
      <SourceItem v-for="i in 5" :key="i" />
    </div>
  </div>
</template>

<script>
import SourceItem from './source-item'

export default {
  components: {
    SourceItem
  },

  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.list-sources {
  font-size: 14px;

  .list-sources-header {
    display: flex;
    align-items: center;
    height: 40px;
    background: #efefef;
    border-radius: 4px 4px 0px 0px;
    font-size: 14px;
    font-weight: 500;
    padding: 0 16px;
  }
}
</style>

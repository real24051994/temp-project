<template>
  <div>
    <Info :is_loading="is_loading" />

    <LatestOrders />

    <Note />
  </div>
</template>

<script>
import Info from './customer-info'
import LatestOrders from './latest-orders'
import Note from './customer-note'

export default {
  props: {
    is_loading: {
      type: Boolean,
    },
  },

  components: {
    Info,
    LatestOrders,
    Note,
  },
}
</script>

<template>
  <div class="list-order-item">
    <img v-if="info.image" :src="info.image" alt="" />
    <div v-else class="h-36 w-36 border rounded" style="min-width: 36px;"></div>

    <div class="flex-1 flex flex-col p-l-8">
      <div class="flex items-center w-100">
        <a target="_blank" :href="info.url" class="f-12 list-item-name p-r-8 text-main flex items-center">
          {{ info.name }}
        </a>

        <div class="flex flex-1 content-end">
          <div :class="`order-status ${status}`">
            {{ status }}
          </div>
        </div>
      </div>

      <div class="flex items-center f-12 text-muted">
        <div>
          {{ formatMoney(info.amount) }}
        </div>

        <div class="list-item-time p-l-4">
          {{ dateFormat(info.created_at, 'dd MMM yyyy') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  computed: {
    status() {
      return this.info.status ? this.info.status.toLowerCase() : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.list-order-item {
  height: 36px;
  display: flex;
  margin-top: 16px;

  img {
    border: 1px solid #e2e2e2;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    object-fit: cover;
  }

  .list-item-name {
    color: $text;

    &:hover {
      text-decoration: underline;
    }
  }

  .list-item-time {
    &::before {
      content: '•';
      margin-right: 4px;
      color: #e2e2e2;
    }
  }

  .order-status {
    height: 18px;
    font-weight: 500;
    border-radius: 4px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background-color: #efeded;
    line-height: 1;
    text-transform: capitalize;

    &.pending,
    &.unfulfilled {
      background-color: #fcf3da;
      color: #f2c94c;
    }

    &.placed,
    &.open {
      background-color: #e7f3fe;
      color: $primary-color;
    }

    &.fulfilled {
      background-color: #efeded;
      color: #828282;
    }
  }
}
</style>

<template>
  <div class="condition-item">
    <div class="col-left">
      <span v-if="index === 0">IF</span>
      <span v-else>AND</span>
    </div>

    <div class="col-right d-flex flex-column">
      <SubConditionItem v-for="(item, i) in items" :key="i" :index="i" />

      <a class="add-sub-condition">
        <span>
          <i class="fa fa-plus" />
        </span>

        <div>
          Add Sub-Condition
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import SubConditionItem from './sub-condition-item'
export default {
  components: {
    SubConditionItem
  },

  props: {
    index: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      items: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-item {
  display: flex;
  margin-bottom: 25px;
  min-height: 100px;

  .col-left {
    width: 50px;
    font-size: 16px;
    font-weight: 500;
    position: relative;

    &::before {
      content: '';
      width: 2px;
      background: #cecece;
      height: calc(100% - 24px);
      bottom: 0;
      left: 5px;
      position: absolute;
    }
  }

  .col-right {
    flex-grow: 1;
  }

  .add-sub-condition {
    margin-top: 10px;
    display: flex;
    align-items: center;

    span {
      width: 25px;
    }
  }
}
</style>

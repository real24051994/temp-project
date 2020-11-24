<template>
  <div class="addition-filter">
    <h2 class="title">
      Addition Filter
    </h2>

    <div class="setting-row mt-2">
      <div class="setting-label">
        Condition
      </div>

      <div class="setting-value">
        Applying on products which are in <b>selected collections</b> above

        <div class="mt-4">
          <condition-item v-for="(item, i) in items" :key="i" :index="i" :info="item" />
        </div>

        <div>
          <a v-if="!items || items.length === 0">
            <i class="fa fa-plus mr-2" />
            Add conditions
          </a>

          <a-button>
            Add Condition(s)
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConditionItem from './condition-item'
export default {
  components: {
    ConditionItem
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
.setting-row {
  display: flex;
  flex-direction: row;
  padding: 11px 0;
  font-size: 14px;

  .setting-label {
    width: 120px;
    font-weight: 500;
  }

  .setting-value {
    flex-grow: 1;
    padding-left: 20px;
  }
}

.addition-filter {
  border-top: 1px solid #d8d8d8;
  padding: 24px 0;
}
</style>

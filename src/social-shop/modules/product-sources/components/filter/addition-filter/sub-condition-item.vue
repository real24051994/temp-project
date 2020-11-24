<template>
  <div class="sub-condition">
    <div class="desc">
      <div v-if="index !== 0">OR</div>
    </div>

    <div class="info">
      <div class="w-25 pr-2 column-field">
        <a-select class="w-100" value="1">
          <a-select-option value="1">[P] Quantity</a-select-option>
          <a-select-option value="2">[C] Color</a-select-option>
        </a-select>
      </div>

      <div class="w-75 d-flex">
        <div class="flex-grow-1 pr-2 d-flex select-compare">
          <a-input class="w-100">
            <a-select slot="addonBefore" defaultValue="1" style="width: 220px;">
              <a-select-option value="1">Equals to</a-select-option>
              <a-select-option value="2">Does not qual to</a-select-option>
              <a-select-option value="3">Contains</a-select-option>
              <a-select-option value="4">Does not contain</a-select-option>
              <a-select-option value="5">Starts with</a-select-option>
              <a-select-option value="6">Ends with</a-select-option>
              <a-select-option value="7">Does not Start with</a-select-option>
              <a-select-option value="8">Does not end with</a-select-option>
              <a-select-option value="9">Greater than</a-select-option>
              <a-select-option value="10">Less than</a-select-option>
              <a-select-option value="11">Is empty</a-select-option>
              <a-select-option value="12">Is not empty</a-select-option>
            </a-select>
          </a-input>
        </div>

        <a-button>
          Delete
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.sub-condition .column-field >>> .ant-select-selection-selected-value {
  height: 20px;
  padding: 3px 8px;
  line-height: 1.2;
  background: rgba(216, 216, 216, 0.5);
  border-radius: 4px;
  margin-top: 5px;
  font-weight: 500;
}

.sub-condition .select-compare >>> .ant-input-group-addon {
  background: #f3f3f3;
}
</style>

<style lang="scss" scoped>
.sub-condition {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .desc {
    width: 25px;
    color: #4f4f4f;
  }

  .info {
    display: flex;
    flex-grow: 1;
  }
}
</style>

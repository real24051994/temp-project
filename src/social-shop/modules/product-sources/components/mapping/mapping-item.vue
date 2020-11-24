<template>
  <div class="import-mapping-item row">
    <div class="d-flex col-3">
      <span class="field-icon">
        <i class="fa fa-align-left"></i>
      </span>

      <div class="column-field">
        {{ data.field }}
      </div>
    </div>

    <div class="col-2">
      <span v-tooltip="tooltip" title="Variant limit 1000 characters">
        {{ data.data_type }}
      </span>
    </div>

    <div class="col-3 pr-0 column-source-field">
      <a-select class="w-100" dropdownClassName="aaa">
        <i slot="suffixIcon" class="far fa-file-alt" style="color: #252627; font-size: 14px;" />

        <a-select-option value="">
          None
        </a-select-option>

        <a-select-option value="id">
          ID
        </a-select-option>

        <a-select-option value="desc">
          desc
        </a-select-option>
      </a-select>
    </div>

    <div class="col-3">
      <a-input :value="data.label" />
    </div>
    <div class="col-1"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true
    }
  },

  data() {
    return {
      tooltip: {
        side: 'bottom',
        maxWidth: 220
      }
    }
  }
}
</script>

<style scoped>
.import-mapping-item .column-source-field >>> .ant-select-selection-selected-value {
  height: 20px;
  padding: 3px 8px;
  line-height: 1.2;
  background: rgba(216, 216, 216, 0.5);
  border-radius: 4px;
  margin-top: 5px;
  font-weight: 500;
}
</style>

<style lang="scss" scoped>
.import-mapping-item {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 12px 0;
  border-bottom: 1px solid #d8d8d8;

  .field-icon {
    height: 20px;
    width: 20px;
    background: #d8d8d8;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 16px;
  }

  .column-field {
    font-weight: 500;
  }
}
</style>

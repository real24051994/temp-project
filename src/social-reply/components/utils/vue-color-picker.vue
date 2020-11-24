<template>
  <div class="srp-color-picker">
    <i-dropdown>
      <div class="srp-color-picker-preview" :style="{ background: color }"></div>

      <div slot="list">
        <colorpicker v-model="color"></colorpicker>
      </div>
    </i-dropdown>

    <input v-model="color" class="srp-color-picker-input" type="text" />
  </div>
</template>

<script>
import colorpicker from '@widget/assets/vendor/colorpicker/Index.vue'

export default {
  name: 'VueColorPicker',

  props: {
    value: {
      type: String,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    colorpicker,
  },

  computed: {
    color: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style lang="scss">
.srp-color-picker {
  border: 1px solid #cecece;
  border-radius: 4px;
  display: flex;

  .srp-color-picker-preview {
    content: '';
    width: 18px;
    height: 18px;
    cursor: pointer;
    margin: 4px;
    border-radius: 4px;
  }

  .srp-color-picker-input {
    border-radius: 0 4px 4px 0;
    outline: 0;
    border: none;
    padding: 0 12px;
    color: #828282;
    flex-grow: 1;
    width: 90px;
    border-left: 1px solid #cecece;
  }
}
</style>

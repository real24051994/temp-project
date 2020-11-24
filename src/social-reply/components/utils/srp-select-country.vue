<template>
  <a-select show-search v-model="val" placeholder="Select country" :filter-option="filterOption">
    <a-select-option :value="item.alpha2Code" v-for="item in countries" :key="item.alpha2Code" :title="item.name">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import helper from '@reply/utils/helper'

export default {
  props: {
    value: {
      // type: String,
      default: '',
      required: true,
    },
  },

  computed: {
    val: {
      get() {
        return this.value || ''
      },

      set(val) {
        this.$emit('input', val)
      },
    },

    countries() {
      return helper.getCountries()
    },
  },

  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>

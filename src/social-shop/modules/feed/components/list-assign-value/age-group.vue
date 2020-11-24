<template>
  <div class="box-age-group">
    <a-select
      placeholder="Please select Age Group"
      @change="handleChangeAgeGroup"
      v-model="valueField"
      :class="{ 'form-group--error': $v.valueField.$invalid && form_state }"
    >
      <a-select-option v-for="(item, index) in getAgeGroup" :value="item.type" :key="`index_${index}`">{{ item.name }}</a-select-option>
    </a-select>
    <div v-if="$v.valueField.$invalid && form_state" class="d-flex m-t-10">
      <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
      <span class="custom-error-message">Please choose Age Group</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  props: ['form_state', 'assign_value', 'is_validate'],
  data: function() {
    return {}
  },
  computed: {
    ...mapGetters({
      getAgeGroup: 'feed/getAgeGroup',
    }),
    valueField: {
      get() {
        return this.assign_value
      },
      set(value) {
        this.$emit('update:assign_value', value)
      },
    },
  },
  methods: {
    handleChangeAgeGroup(item) {
      this.$emit('update:assign_value', item)
    },
    updateValidateStatus() {
      if (this.is_validate != this.$v.$invalid) {
        this.$emit('update:is_validate', this.$v.$invalid)
      }
    },
  },
  validations() {
    return {
      valueField: {
        required,
      },
    }
  },
  watch: {
    $v: {
      handler: function() {
        this.updateValidateStatus()
      },
      deep: true,
    },
  },

  mounted() {
    this.updateValidateStatus()
  },
}
</script>

<style lang="scss">
.box-age-group {
  .custom-error-message {
    font-size: 11px;
    color: $danger;
  }

  .form-group--error {
    .ant-select-selection {
      border: 1px solid $danger !important;
    }
  }
}
</style>

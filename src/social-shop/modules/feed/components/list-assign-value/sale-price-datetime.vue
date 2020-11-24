<template>
  <div>
    <a-range-picker :showTime="{ format: 'THH:mm:ss' }" @change="onChangeDate" />
    <div v-if="form_state && $v.valueField.$invalid">
      <div v-if="!$v.valueField.required" class="d-flex m-t-10">
        <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
        <span class="custom-error-message">Please type Date Times</span>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  props: ['assign_value', 'form_state', 'is_validate'],
  computed: {
    valueField: {
      get() {
        return this.assign_value
      },
      set(value) {
        if (value.length > 0) {
          this.$emit('update:assign_value', value[0].format('YYYY-MM-DDTHH:mm') + '/' + value[1].format('YYYY-MM-DDTHH:mm'))
        } else {
          this.$emit('update:assign_value', '')
        }
      },
    },
  },
  methods: {
    onChangeDate(date) {
      this.valueField = date
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

<style lang="scss" scoped>
.custom-error-message {
  font-size: 11px;
  color: $danger;
}

.form-group--error {
  border-color: $danger;
}
</style>

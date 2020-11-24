<template>
  <div>
    <input
      v-model="valueField"
      placeholder="COUNTRY:STATE:SHIPPING_TYPE:PRICE"
      type="text"
      class="ant-input m-t-5"
      :class="{ 'form-group--error': $v.valueField.$invalid && form_state }"
    />
    <div v-if="form_state && $v.valueField.$invalid">
      <div v-if="!$v.valueField.required" class="d-flex m-t-10">
        <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
        <span class="custom-error-message">Shipping Required</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  props: ['assign_value', 'form_state', 'is_validate'],
  data: function() {
    return {}
  },
  computed: {
    ...mapGetters({}),
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

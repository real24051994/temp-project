<template>
  <div>
    <input
      v-model="valueField"
      :placeholder="placeholder"
      type="text"
      class="ant-input m-t-5"
      :class="{ 'form-group--error': $v.valueField.$invalid && form_state }"
    />
    <div v-if="form_state && $v.valueField.$invalid">
      <div v-if="!$v.valueField.maxLength" class="d-flex m-t-10">
        <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
        <span class="custom-error-message">Max 100 characters</span>
      </div>
      <div v-else-if="!$v.valueField.required" class="d-flex m-t-10">
        <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
        <span class="custom-error-message">Please type characters</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  props: ['assign_value', 'form_state', 'is_validate', 'place_holder'],
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

    placeholder() {
      switch (this.place_holder) {
        case 'color':
          return 'Color'
        case 'pattern':
          return `Pattern`
        case 'custom_label_0':
          return `Custom Label 0`
        case 'custom_label_1':
          return `Custom Label 1`
        case 'custom_label_2':
          return `Custom Label 2`
        case 'custom_label_3':
          return `Custom Label 3`
        case 'custom_label_4':
          return `Custom Label 4`
        default:
          return ''
      }
      // return this.place_holder == 'color' ? 'Color' : 'Pattern'
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
        maxLength: maxLength(100),
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

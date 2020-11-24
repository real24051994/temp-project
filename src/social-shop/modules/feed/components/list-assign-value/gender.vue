<template>
  <div class="box-gender">
    <a-select
      placeholder="Please select Gender"
      :class="{ 'form-group--error': $v.valueField.$invalid && form_state }"
      v-model="valueField"
      @change="handleChangeGender"
    >
      <a-select-option v-for="(item, index) in getGender" :value="item.type" :key="`index_${index}`">{{ item.name }}</a-select-option>
    </a-select>
    <div v-if="$v.valueField.$invalid && form_state" class="d-flex m-t-10">
      <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
      <span class="custom-error-message">Please choose Gender</span>
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
      getGender: 'feed/getGender',
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
    handleChangeGender(item) {
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
.box-gender {
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

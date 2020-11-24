<template>
  <div class="shipping-weight">
    <div class="d-flex">
      <a-input
        :class="{ 'form-group--error': $v.valueField.$invalid && form_state }"
        class="custom-input-weight"
        v-model="valueField"
        placeholder="Number Weight"
      />
      <a-select style="width: 80px" @change="handleChangeCurrency" :defaultValue="getCurrencyShippingWeight[0].name" class="custom-input-currency">
        <a-select-option v-for="(item, index) in getCurrencyShippingWeight" :value="item.name" :key="`index_${index}`">{{ item.name }}</a-select-option>
      </a-select>
    </div>
    <div v-if="form_state && $v.valueField.$invalid">
      <div v-if="!$v.valueField.decimal" class="d-flex m-t-10">
        <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
        <span class="custom-error-message">Invalid Format</span>
      </div>
      <div v-else-if="!$v.valueField.required" class="d-flex m-t-10">
        <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
        <span class="custom-error-message">Number required</span>
      </div>
    </div>
  </div>
</template>

<script>
import { required, decimal } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
  props: ['assign_value', 'form_state'],
  data: function() {
    return {
      currency: '',
    }
  },
  computed: {
    ...mapGetters({
      getCurrencyShippingWeight: 'feed/getCurrencyShippingWeight',
    }),
    valueField: {
      get() {
        if (this.assign_value != undefined) {
          return this.assign_value.split(' ')[0]
        } else {
          return ''
        }
      },
      set(value) {
        this.$emit('update:assign_value', value + ' ' + this.currency)
      },
    },
  },
  created() {
    if (this.currency == '') {
      this.currency = this.getCurrencyShippingWeight[0].name
    }
  },
  methods: {
    handleChangeCurrency(item) {
      this.currency = item
      this.$emit('update:assign_value', this.valueField + ' ' + item)
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
        decimal,
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
.shipping-weight {
  .custom-error-message {
    font-size: 11px;
    color: $danger;
  }

  .form-group--error {
    border-color: $danger;
  }
  .custom-input-weight {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .custom-input-currency {
    .ant-select-selection--single {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>

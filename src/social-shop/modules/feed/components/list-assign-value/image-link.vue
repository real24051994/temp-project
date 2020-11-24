<template>
  <div>
    <div v-for="(item, index) in listUrl" :key="`index_${index}`" class="m-t-10">
      <div :class="{ 'd-flex': index >= 1 }">
        <input
          v-model="item.name"
          placeholder="Image Link"
          type="text"
          class="ant-input m-b-10"
          :class="[{ 'form-group--error': errors[index].$invalid && form_state }, { 'custom-input-imagelink': index >= 1 }]"
          @change="onChangeImageLink"
        />
        <Button type="button" class="ant-btn" @click="deleteUrl(item)" v-show="index >= 1">Delete</Button>
      </div>
      <div v-if="form_state && errors[index].$invalid" class="d-flex m-t-10">
        <div v-if="!errors[index].name.required">
          <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
          <span class="custom-error-message">URL is required</span>
        </div>
        <div v-else-if="!errors[index].name.domain">
          <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
          <span class="custom-error-message">Format Invalid</span>
        </div>
      </div>
    </div>
    <a @click="addUrl()" class="m-t-10" href="javascript:void(0)" v-if="listUrl.length < 10">+ Add more Additional Image Link</a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  props: ['assign_value', 'form_state', 'is_validate'],
  data: function() {
    return {
      listUrl: [{ name: '' }],
    }
  },
  computed: {
    ...mapGetters({}),
    errors() {
      return Object.values(this.$v.listUrl.$each.$iter)
    },
  },
  methods: {
    addUrl() {
      this.listUrl.push({ name: '' })
    },
    deleteUrl(item) {
      var index = _.findIndex(this.listUrl, { name: item.name })
      this.listUrl.splice(index, 1)
      this.$emit(
        'update:assign_value',
        this.listUrl.map((item) => item.name)
      )
    },
    onChangeImageLink() {
      this.$emit(
        'update:assign_value',
        this.listUrl.filter((item) => item.name != '').map((item) => item.name)
      )
    },
    updateValidateStatus() {
      if (this.is_validate != this.$v.$invalid) {
        this.$emit('update:is_validate', this.$v.$invalid)
      }
    },
  },
  validations() {
    return {
      listUrl: {
        $each: {
          name: {
            required,
            domain: (value) => {
              return this.$helper.isUrl(value)
            },
          },
        },
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

.custom-input-imagelink {
  margin-right: 15px;
}

.form-group--error {
  border-color: $danger;
}
</style>

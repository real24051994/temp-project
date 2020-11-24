<template>
  <a-input v-model="val">
    <div slot="addonAfter" style="width: 40px;">
      <i-dropdown right class="position-absolute" style="left: 0; top: 0;">
        <div class="ant-dropdown-link flex" style="height: 32px; width: 64px;">
          <a class="h-100 w-100 flex items-center content-end p-r-8">
            <svg-icon2 v-if="flag" :name="flag" size="24px" />
            <a-icon type="down" class="m-l-8" />
          </a>
        </div>

        <div slot="list" class="flex flex-col" style="width: 240px; max-height: 220px; overflow-y: scroll; overflow-x: hidden;">
          <div
            class="list--item"
            v-for="item in countries"
            :key="item.alpha2Code"
            @click="onSelect(item.alpha2Code)"
            :title="`${item.name} (${item.phoneNumberPrefix})`"
          >
            {{ item.name }} (+{{ item.phoneNumberPrefix }})
          </div>
        </div>
      </i-dropdown>
    </div>
  </a-input>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
      required: false,
    },
  },

  data() {
    return {
      phoneSelectedCode: '',
      countries: [],

      flag: '',
    }
  },

  created() {
    this.countries = this.$helper.getCountries()

    if (this.val && this.val.startsWith('+')) {
      this.countries.forEach((item) => {
        const prefix = this.val.replace('+', '')
        if (prefix && prefix.startsWith(item.phoneNumberPrefix)) {
          this.phoneSelectedCode = item.alpha2Code

          this.flag = ''
          setTimeout(() => {
            this.flag = `flags/${this.phoneSelectedCode.toLowerCase()}`
          }, 0)
          return
        }
      })
    }
  },

  computed: {
    val: {
      get() {
        return this.value
      },

      set(val) {
        this.$emit('input', '' + val)
      },
    },

    // flag() {
    //   if (this.phoneSelectedCode) {
    //     return `flags/${this.phoneSelectedCode.toLowerCase()}`
    //   }
    //   return undefined
    // },
  },

  watch: {
    value(val, oldVal) {
      if (!val.startsWith('+')) {
        return
      }

      if (val && oldVal && val.length > 4 && val.substr(0, 3) == oldVal.substr(0, 3)) {
        return
      }

      let found = false
      this.countries.forEach((item) => {
        const prefix = val.replace('+', '')
        if (prefix && prefix.startsWith(item.phoneNumberPrefix)) {
          this.phoneSelectedCode = item.alpha2Code
          found = true

          this.flag = ''
          setTimeout(() => {
            this.flag = `flags/${this.phoneSelectedCode.toLowerCase()}`
          }, 0)
          return
        }
      })

      if (!found) {
        this.phoneSelectedCode = ''
      }
    },
  },

  methods: {
    onSelect(alpha2Code) {
      this.phoneSelectedCode = alpha2Code

      if (this.phoneSelectedCode && this.$helper.getCountryByCode(this.phoneSelectedCode)) {
        this.val = '+' + this.$helper.getCountryByCode(this.phoneSelectedCode).phoneNumberPrefix
      }

      this.flag = ''
      setTimeout(() => {
        this.flag = `flags/${this.phoneSelectedCode.toLowerCase()}`
      }, 0)
    },
  },
}
</script>

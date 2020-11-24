<template>
  <a-select
    showSearch
    :showArrow="false"
    placeholder="Customer name, email,..."
    style="width: 100%;"
    :filter-option="false"
    @search="onSearch"
    @change="handleChange"
    @popupScroll="popupScroll"
  >
    <a-spin v-if="is_loading" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in items" :key="item.id" :value="item.id">
      <div style="height: 68px;">
        <div class="font-medium">{{ item.first_name }} {{ item.last_name }}</div>
        <div class="f-12">{{ item.phone || '-' }}</div>
        <div class="f-12">{{ item.email || '-' }}</div>
      </div>
    </a-select-option>
  </a-select>
</template>

<script>
import api from '@reply/utils/api'

export default {
  data() {
    return {
      is_loading: false,

      keyword: '',

      items: [],

      no_more: false,

      cursor: '',
      rel: '',

      timeout: null,

      cancelToken: null,
    }
  },

  created() {
    this.fetchCustomer()
  },

  methods: {
    onSearch(val) {
      this.keyword = val

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(() => {
        this.items = []
        this.cursor = undefined
        this.rel = undefined
        this.no_more = false
        this.is_loading = false
        this.fetchCustomer()
      }, 500)
    },

    async fetchCustomer() {
      if (this.no_more || this.is_loading) {
        return
      }

      if (this.cancelToken) {
        this.cancelToken.cancel()
      }

      this.cancelToken = this.$api.getCancelToken()
      this.is_loading = true

      try {
        let { data } = await api.SHOPIFY.CUSTOMERS.fetch({
          keyword: this.keyword,
          rel: this.rel,
          cursor: this.cursor,
          cancel_token: this.cancelToken,
        })

        const { rows, next } = data

        this.items = [...this.items, ...rows]
        this.cursor = next
        this.rel = 'next'

        if (this.isEmpty(next)) {
          this.no_more = true
        }
      } catch (error) {
        this.is_loading = false
      } finally {
        this.is_loading = false
        this.cancelToken = null
      }
    },

    handleChange(customer_id) {
      let customer = this.items.find((item) => item.id === customer_id)
      this.$emit('change', customer)
      this.keyword = ''
    },

    popupScroll(evt) {
      const scrollTop = evt.target.scrollTop
      const clientHeight = evt.target.clientHeight
      const scrollHeight = evt.target.scrollHeight

      let distanceFromBottom = Math.abs(scrollHeight - clientHeight - scrollTop)

      if (!this.is_loading && distanceFromBottom < 10) {
        this.fetchCustomer()
      }
    },
  },
}
</script>

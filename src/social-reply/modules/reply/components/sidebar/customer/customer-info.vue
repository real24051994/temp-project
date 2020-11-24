<template>
  <div class="panel-customer-information">
    <div class="flex items-center">
      <social-avatar :src="conversation_info.avatar" />

      <div class="flex-1 p-l-12 font-medium">
        {{ conversation_info.name }}
      </div>

      <a class="f-12" @click="updateContext('edit-customer')">Edit</a>
    </div>

    <template v-if="!is_loading">
      <div class="meta-info-item m-t-8">
        <sh-icon :icon="['far', 'envelope']" class="m-r-8" />
        {{ !isEmpty(customer_info) ? customer_info.email : conversation_info.email }}
      </div>

      <div class="meta-info-item">
        <sh-icon :icon="['far', 'phone']" class="m-r-8" />
        {{ customer_info.phone || '-' }}
      </div>

      <div class="meta-info-item">
        <sh-icon :icon="['far', 'map-marker-alt']" class="m-r-8" />
        Address
      </div>

      <div class="meta-info-address" v-if="address">
        <p class="m-b-3">
          {{ address.company || '' }}
        </p>

        <p class="m-b-3">
          {{ `${address.address1 || ''} ${address.address2 || ''}` }}
        </p>

        <p class="m-b-3">
          {{ `${address.city || ''} ${address.zip || ''}` }}
        </p>

        <p class="m-b-3">
          {{ getCountryName(address.country_code) }}
        </p>
      </div>
    </template>

    <div v-else class="center p-t-30 p-b-20">
      <fa-spin />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import helper from '@reply/utils/helper'

export default {
  props: {
    is_loading: {
      type: Boolean,
    },
  },

  computed: {
    ...mapGetters({
      conversation_info: 'Conversation/getConversationInfo',
      customer_info: 'Customer/getCustomerInfo',
    }),

    address() {
      if (this.customer_info && this.customer_info.default_address) {
        return this.customer_info.default_address
      }
      return undefined
    },
  },

  methods: {
    ...mapActions({
      updateContext: 'Sidebar/updateContext',
    }),

    getCountryName(country_code) {
      let country = helper.getCountryByCode(country_code)
      return country ? country.name : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-customer-information {
  display: flex;
  flex-direction: column;
  padding: 18px 24px 18px 18px;
}

.meta-info-item {
  height: 24px;
  display: flex;
  align-items: center;
  font-size: 12px;

  i {
    margin-right: 10px;
    font-size: 14px;
  }
}

.meta-info-address {
  font-size: 12px;
  line-height: 14px;
  color: #4f4f4f;
}
</style>

<template>
  <a-popover :title="false" placement="bottom" v-if="value">
    <template slot="content">
      <div class="vue-list-social-account-popover" style="max-width: 240px;">
        <!-- <template v-if="value.code && error_codes.indexOf(value.code) >= 0"> -->
        We have lost connection to your <b style="color: #4080ff;">Facebook</b> account

        <!-- <template v-if="onClickReconnect">
          <a-button @click="onClickReconnect" class="ant-btn ant-btn-block m-t-8">
            <span>Reconnect</span>
          </a-button>
        </template> -->

        <router-link :to="{ name: 'ManageAccount' }" class="ant-btn ant-btn-block m-t-8">
          <span>Reconnect</span>
        </router-link>

        <!-- <template v-else>
          {{ value.message }}
        </template> -->
      </div>
    </template>
    <sh-icon :icon="['fas', 'exclamation-circle']" class="text-danger" />
  </a-popover>
</template>

<script>
export default {
  name: 'VueErrorSocialAccountPopover',
  props: {
    value: {
      required: true,
    },
    onClickReconnect: {
      type: Function,
    },
  },
  data() {
    return {
      error_codes: [10, 190, 64, 89, 93, 99, 220, 326],
    }
  },
}
</script>

<style lang="scss" scoped>
.vue-list-social-account-popover {
  font-size: 14px;
  line-height: 1.5;
}
</style>

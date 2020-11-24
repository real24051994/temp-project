<template>
  <router-link tag="div" :to="`/account/${account.social_id}`" class="social-account-item">
    <div class="position-relative">
      <div v-if="account.unread_count && !account.connect_error" v-show="is_collapsed" class="collapsed-counter">
        {{ account.unread_count > 99 ? '99+' : account.unread_count }}
      </div>

      <social-avatar :src="account.avatar" :social_type="account.social_type" :connect_error="is_collapsed ? account.connect_error : null" />
    </div>

    <div class="social-account-title" v-if="!is_collapsed">
      <div class="line-clamp-2" style="word-break: break-word;" :title="account.name">
        {{ account.name }}
      </div>
    </div>

    <div class="social-account-status" v-if="!is_collapsed">
      <div v-if="account.unread_count && !account.connect_error" class="counter">
        {{ account.unread_count > 99 ? '99+' : account.unread_count }}
      </div>

      <vue-error-social-account-popover v-model="account.connect_error" />
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      default: () => {},
    },

    is_collapsed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.social-account-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 54px;
  width: 100%;
  cursor: pointer;
  padding-right: 12px;
  padding-left: 24px;

  .social-account-title {
    font-weight: 500;
    flex-grow: 1;
    font-size: 14px;
    line-height: 17px;
    padding-left: 12px;
  }

  .social-account-status {
    padding-left: 12px;

    .counter {
      height: 16px;
      background-color: #d8ecff;
      border-radius: 2px;
      color: $primary-color;
      font-weight: 500;
      font-size: 10px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .connect-error {
      font-family: 'Font Awesome 5 Pro';
      font-style: normal;
      font-weight: 900;
      font-size: 16px;
      line-height: 16px;
      display: flex;
      align-items: center;
      color: #f5222d;

      &::before {
        content: '\f06a';
      }
    }
  }

  &:hover:not(.router-link-active) {
    background: #f3f3f3;
  }

  &.router-link-active {
    background-color: rgba(24, 143, 255, 0.1);

    &::before {
      content: '';
      position: absolute;
      width: 4px;
      height: 100%;
      left: 0;
      top: 0;
      background: #5b86e5;
    }
  }

  .collapsed-counter {
    height: 16px;
    background-color: #d8ecff;
    border-radius: 2px;
    color: $primary-color;
    font-weight: 500;
    font-size: 10px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -6px;
    right: -5px;
    z-index: 1;
  }
}
</style>

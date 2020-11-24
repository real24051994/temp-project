<template>
  <div class="auth-autoclose-tab">
    <div class="auth-autoclose-tab-content">
      <p>
        Click close button if your popup doesn't close automatically
      </p>
      <a-button @click="onClick" type="primary">
        Close
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueAuthSucess',

  methods: {
    onClick() {
      open(location, '_self').close()
    },
  },
}
</script>

<style lang="scss" scoped>
.auth-autoclose-tab {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  &-content {
    text-align: center;

    h3 {
      font-size: 22px;
    }

    p {
      font-size: 16px;
    }

    .ant-btn {
      height: 40px;
      min-width: 120px;
    }
  }
}
</style>

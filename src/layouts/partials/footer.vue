<template>
  <div class="app-footer-container">
    <p>
      Copyright ©2020
      <a target="_blank" href="https://socialhead.io" class="company"
        >Socialhead</a
      >
      •
      <a target="_blank" href="https://socialhead.io/terms-of-use/"
        >Term of use</a
      >
      •
      <a target="_blank" href="https://socialhead.io/privacy-policy/"
        >Privacy policy</a
      >
    </p>
  </div>
</template>
<script>
export default {
  name: "Footer",
  props: {
    appName: {
      type: String,
      default: "publish",
    },
  },
};
</script>
<style lang="scss" scoped>
.app-footer-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 28px;
  p {
    margin: 0;
    display: inline-block;
    a {
      color: $text;
      &.company {
        font-weight: 600;
        color: $primary-color;
      }
      &:hover {
        color: $primary-color;
      }
    }
  }
}
</style>

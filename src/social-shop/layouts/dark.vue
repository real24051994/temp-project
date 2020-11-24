<template>
  <div class="app-dark-layout">
    <transition name="fade-in" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'auth',
  metaInfo: {
    titleTemplate: '%s - Socialshop',
  },
}
</script>

<style lang="scss">
.app-dark-layout {
  min-height: 100vh;
  width: 100%;
  background-color: $app-auth-bg;
  display: flex;
  justify-content: center;
}
</style>

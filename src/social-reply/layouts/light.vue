<template>
  <div class="app-light-layout">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Light",
  metaInfo: {
    titleTemplate: "%s - Socialreply",
  },
};
</script>

<style lang="scss">
.app-light-layout {
  min-height: 100vh;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
}
</style>

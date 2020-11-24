<template>
  <div class="app-layout-none">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "None",

  metaInfo: {
    titleTemplate: "%s - Socialreply",
  },
};
</script>

<style lang="scss">
.app-layout-none {
  min-height: 100vh;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
}
</style>

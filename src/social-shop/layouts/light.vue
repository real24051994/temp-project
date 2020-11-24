<template>
  <div class="app-light-layout">
    <transition name="fade-in" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Light',
  metaInfo: {
    titleTemplate: '%s - Socialshop',
  },
  mounted(){
		this.$crisp.init({})
	}
}
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

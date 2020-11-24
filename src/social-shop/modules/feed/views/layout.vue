<template>
  <div class="page-feed-center">
    <transition name="fade-in" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'VueLayout',
  data() {
    return {}
  },
}
</script>
<style lang="scss" scope>
	.page-feed-center {
		// padding: 24px 24px 0 24px;
	}
</style>

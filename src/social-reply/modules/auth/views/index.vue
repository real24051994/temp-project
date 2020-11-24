<template>
  <transition name="fade-in" mode="out-in">
    <div v-if="is_loading" key="is-loading" class="app-set-token">
      <fa-spin />
    </div>

    <div v-else key="loading-success">
      <vue-error type="500" />
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'AuthToken',

  metaInfo: {
    title: 'Authorization',
  },

  data() {
    return {
      token: '',
      is_loading: true,
    }
  },

  async created() {
    const token = this.$route.query.token ? this.$route.query.token : ''

    if (token) {
      this.setToken(token)
      try {
        var res = await this.getUser()
        let { status, data } = res
        if (status && data) {
          this.redirect({ name: 'Dashboard' })
        } else {
          this.removeToken()
          this.redirect({ name: 'Login' })
        }
      } catch (err) {
        this.is_loading = false
      }
    }
  },

  methods: {
    ...mapMutations({
      setToken: 'auth/setToken',
      removeToken: 'auth/removeToken',
    }),

    ...mapActions({
      getUser: 'auth/getUser',
    }),
  },
}
</script>

<style lang="scss">
.app-set-token {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;

  .loading-icon {
    display: inline-block;
  }
}
</style>

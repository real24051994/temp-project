<template>
  <div class="panel-social-accounts" :class="{ collapsed: is_collapsed }">
    <div class="panel-header">
      <div class="panel-header-title" v-if="!is_collapsed">
        Social Accounts
      </div>

      <div class="icon-collapse pointer">
        <sh-icon
          v-if="!is_collapsed"
          :icon="['fas', 'angle-left']"
          @click="is_collapsed = !is_collapsed"
        />
        <sh-icon
          v-else
          :icon="['fas', 'angle-right']"
          class="m-l-14"
          @click="is_collapsed = !is_collapsed"
        />
      </div>
    </div>

    <div
      v-if="accounts.length"
      class="vue-list-social-account-body flex-grow-1"
    >
      <transition name="fade-in" mode="out-in">
        <vue-simple key="loaded-success" class="list-accounts">
          <div class="list-items">
            <ListAccountItem
              v-for="item in accounts"
              :key="item.id"
              :account="item"
              :is_collapsed="is_collapsed"
            />
          </div>
        </vue-simple>
      </transition>
    </div>

    <div class="flex-grow-1" v-else>
      <ListAccountEmpty :is_collapsed="is_collapsed" />
    </div>
  </div>
</template>

<script>
import ListAccountEmpty from "./list-account-empty";
import ListAccountItem from "./list-account-item";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    ListAccountEmpty,
    ListAccountItem,
  },

  data() {
    return {
      is_collapsed: false,
    };
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAccounts",
    }),

    accountId() {
      if (this.$route.params && this.$route.params.accountId) {
        return this.$route.params.accountId;
      }
      return false;
    },
  },

  watch: {
    accountId() {
      this.removeCustomerInfo();
    },
  },

  methods: {
    ...mapActions({
      removeCustomerInfo: "Customer/removeInfo",
    }),
  },
};
</script>

<style scoped>
@media (max-width: 1300px) {
  .panel-social-accounts >>> .social-account-title {
    display: none;
  }

  .panel-social-accounts >>> .social-account-status {
    display: none;
  }

  .panel-social-accounts >>> .collapsed-counter {
    display: flex !important;
  }
}
</style>

<style lang="scss" scoped>
.panel-social-accounts {
  width: 250px;
  min-width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eaeaea;

  &.collapsed {
    width: 84px;
    min-width: 84px;
  }
}

@media (max-width: 1300px) {
  .panel-social-accounts {
    width: 84px !important;
    min-width: 84px !important;

    .panel-header-title {
      display: none;
    }

    .icon-collapse {
      display: none;
    }
  }
}

.panel-header {
  display: flex;
  align-items: center;
  height: 54px;
  min-height: 54px;
  padding: 0 16px 0 24px;

  .panel-header-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    flex-grow: 1;
  }

  i {
    font-size: 16px;
    color: #252627;
    cursor: pointer;
  }
}

.vue-list-social-account {
  height: 100%;
  position: relative;

  &-body {
    height: calc(100% - 65px);
    overflow: hidden;

    .list-accounts {
      height: 100%;
      overflow: hidden auto;
    }
  }

  &-footer {
    height: 65px;
    padding: 16px 24px;
  }

  .list-items {
    padding: 0;
    display: block;
  }

  &-popover {
    width: 240px;
    font-size: 16px;
    line-height: 19px;

    strong {
      color: $primary-color;
    }
  }
}
</style>

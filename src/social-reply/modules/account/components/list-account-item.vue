<template>
  <div
    :class="
      account_info.social_id === selectedAccount.social_id
        ? ['list-account-item', 'current-account']
        : ['list-account-item']
    "
  >
    <div class="mx-4 py-3 d-flex align-items-center w-100">
      <div class="list-account-item--name">
        <social-avatar
          :src="account_info.avatar"
          size="36"
          :social_type="account_info.social_type"
        />

        <div class="list-account-item--title">
          {{ account_info.name }}

          <span
            v-if="account_info.social_id === selectedAccount.social_id"
            class="list-account-item-current ml-1"
          >
            Current Account
          </span>
        </div>
      </div>

      <div class="list-account-item--type">
        <template v-if="account_info.connect_error">
          <a-popover
            :title="false"
            placement="bottomLeft"
            class="error-popover"
          >
            <template slot="content">
              <div class="popover-error p-3">
                <span>
                  {{ account_info.connect_error.message }}
                </span>
              </div>
            </template>
            <sh-icon
              :icon="['far', 'exclamation-circle']"
              class="text-danger error-icon"
            />
          </a-popover>
        </template>
        <div>
          {{ social_account_type }}
        </div>
      </div>

      <div class="list-account-item--action">
        <social-popup-auth
          v-if="account_info.connect_error"
          social_type="facebook"
          action="reauth"
          :social_id="account_info.social_id"
          pusher_event_name="re_auth_social"
          @change-loading="changeConnectingStatus"
          @success="$emit('reload')"
        >
          <a-button class="m-r-8" :loading="is_connecting">
            Reconnect
          </a-button>
        </social-popup-auth>
        <a-button
          class="list-account-item-remove"
          type="danger"
          ghost
          @click="onRemoveAccount(account_info.social_id)"
        >
          <sh-icon :icon="['far', 'trash-alt']" />
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    account_info: {
      type: Object,
      default: () => {},
      required: true,
    },
    is_last_child: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      is_connecting: false,
    };
  },

  computed: {
    ...mapGetters({
      selectedAccount: "Account/getSelectedAccount",
    }),
    social_account_type() {
      if (this.account_info.social_type == "facebook") {
        return "Facebook Page";
      } else if (this.account_info.social_type == "twitter") {
        return "Twitter";
      }
      return "";
    },
  },

  methods: {
    ...mapActions({
      removeAccount: "Account/removeAccount",
    }),

    changeConnectingStatus(val) {
      this.is_connecting = val;
    },

    onRemoveAccount(social_id) {
      this.$confirm({
        title: "Delete Account",
        content: `
					<div class="text-content text-center p-t-16">
						<p class="m-b-4">
							Are you sure you want to delete this account. All this account's Scheduled Posts will be deleted.
						</p>
					</div>
				`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        cancelType: "",
        zIndex: 10002,
        onOk: async () => {
          try {
            await this.removeAccount(social_id);

            this.toastSuccess({
              title: "Done !",
              message: "Delete the account successfully.",
            });

            this.$emit("reload");
          } catch (error) {
            this.toastError({
              title: "Error",
              message: "Delete account error !",
            });
          }
        },
        onCancel: () => {},
        checkbox: true,
        checkboxValue: false,
        checkboxClass: "text-left mt-3 mb-1",
        checkboxRequired: true,
        checkboxContent: "Yes, I want to delete account",
        wrapClassName: "vue-modal-confirm-dialog",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.current-account {
  background: #f7faff !important;
}
.popover-error {
  min-width: 241px;
  max-height: 90px;
  max-width: 350px;
  overflow-y: auto;
}
.error- {
  &popover {
    position: absolute;
    margin-left: -20px;
    margin-top: 1px;
  }
  &icon {
    font-weight: 300;
    font-size: 16px;
    line-height: 16px;
  }
}
.list-account-item {
  display: flex;
  align-items: center;
  background: #fff;
  position: relative;
  border-bottom: 1px solid $light-gray2;
  cursor: pointer;

  &:hover {
    background: $light-gray5;
    .list-account-item-remove {
      display: block;
      cursor: pointer;
    }
  }
  &:last-child {
    border-bottom: none !important;
  }
  &-current {
    font-style: italic;
    font-size: 12px;
    color: $orange;
  }
  &-remove {
    border-color: $light-gray2;
    padding: 0 !important;
    width: 32px;
    display: none;
  }

  .list-account-item--name {
    font-weight: 500;
    width: 50%;
    display: flex;
    align-items: center;

    .list-account-item--title {
      padding-left: 16px;
    }
  }

  .list-account-item--type {
    width: 25%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .list-account-item--action {
    width: 25%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

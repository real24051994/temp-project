<template>
  <a-modal v-model="show" :body-style="{ padding: 0 }" :title="false" :footer="false" :destroy-on-close="true" width="450px">
    <div class="flex flex-col">
      <div class="modal--header border-b">
        Overwrite Customer
      </div>

      <div class="modal--body flex-1">
        <div class="text-center">
          Customer's phone number used in another account. Would you like to use this number again?
        </div>

        <div class="m-t-16 flex flex-col">
          <div class="customer-item" v-for="(item, i) in conflict_customers" :key="i" @click="onChoose(item)">
            <div class="flex flex-col flex-1">
              <div class="font-medium">
                {{ `${item.first_name} ${item.last_name}` }}
              </div>

              <div class="f-12">
                {{ item.email }}
              </div>
            </div>

            <div class="f-12">
              {{ item.phone }}
            </div>
          </div>
        </div>
      </div>

      <div class="modal--footer flex content-end items-center border-t">
        <fa-button @click="show = false" class="m-r-8">
          Cancel
        </fa-button>

        <fa-button type="primary" @click="$emit('submit')">
          Yes
        </fa-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },

    conflict_customers: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  computed: {
    show: {
      get() {
        return this.visible
      },

      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },

  methods: {
    onChoose(data) {
      this.$emit('select', data)
      this.show = false
    },
  },
}
</script>

<style lang="scss" scoped>
.modal--header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-weight: 500;
  font-size: 20px;
}

.modal--body {
  padding: 32px 24px;
}

.modal--footer {
  height: 64px;
  padding: 0 16px;
}

.customer-item {
  height: 56px;
  border-radius: 4px;
  background: #f3f3f3;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;

  &:hover {
    background: #ececec;
  }
}
</style>

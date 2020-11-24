<template>
  <a-modal v-model="visible" :title="false" :footer="false" :centered="true" class="modal-choose-pages" :body-style="{ padding: '' }" width="565px">
    <div class="flex flex-col">
      <div class="flex flex-col" style="height: 84px; padding: 20px 24px; border-bottom: 1px solid #f0f0f0;">
        <div class="f-20 font-medium">
          {{ `${settings.visibility == 'exclude_pages' ? 'Exclude' : 'Specific'} pages` }}
        </div>

        <div>
          {{
            `${
              settings.visibility == 'exclude_pages'
                ? 'Choose the page(s) where you want to hide the chat widget'
                : 'Choose the page(s) where you want the chat widget to be displayed'
            }`
          }}
        </div>
      </div>

      <div style="height: 350px; max-height: 350px; padding: 16px; overflow-y: auto;">
        <div class="list-pages">
          <label class="page-item" v-for="item in default_pages" :key="item.page_id" :for="item.page_id">
            <sh-icon :icon="['far', getPageIcon(item.page_id)]" class="page-item-icon" />

            <div class="flex-1 flex items-center">{{ item.name }}</div>
            <div class="center">
              <input type="checkbox" :id="item.page_id" :value="item.page_id" v-model="selected" />
            </div>
          </label>
        </div>

        <div class="list-pages m-t-20 p-t-20" v-if="!isEmpty(custom_pages)" style="border-top: 1px solid #e2e2e2;">
          <label class="page-item" v-for="item in custom_pages" :key="item.page_id" :for="item.page_id">
            <sh-icon :icon="['far', 'browser']" class="page-item-icon" />

            <div class="flex-1 flex items-center">{{ item.name }}</div>
            <div class="center">
              <input type="checkbox" :id="item.page_id" :value="item.page_id" v-model="selected" />
            </div>
          </label>
        </div>
      </div>

      <div class="flex items-center content-end" style="padding: 24px; border-top: 1px solid #f0f0f0;">
        <fa-button class="m-r-8" style="width: 150px;" @click="close()">
          Cancel
        </fa-button>

        <fa-button type="primary" style="width: 150px;" @click="onSave()">
          Save
        </fa-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    pages: {
      type: Array,
      default: () => [],
    },

    settings: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      selected: [],
    }
  },

  computed: {
    visible: {
      get() {
        return this.show
      },

      set(val) {
        this.$emit('update:show', val)
      },
    },

    default_pages() {
      return this.pages.filter((item) => item.page_id.startsWith('template-')) || []
    },

    custom_pages() {
      return this.pages.filter((item) => item.page_id.startsWith('page-')) || []
    },
  },

  watch: {
    visible(visible) {
      if (visible) {
        this.selected = this.clone(this.settings.pages)
      }
    },
  },

  methods: {
    getPageIcon(page_id) {
      switch (page_id) {
        case 'template-index':
          return 'home'
        case 'template-collection':
          return 'pallet'
        case 'template-product':
          return 'box'
        case 'template-cart':
          return 'shopping-cart'
        case 'template-search':
          return 'search'
        default:
          return 'browser'
      }
    },

    getPageName(page_id) {
      const item = this.pages.find((item) => item.page_id == page_id)
      if (item) {
        return item.name
      }
      return ''
    },

    onSave() {
      this.$emit('change', this.selected)
      this.close()
    },

    close() {
      this.visible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.page-item {
  height: 40px;
  background: #fff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  color: #4f4f4f;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  width: calc(50% - 20px);
  margin: 10px;

  .page-item-icon {
    margin-right: 8px;
  }
}

.list-pages {
  display: flex;
  flex-wrap: wrap;
}
</style>

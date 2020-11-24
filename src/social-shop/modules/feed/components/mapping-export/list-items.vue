<template>
  <div ref="list_item">
    <div class="table-row-fbe row m-0 item-intersection" ref="items" :data-index="index" v-for="(item, index) in data" :key="`specific_${index}`">
      <div class="column-title col-md-4 d-flex align-items-center">
        <div class="mapping-img">
          <img src="@shop/assets/images/product-feed/info-mapping-specific.svg" alt="" />
        </div>
        <div class="mapping-name">[F] {{ item.field_name }}</div>
      </div>
      <div class="column-assigned col-md-8 d-flex">
        <div class="item-mapping">
          <vue-mapping-export-fb-contenteditable-specific-fields
            :key="item.id"
            ref="items_mapping"
            :modify.sync="is_modify"
            :tags.sync="is_tags"
            v-model="item.assigned_fields"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ListItems',
  props: {
    value: {},
    modify: {},
    tags: {},
  },
  data() {
    return {
      observer: null,
    }
  },
  computed: {
    is_modify: {
      get() {
        return this.modify
      },
      set(value) {
        this.$emit('update:modify', value)
      },
    },
    is_tags: {
      get() {
        return this.tags
      },
      set(value) {
        this.$emit('update:tags', value)
      },
    },
    data: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },

  mounted() {
    var items = this.$refs.items
    var items_mapping = this.$refs.items_mapping
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            var index = target.getAttribute('data-index')
            if (typeof items_mapping[index] != 'undefined') {
              items_mapping[index].onMount()
            }
          }
        })
      })
      items.forEach((entry) => {
        this.observer.observe(entry)
      })
    } else {
      this.data.forEach((item, index) => {
        if (typeof items_mapping[index] != 'undefined') {
          items_mapping[index].onMount()
        }
      })
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
}
</script>
<style lang="scss" scoped>
.table-row-fbe {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e2e2;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  min-height: 55px;
  &:hover {
    background-color: $base-color1;
  }
  .mapping-img {
    max-width: 20px;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }
  }
  .mapping-name {
    flex-grow: 1;
    padding-left: 16px;
    padding-right: 30px;
    color: #252627;
    line-height: 17px;
    overflow: hidden;
    font-weight: 500;
    margin-top: 4px;
    span {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .column-title {
    width: 28%;
    padding-left: 20px;
    &.custom-column-title {
      width: 26%;
    }
  }
  .column-assigned {
    .item-mapping {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 calc(100% - 32px);
      flex: 0 0 calc(100% - 32px);
      max-width: calc(100% - 32px);
      background: $white;
    }
  }
}
</style>

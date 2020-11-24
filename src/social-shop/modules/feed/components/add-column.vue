<template>
  <div class="add-column d-flex flex-column" v-clickaway="closeDropdown">
    <div class="search-box">
      <a-input v-model="search" placeholder="Search" type="text">
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div>
    <div class="box-name-column" v-if="filteredList.length > 0">
      <template v-for="(item, index) in filteredList">
        <div :key="`index_${index}`" class="item-value-column d-flex" v-if="item.column != 'title'">
          <a-checkbox v-model="item.isShow" @change="onChangeColumn(item.column)" class="m-r-10">{{ item.name }}</a-checkbox>
        </div>
      </template>
    </div>
    <div v-else class="not-found-column text-center">Column not found</div>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  props: ['is_hidden', 'column_feed'],
  name: 'AddColumn',
  data() {
    return {
      visible: false,
      search: '',
      timeout: null,
    }
  },
  computed: {
    ...mapGetters({
      getInfoSteps: 'auth/getInfoSteps',
    }),

    filteredList() {
      return this.column_feed.filter((item) => {
        return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
  },
  methods: {
    ...mapMutations({
      setIndexColumn: 'feed/setIndexColumn',
    }),
    ...mapActions({
      getListProductFeed: 'feed/getListProductFeed',
      updateStatusColumn: 'feed/updateStatusColumn',
    }),

    closeDropdown() {
      this.$emit('update:is_hidden', false)
    },

    onChangeColumn(column) {
      var ss_feed_id = this.$route.params.id
      var show_columns = this.column_feed
    //   this.setIndexColumn(column)
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.updateStatusColumn({ ss_feed_id, show_columns })
          .then((res) => {
            let { status } = res.data
            if (status) {
            }
          })
          .catch((res) => {
            reject()
          })
          .finally(() => {})
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
.add-column {
  position: absolute;
  z-index: 9999;
  width: 280px;
  right: -1px;
  top: 40px;
  transition: all 0.2s ease;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: $white;

  .search-box {
    padding: 3px 16px;
    border-bottom: 1px solid #d8d8d8;
    .ant-input-affix-wrapper {
      .ant-input-prefix {
        color: #252627;
        opacity: 0.3;
      }
      .ant-input {
        border: none;
        &::placeholder {
          color: #252627;
          opacity: 0.3;
        }
        &:not(:first-child) {
          padding-left: 26px;
          padding-top: 0;
          padding-bottom: 0;
        }
      }
      .ant-input-prefix {
        left: 2px;
      }
    }
  }

  .box-name-column {
    min-width: 228px;
    max-height: 300px;
    overflow: auto;

    .item-value-column {
      padding: 7px 10px 7px 16px;
      height: 32px;
      &:hover {
        width: 100%;
        background: #f3f3f3;
      }
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: #f5f5f5;
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 7px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .not-found-column {
    text-align: center;
    padding: 10px 0;
  }
}
</style>

<template>
  <div class="secondary-source">
    <div class="container-search-input">
      <SearchInput v-model="keyword" @submit="onSubmitSearch" />
    </div>

    <div class="container-sources">
      <ListSources />
    </div>
  </div>
</template>

<script>
import ListSources from '../components/secondary-source/list-sources'
import SearchInput from '../components/search-input'

export default {
  components: {
    ListSources,
    SearchInput
  },

  name: 'ProductSourcesSecondarySource',

  metaInfo: {
    title: 'Secondary Source'
  },

  data() {
    return {
      keyword: ''
    }
  },

  methods: {
    onSubmitSearch() {
      alert('You have just submitted a search.')
    }
  }
}
</script>

<style lang="scss" scoped>
.secondary-source {
  padding: 24px;

  .container-search-input {
    max-width: 240px;
  }

  .container-sources {
    margin-top: 20px;
  }
}
</style>

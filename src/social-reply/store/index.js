import store from '@/store'

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if (key === './index.js') return

  let STORE_KEY = key.replace(/(\.\/|\.js)/g, '')

  if (!(STORE_KEY in store._modules.root._children)) {
    store.registerModule(STORE_KEY, files(key).default)
  }
})

export default modules

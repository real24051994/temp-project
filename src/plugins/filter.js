import Vue from 'vue'

Vue.filter('money', function(value) {
  if (value) {
    return '$' + value
  }
  return ''
})

Vue.filter('shop_avatar', (value) => {
  let chars = ''
  if (value) {
    value
      .split(' ')
      .filter(Boolean)
      .forEach(function(item) {
        if (chars.length < 2) {
          chars += item[0].toUpperCase()
        }
      })
  }
  return chars

})

Vue.filter('postPlural', function(value) {
  if (value == 1) {
    return value + ' Post'
  }
  return value + ' Posts'
})

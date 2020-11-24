export default class Userpilot {
  constructor() {
    this.app_id = null
    this.userpilot = null
  }
  init(payload) {
    return new Promise((resolve, reject) => {
      let { app_id = '' } = payload
      this.app_id = app_id
      if (typeof window.userpilot == 'object') {
        this.userpilot = window.userpilot
        resolve()
      } else {
        this.loadScript(() => {
          this.userpilot = window.userpilot
          resolve()
        })
      }
    })
  }
  loadScript(callback) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://js.userpilot.io/${this.app_id}/latest.js`
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
    script.onload = callback
  }
  register(payload) {
    if (this.userpilot) {
      let { id, data } = payload
      // eslint-disable-next-line no-console
      // console.log('userpilot identify')
      this.userpilot.identify(id, data)
    }
  }
  reload() {
    if (this.userpilot) {
      this.userpilot.reload()
      // eslint-disable-next-line no-console
      // console.log('userpilot reload')
    }
  }
  anonymous() {
    if (this.userpilot) {
      this.userpilot.anonymous()
    }
  }
}

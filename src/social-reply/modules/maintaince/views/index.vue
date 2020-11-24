<template>
  <div class="social-publish-maintaince">
    <div class="container">
      <div class="row">
        <div class="col col-6 maintaince-image">
          <img src="@reply/assets/images/maintaince/bg.png" alt="" />
        </div>
        <div class="col col-6">
          <div class="maintaince-logo">
            <img src="@reply/assets/images/maintaince/logo.png" alt="" />
          </div>
          <div>
            <div class="maintaince-title">
              Maintenance Notice
            </div>
            <div class="maintaince-time">
              Time: 10AM - 12PM (GMT +7) March 9, 2020
            </div>
            <div class="maintaince-content">
              <p>
                We are now updating a brand new version of Social Publish to improve overall app performance and enhance some features. In the meantime, you
                can't access the app.
              </p>

              <p>
                Please be patient and come back few hours later. We appreciate your understanding as Social Publish is working hard to improve your app
                experience.
              </p>

              <p>
                All the best and see you soon,
              </p>
              <p>
                <strong>- Social Head Team -</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.social-publish-maintaince {
  padding: 100px 0;
  color: #121212;
  .container {
    max-width: 1230px;
  }
  .maintaince {
    &-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-logo {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      h1 {
        font-weight: 500;
        font-size: 22px;
        margin: 0;
        color: #4080ff;
      }
    }
    &-content {
      p {
        font-size: 14px;
        margin-bottom: 8px;
      }
    }
    &-title {
      font-weight: 500;
      font-size: 34px;
      line-height: 40px;
      margin-bottom: 4px;
    }
    &-time {
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 16px;
    }
    &-block {
      padding: 24px;
      border: 1px solid #cecece;
      box-sizing: border-box;
      border-radius: 4px;
      h3 {
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
      }
      p {
        font-size: 14px;
      }
      a {
        color: $primary-color;
        font-size: 14px;
      }
    }
  }
}
</style>

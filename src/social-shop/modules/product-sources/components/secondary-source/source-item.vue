<template>
  <div class="source-item">
    <div class="w-50 d-flex">
      <div class="source-img">
        <i class="fa fa-file-alt" />
      </div>

      <div class="main-info">
        <div class="item-title">
          Shopa.myshopify.com
        </div>

        <div class="item-description">
          https://docs.google.com/spreadsheets/d/18qdViHZ7SJ8ovHpyIhWFthDG-KW_Pb/d/18qdViHZ7SJ8ovHpyIhWFthDG-KW_Pb
        </div>
      </div>
    </div>

    <div class="w-25">
      20 products
    </div>

    <div class="w-25 d-flex justify-content-between">
      20/12/2019

      <div>
        <a-dropdown :trigger="['click']" placement="bottomRight">
          <a class="btn-action">
            <i class="far fa-ellipsis-h"></i>
          </a>

          <a-menu slot="overlay" overlayStyle="width: 190px;">
            <a-menu-item key="0">
              <a class="pr-5">
                Refresh import data
              </a>
            </a-menu-item>

            <a-menu-divider />

            <a-menu-item key="1">
              <a class="action-delete" style="color: #eb5757;">
                Delete
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.source-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  font-size: 14px;

  .source-img {
    width: 36px;
    min-width: 36px;
    height: 36px;
    border-radius: 4px;
    background-color: rgb(24, 144, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 18px;
      color: $primary-color;
    }
  }

  .main-info {
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-right: 10%;
  }

  .item-title {
    font-size: 14px;
    font-weight: 500;
  }

  .item-description {
    font-size: 12px;
    color: #828282;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-action {
    color: #cecece;
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &:focus {
      color: $text;
      background-color: #e8e8e8;
    }
    &.ant-dropdown-open {
      color: $text;
      background-color: #e8e8e8;
    }
  }

  .dropdown-menu {
    width: 190px !important;
  }

  >>> .action-delete {
    color: #eb5757 !important;
  }
}
</style>

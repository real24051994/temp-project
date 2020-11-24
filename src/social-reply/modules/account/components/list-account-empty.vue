<template>
  <div class="list-account-empty">
    <div>
      <img src="@reply/assets/images/error/no-account.svg" alt />

      <h3>
        You have not connect to any Social Account yet
      </h3>

      <p>Connect to any Social Account to build your branding now</p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.list-account-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  text-align: center;

  h3 {
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #4f4f4f;
    margin-top: 20px;
  }
}
</style>

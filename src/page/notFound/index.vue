<template>
  <div class="page-not-found">
    <h1>Page Not Found</h1>
    <router-link to="/">
      <mo-button>Back To Home</mo-button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'page-notfound',
};
</script>
<style scoped lang="less">
.page-not-found {
  width: 100%;
  height: 100vh;
  height: var(--screenHeight);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: 38px;
    font-weight: bold;
  }

  a {
    margin-top: 36px;
  }
}
</style>

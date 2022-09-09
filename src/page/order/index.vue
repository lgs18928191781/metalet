<template>
  <div class="page-order">
    <mo-card>
      <!-- ready -->
      <template v-if="orderStep === 0">
        <mo-form>
          <mo-form-item :label="$t('order.from')">
            <mo-input disabled />
          </mo-form-item>
          <mo-form-item :label="$t('order.to')">
            <mo-input disabled />
          </mo-form-item>
          <mo-form-item :label="$t('order.sendAmount')">
            <mo-input disabled />
          </mo-form-item>
          <mo-form-item :label="$t('order.sendAddress')">
            <mo-input disabled />
          </mo-form-item>
          <mo-form-item :label="$t('order.fee')">
            <mo-input disabled />
          </mo-form-item>
          <mo-form-item submitItem style="text-align: center">
            <mo-button simple>{{ $t('cancel') }}</mo-button>
            <mo-button>{{ $t('confirm') }}</mo-button>
          </mo-form-item>
        </mo-form>
      </template>
      <!-- success -->
      <template v-else-if="orderStep === 1">
        <h1>success</h1>
        <div class="info">
          <div class="row">
            <label></label>
            <div class="content"></div>
          </div>
          <div class="row">
            <label></label>
            <div class="content"></div>
          </div>
          <div class="row">
            <label></label>
            <div class="content"></div>
          </div>
          <div class="row">
            <label></label>
            <div class="content"></div>
          </div>
        </div>
      </template>
      <!-- fail -->
      <template v-else-if="orderStep === -1"> </template>
    </mo-card>
  </div>
</template>
<script>
export default {
  name: 'page-order',
  data() {
    return {
      orderStep: 0, // 0:ready, 1:success
    };
  },
};
</script>

<style src="./style.less" lang="less" scoped></style>

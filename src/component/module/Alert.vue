<template>
  <mo-dialog v-model="showDialog" class="mo-alert" @onClose="onClose">
    <div class="container" v-bind:="$attrs">
      <div class="header mo-sub-title" v-if="title">{{ title }}</div>
      <div class="content">
        <pre>{{ message }}</pre>
      </div>
      <div class="footer">
        <mo-button @click="handleCancel" v-if="cancelBtn" type="simple">{{ $t('cancel') }}</mo-button>
        <mo-button @click="handleConfirm">{{ $t('confirm') }}</mo-button>
      </div>
    </div>
  </mo-dialog>
</template>
<script>
import Dialog from './Dialog.vue';
import Button from './Button.vue';
import i18n from '@/i18n';

export default {
  name: 'mo-alert',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
  },
  props: {
    type: {
      type: String,
      default: 'black',
    },
    message: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    cancelBtn: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
    onCancel: {
      type: Function,
      default() {
        return () => {};
      },
    },
    onConfirm: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    return {
      showDialog: true,
    };
  },
  methods: {
    $t: i18n,
    handleCancel() {
      this.onCancel();
    },
    handleConfirm() {
      this.onConfirm();
    },
  },
};
</script>
<style lang="less">
.mo-alert {
  .container {
    .content {
      margin-top: 20px;
    }
    .footer {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>

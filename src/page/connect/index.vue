<template>
  <div class="page-connect">
    <mo-card> </mo-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';
import i18n from '@/i18n';

export default {
  name: 'page-connect',
  computed: {
    ...mapGetters({
      account: 'account/currentAccount',
    }),
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style src="./style.less" lang="less" scoped></style>

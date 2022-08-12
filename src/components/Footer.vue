<template>
  <div class="footer">
    <div class="line">
      <div style="display: flex">
        <a-dropdown placement="topCenter">
          <div style="margin-left: 8px">{{ $t('lang.' + $i18n.locale) }}<DownOutlined /></div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="chooseLanguage('en')">
                <span>English</span>
              </a-menu-item>
<!--              <a-menu-item @click="chooseLanguage('ja')">-->
<!--                <span>日本語</span>-->
<!--              </a-menu-item>-->
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="line">
      <a href="https://www.mvc.space/" class="copyright" target="_blank" rel="noopener">
        {{ $t('setting.copyright') }}
      </a>
    </div>
  </div>
</template>

<script>
import DownOutlined from '@ant-design/icons-vue/lib/icons/DownOutlined';

export default {
  name: 'Footer',
  components: { DownOutlined },
  methods: {
    chooseLanguage(lang) {
      localStorage.setItem('lang', lang);
      this.$i18n.locale = lang;
    },
  },
};
</script>

<style scoped lang="scss">
.footer {
  margin-top: 16px;
  height: 60px;

  background-color: #f5f7fa;

  color: #888;

  .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  a {
    //margin: 0 16px;
    color: #888;
    display: flex;
    align-items: center;

    img,
    svg {
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-right: 4px;
      margin-left: 8px;
    }

    .word {
      @media (max-width: 567px) {
        display: none;
      }
    }
  }

  .copyright,
  .term {
    margin: 8px;
  }

  .term {
    @media (max-width: 720px) {
      display: none;
    }
  }
}
</style>

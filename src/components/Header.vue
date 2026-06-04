<template>
  <div class="header">
    <div class="header-main">
      <i class="el-icon-link"></i>
      <h3>{{ AppName }}</h3>
      <el-tag>v{{ AppVersion }}</el-tag>
    </div>
    <el-alert
        v-if="credentialTip"
        :title="credentialTip"
        :type="credentialTipType"
        :closable="false"
        show-icon
        class="credential-tip"
    />
  </div>
</template>

<script>
import {AppName, AppVersion} from '@/config'

export default {
  name: 'Header',
  props: {
    credentialTip: {
      type: String,
      default: '',
    },
    credentialTipType: {
      type: String,
      default: 'info',
    },
  },
  data() {
    return {
      AppName,
      AppVersion,
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px 10px 0;

  .header-main {
    display: flex;
    align-items: center;
  }

  i {
    font-size: 20px;
  }

  h3 {
    margin: 0 10px;
    font-size: 20px;
  }

  .credential-tip {
    margin-top: 10px;
  }
}
</style>
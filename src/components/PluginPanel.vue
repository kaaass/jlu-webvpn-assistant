<template>
  <div class="app-container">
    <el-scrollbar>
      <div class="sub-container">
        <h3 class="sub-title">直接跳转</h3>
        <el-input
            placeholder="输入要跳转的链接"
            v-model="goUrl"
            class="input-with-select"
            @keyup.enter.native="handleJumpUrl()"
        >
          <el-button slot="append" icon="el-icon-arrow-right" @click="handleJumpUrl()"></el-button>
        </el-input>
      </div>
      <div class="blank"></div>
    </el-scrollbar>
  </div>
</template>

<script>
import {encryptVpnUrl} from '@/logic';

export default {
  name: "PluginPanel",
  data() {
    return {
      goUrl: '',
    }
  },

  methods: {
    handleJumpUrl() {
      // 空检查
      if (!this.goUrl) {
        this.$message.error('请输入要跳转的链接！');
        return;
      }
      // 编码
      const encryptedUrl = encryptVpnUrl(this.goUrl);
      if (encryptedUrl) {
        this.goUrl = '';
        window.open(encryptedUrl);
        this.$message.success("正在跳转...");
      } else {
        this.$message.error("未知错误");
      }
    },
  }
}
</script>

<style scoped>
.app-container {
  height: 100%;
  margin: 5px;
}

.el-scrollbar {
  height: 100%;
}

.box .el-scrollbar__wrap {
  overflow: scroll;
  width: 110%;
  height: 120%;
}

.blank {
  height: 100px;
}

.sub-container {
  margin-top: 20px;
}

.sub-title {
  margin-bottom: 15px;
}
</style>

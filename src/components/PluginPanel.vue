<template>
  <div class="app-container">
    <el-scrollbar>
      <!-- 直接跳转 -->
      <div class="sub-container">
        <h3 class="sub-title">直接跳转</h3>
        <el-input
            placeholder="输入要跳转的链接"
            v-model="goUrl"
            class="input-with-select"
            @keyup.enter.native="handleJumpUrl()"
        >
          <template slot="prepend" v-if="">http://</template>
          <el-button slot="append" icon="el-icon-arrow-right" @click="handleJumpUrl()"></el-button>
        </el-input>
      </div>
      <!-- 收藏 -->
      <div class="sub-container">
        <h3 class="sub-title">
          收藏
          <el-button
              class="sub-title-btn"
              :type="bookmark.editMode ? 'danger' : 'primary'"
              :icon="bookmark.editMode ? 'el-icon-close' : 'el-icon-edit'"
              @click="bookmark.editMode = !bookmark.editMode"
              size="small"></el-button>
          <el-button
              class="sub-title-btn"
              type="success"
              icon="el-icon-plus"
              @click="handleAddBookmark()"
              size="small"></el-button>
        </h3>
        <el-table
            :data="bookmark.data"
            style="width: 100%"
            :show-header="false"
        >
          <el-table-column
              prop="name"
              label="名称"
              width="100">
          </el-table-column>
          <el-table-column
              prop="url"
              label="地址">
            <template slot-scope="scope">
              <el-button
                  @click="jumpTo(scope.row.url)"
                  type="text"
                  size="small"
                  style="float: right">
                {{ scope.row.url }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="65"
              v-if="bookmark.editMode">
            <template slot-scope="scope">
              <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleRemoveBookmark(scope.row.name)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 底部提示 -->
      <div class="sub-container" style="margin-bottom: 10px;">
        <el-divider>
          <el-tooltip class="item" effect="dark" content="Star/Fork me on GitHub" placement="top">
            <el-link href="https://github.com/kaaass/jlu-webvpn-assistant">
              <i class="el-icon-umbrella"></i>
            </el-link>
          </el-tooltip>
        </el-divider>
      </div>
      <!-- 占位 -->
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
      bookmark: {
        editMode: false,
        data: [{
          name: '百度',
          url: 'https://www.baidu.com/',
        }, {
          name: '百度',
          url: 'https://www.baidu.com/',
        }, {
          name: '百度',
          url: 'https://www.baidu.com/',
        }, {
          name: '百度',
          url: 'https://www.baidu.com/',
        },]
      },
    }
  },

  mounted() {
    this.loadBookmark();
  },

  methods: {

    /*
     * 事件处理
     */

    handleJumpUrl() {
      // 空检查
      if (!this.goUrl) {
        this.$message.error('请输入要跳转的链接！');
        return;
      }
      // 编码
      this.jumpTo(this.goUrl);
    },

    handleAddBookmark() {
      // TODO 添加收藏
      this.$message.success('添加成功');
    },

    handleRemoveBookmark(name) {
      // TODO 删除收藏
      this.$message.success('删除成功');
    },

    /*
     * 数据
     */

    loadBookmark() {
      // TODO 获取收藏
    },

    /*
     * Utility
     */

    /**
     * VPN 跳转到指定地址
     * @param url
     */
    jumpTo(url) {
      const encryptedUrl = encryptVpnUrl(url);
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
  height: 50px;
}

.sub-container {
  margin-bottom: 30px;
}

.sub-title {
  margin-bottom: 15px;
}

.sub-title-btn {
  float: right;
  padding: 4px 10px;
  margin: 0 3px;
}
</style>

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
        <el-button
            style="margin-top: 20px"
            type="primary"
            size="small"
            v-if="!isVpnHall()"
            @click="handleBookmarkCurrent()">收藏当前页面</el-button>
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
import {addBookmark, decryptVpnUrl, encryptVpnUrl, getBookmark, hasBookmark, removeBookmark} from '@/logic';

export default {
  name: "PluginPanel",
  data() {
    return {
      goUrl: '',
      bookmark: {
        editMode: false,
        data: null,
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
      this.$emit('onOpenAddBookmarkDialog');
    },

    handleBookmarkCurrent() {
      const url = decryptVpnUrl(window.location.href);
      const defName = document.title;
      // 弹窗询问
      this.$prompt('请输入收藏的名称', '提示', {
        confirmButtonText: '添加',
        cancelButtonText: '取消',
        inputValue: defName,
        inputValidator(value) {
          if (!value) {
            return '名称不能为空！';
          }
          if (hasBookmark(value)) {
            return '已存在同名收藏！';
          }
          return true;
        },
      }).then(({ value }) => {
        // 添加书签
        addBookmark(value, url);
        this.loadBookmark();
        this.$message.success('添加成功');
      });
    },

    handleRemoveBookmark(name) {
      this.$confirm(`是否确认删除收藏的地址 “${name}”？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'danger',
      }).then(() => {
        // 删除
        removeBookmark(name);
        this.loadBookmark();
        this.$message.success('删除成功');
      });
    },

    /*
     * 数据
     */

    loadBookmark() {
      this.bookmark.data = getBookmark();
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

    /**
     * 是否在 VPN 主页
     * @returns {boolean}
     */
    isVpnHall() {
      return window.location.href === 'https://webvpn.jlu.edu.cn/';
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

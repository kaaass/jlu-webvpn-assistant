<template>
  <el-dialog title="添加收藏" :visible.sync="visible">
    <el-form :model="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.url" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getBookmark, setBookmark} from "@/logic";

export default {
  name: "AddBookmarkDialog",
  data() {
    return {
      visible: false,
      form: {
        name: '',
        url: '',
      },
    };
  },
  methods: {
    open() {
      this.clear();
      this.visible = true;
    },
    clear() {
      this.form.name = '';
      this.form.url = '';
    },
    handleConfirm() {
      let bookmark = getBookmark();
      const {name, url} = this.form;
      // 检查空
      if (!name || !url) {
        this.$message.error('请填写完整');
        return;
      }
      // 检查重复
      if (bookmark.find(item => item.name === name)) {
        this.$message.error(`已经添加过 “${name}”`);
        return;
      }
      // 关闭对话框
      this.visible = false;
      // 保存收藏
      bookmark.push({name, url});
      setBookmark(bookmark);
      this.$message.success('添加成功');
      this.$emit('onSuccess');
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <div class="body" :class="{ 'body-hide': isHide }">
      <Header/>
      <PluginPanel ref="panel" @onOpenAddBookmarkDialog="handleOpenAddBookmarkDialog"/>
      <div class="btn-toggle" @click="hide">
        <ArrowIcon/>
      </div>
    </div>
    <AddBookmarkDialog ref="addBookmarkDialog" @onSuccess="handleAddBookmark"/>
  </div>
</template>

<script>
import Header from './Header.vue'
import ArrowIcon from "@/icons/ArrowIcon.vue";
import PluginPanel from "@/components/PluginPanel.vue";
import AddBookmarkDialog from "@/components/AddBookmarkDialog.vue";

export default {
  name: 'PluginDrawer',
  components: {AddBookmarkDialog, PluginPanel, ArrowIcon, Header},
  data() {
    return {
      isHide: true,
    }
  },
  methods: {
    hide() {
      this.isHide = !this.isHide;
    },
    handleOpenAddBookmarkDialog() {
      this.$refs.addBookmarkDialog.open();
    },
    handleAddBookmark() {
      this.$refs.panel.loadBookmark();
    }
  },
}
</script>

<style lang="scss" scoped>
.body {
  position: fixed;
  z-index: 1999;
  left: 0;
  top: 0;
  height: 100%;
  width: 420px;
  background-color: rgb(255, 255, 255);
  transition: all 0.5s;
  box-shadow: 2px 3px 3px 0 rgba(0, 0, 0, .1);
}

.btn-toggle {
  transition: all 0.5s;
  border-radius: 0 30px 30px 0;
  width: 30px;
  height: 60px;
  background-color: rgb(0, 120, 212);
  cursor: pointer;
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  z-index: 2999;

  svg {
    height: 20px;
    width: 20px;
    position: absolute;
    right: 5px;
    top: 20px;
    transition: all 0.5s;
  }
}

.body-hide {
  left: -420px;
  box-shadow: 2px 3px 3px 0 rgba(0, 0, 0, .0);

  .btn-toggle {
    svg {
      transform: rotate(180deg);
    }
  }
}
</style>

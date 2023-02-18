<template>
  <div>
    <el-tag
      closable
      @close="closeTag(row, index)"
      v-for="(item, index) in row.attr_vals"
      :key="index"
      >{{ item }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model.trim="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm(row)"
      @blur="handleInputConfirm(row)"
    >
    </el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput(row)"
      >+ New Tag</el-button
    >
  </div>
</template>

<script>
export default {
  props: ["row"],
  data() {
    return {
      inputVisible: false,
      inputValue: "",
    };
  },
  methods: {
    closeTag(row, index) {
      this.$emit("closeTag", row, index);
    },
    handleInputConfirm(row) {
      if (this.inputValue.trim().length === 0) {
        this.inputValue = "";
        this.inputVisible = false;
        return;
      }
      this.inputVisible = false;
      this.$emit("handleInputConfirm", row, this.inputValue.trim());
      this.inputValue = "";
    },

    // /* 切换文本框 */
    showInput() {
      this.inputVisible = true;
      //自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
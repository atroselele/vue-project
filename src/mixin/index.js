/* 页码条 */
export const Pagination = {
  methods: {
    /* 修改page-size发生改变 */
    handleSizeChange(pageSize) {
      this.$emit("sizeChange", pageSize)
    },
    /* 修改current-page发生改变 */
    handleCurrentChange(CurrentPage) {
      this.$emit("currentChange", CurrentPage)
    },
  }
}
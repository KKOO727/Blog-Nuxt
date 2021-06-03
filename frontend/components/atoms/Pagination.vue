<template>
  <paginate
    v-model="pageNumber"
    :page-count="pageCount"
    :click-handler="goPage"
    :page-range="3"
    :margin-pages="2"
    :prev-text="'Prev'"
    :next-text="'Next'"
    :container-class="'brook-pagination'"
    :page-class="'page-item'"
  />
</template>

<script>
export default {
  props:{
    pageCount:{
      type: Number,
      default: 0
    }
  },
  data() {
    return{
      pageNumber: 1,
    }
  },
  methods:{
    goPage() {
      window.scrollTo(0,0);
      this.$emit('goPage', this.pageNumber);
    }
  }
}
</script>

<style scoped>

</style>
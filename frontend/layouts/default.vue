<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  components: {
  },
  created(){
    this.$store.dispatch('users/LOAD_USER');
  }
}
</script>

<style>

</style>

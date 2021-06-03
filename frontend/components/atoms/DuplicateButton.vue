<template>
  <n-link :to="`/blog/blog-update/${blog.slug}?dup=true`" v-if="(userId === blog.user_id || isAdmin) && !blog.linked_id">
    <button class="brook-btn bk-btn-theme btn-rounded space-between" :class="(className) ? className : '' ">
      Duplicate
    </button>
  </n-link>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name:'DuplicateButton',
  props:{
    blog:{
      type: Object,
      default: null
    },
    className:{
      type: String,
      default: ''
    }
  },
  data(){
    return{
      isAdmin: false,
    }
  },
  computed: {
    ...mapGetters({
      userId: 'users/USER_ID',
      userRole: 'users/USER_ROLE',
    })
  },
  watch:{
    userRole(){
      this.setPermission();
    }
  },
  mounted(){
    this.setPermission()
  },
  methods:{
    setPermission() {
      if(this.userRole && ['super admin', 'admin'].indexOf(this.userRole) > -1) this.isAdmin = true;
    },
  }
  
}
</script>

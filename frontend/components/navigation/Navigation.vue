<template>
  <nav class="page_nav">
    <ul class="mainmenu">
      <li class="lavel-1 with--drop slide--megamenu">
        <n-link to="/">
          <span>Home</span>
        </n-link>
      </li>

      <li class="lavel-1 with--drop slide--megamenu">
        <n-link to="/blog/blog-list">
          <span>Blog</span>
        </n-link>
        <ul class="mega__width--fullscreen">
          <div class="container">
            <div class="mega__list">
              <li class="mega--title">
                USER PAGES
                <ul>
                  <li>
                    <nuxt-link to="/blog/create-blog">
                      <span>Create Blog</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/blog/blog-list">
                      <span>Blog List</span>
                    </nuxt-link>
                  </li>
                </ul>
              </li>
              <li class="mega--title" v-if="isAdmin">
                ADMIN PAGES
                <ul>
                  <li>
                    <nuxt-link to="/blog/admin-blog-list">
                      <span>Admin Blog List</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/blog/blog-grid-unpublished">
                      <span>Unpublished Blog List</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/admin/user-management">
                      <span>User management</span>
                    </nuxt-link>
                  </li> 
                </ul>
              </li>
            </div>
          </div>
        </ul>
      </li>
      <li v-if="!authorized" class="custom-sigin with--drop slide--megamenu">
        <nuxt-link to="/login" class="ml-5">
          <span>Login</span>
        </nuxt-link>
        <!-- <nuxt-link to="/signup" class="ml-2">
          <span>Signup</span>
        </nuxt-link> -->
      </li>
      <li v-if="authorized" class="custom-sigin with--drop slide--megamenu">
        <a href="#" class="ml-5" @click="signMeOut">
          <span>Signout - {{ username }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Navigation',
  components: {
  },
  data: () => ({
    isAdmin: false,
  }),
  computed: {
    ...mapGetters({
      authorized: 'users/IS_AUTHORIZED',
      userId: 'users/USER_ID',
      username: 'users/USER_USERNAME',
      userRole: 'users/USER_ROLE',
    })
  },
  watch:{
    userRole(){
      this.setPermission();
    }
  },
  created () {
    this.$store.dispatch('users/LOAD_USER')
    
    this.setPermission();
  },
  methods: {
    signMeOut () {
      this.$store.dispatch('users/SIGN_USER_OUT')
      this.$router.push('/')
    },
    setPermission() {
      if(this.userRole && ['super admin', 'admin'].indexOf(this.userRole) > -1) this.isAdmin = true;
    },
  }

}
</script>

<style lang="scss">
  .mega__list {
    display: flex;
    li {
        flex-basis: 25%;
    }
  }
  .custom-sigin > a span {
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      width: 0;
      height: 1px;
      bottom: 0;
      position: absolute;
      left: auto;
      right: 0;
      z-index: -1;
      transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) 0s;
      background: currentColor;
    }
  }
  .custom-sigin:hover > a span::after {
    width: 100%;
    left: 0;
    right: auto;
  }
</style>

<template>
  <div class="mobile-navigation">
    <nav id="offcanvas-navigation" class="offcanvas-navigation">
      <ul>
        <li class="menu-item-has-children">
          <n-link to="/">
            Home
          </n-link>
        </li>

        <li class="menu-item-has-children">
          <n-link to="/blog/blog-list">
            Blogs
          </n-link>
          <ul class="sub-menu">
            <li class="mega--title menu-item-has-children">
              <n-link to="">
                Usesr Pages
              </n-link>
              <ul class="sub-menu">
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
          </ul>
          <ul class="sub-menu" v-if="isAdmin">
            <li class="mega--title menu-item-has-children">
              <n-link to="">
                Admin Pages
              </n-link>
              <ul class="sub-menu">
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
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MobileNavMenu',
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
  mounted () {
    const offCanvasNav = document.querySelector('#offcanvas-navigation')
    const offCanvasNavSubMenu = offCanvasNav.querySelectorAll('.sub-menu')
    const anchorLinks = offCanvasNav.querySelectorAll('a')

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML('beforebegin', "<span class='menu-expand'><i></i></span>")
    }

    const menuExpand = offCanvasNav.querySelectorAll('.menu-expand')
    const numMenuExpand = menuExpand.length

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener('click', (e) => { sideMenuExpand(e) })
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener('click', () => { closeMobileMenu() })
    }

    const sideMenuExpand = (e) => {
      e.currentTarget.parentElement.classList.toggle('active')
    }
    const closeMobileMenu = () => {
      const offcanvasMobileMenu = document.querySelector('#offcanvas-mobile-menu')
      offcanvasMobileMenu.classList.remove('active')
    }
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
    .offcanvas-navigation {
        ul {
            li {
                &.menu-item-has-children {
                    &.mega--title > {
                        a {
                            font-weight: 500;
                        }
                    }
                    .sub-menu {
                        height: 0;
                        opacity: 0;
                        transition: 0.3s;
                        visibility: hidden;
                    }
                    &.active > {
                        .sub-menu {
                            height: 100%;
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }
                a {
                    color: $white;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 10px 0;
                    display: block;
                    &:hover {
                        color: $theme-color;
                    }
                }
            }
        }

        ul {
            &.sub-menu {
                margin-left: 15px;
                transition: 0.4s;
                li {
                    a {
                        color: $white;
                        font-weight: 400;
                        &:hover {
                            color: $theme-color;
                        }
                    }
                    .sub-menu {
                        li {
                            a {
                                font-size: 13px;
                                padding: 5px 0;
                            }
                        }
                    }
                }
            }
            li {
                &.menu-item-has-children {
                    position: relative;
                    display: block;
                    a {
                        display: inline-block;
                    }

                    &.active > {
                        .menu-expand {
                            background-color: rgba($white, 0.2);
                            i {
                                &:before {
                                    transform: rotate(0);
                                }
                            }
                        }
                    }

                    .menu-expand {
                        top: 5px;
                        right: 0;
                        width: 35px;
                        height: 35px;
                        cursor: pointer;
                        line-height: 35px;
                        position: absolute;
                        text-align: center;
                        background-color: rgba($white, 0.1);
                        &:hover {
                            background-color: rgba($white, 0.2);
                        }

                        i {
                            display: block;
                            border-bottom: 1px solid #ffffff;
                            position: relative;
                            width: 10px;
                            text-align: center;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            &:before {
                                width: 100%;
                                content: "";
                                border-bottom: 1px solid $white;
                                display: block;
                                position: absolute;
                                top: 0;
                                transform: rotate(90deg);
                                transition: 0.4s;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

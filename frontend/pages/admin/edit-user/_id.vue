<template>
  <div class="main-container">
    <HeaderBlack />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <div
      class="brook-contact-form-area ptb--150 ptb-md--80 ptb-sm--60 bg_color--5"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <div class="contact-form">
              <b-form @submit="onSubmit" @reset="onReset">
                <div class="row">
                  <div class="col-lg-12">
                    <b-form-group
                      label-cols="4"
                      label-cols-lg="2"
                      label-size="lg"
                      label="User Name"
                      label-for="input-username"
                    >
                      <b-form-input
                        id="input-username"
                        size="lg"
                        disabled
                        :value="user.username"
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-lg-12 mt--30">
                    <b-form-group
                      label-cols="4"
                      label-cols-lg="2"
                      label-size="lg"
                      label="Email"
                      label-for="input-email"
                    >
                      <b-form-input
                        id="input-email"
                        size="lg"
                        disabled
                        :value="user.email"
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-lg-12 mt--30">
                    <b-form-group
                      label-cols="4"
                      label-cols-lg="2"
                      label-size="lg"
                      label="Created"
                      label-for="input-created"
                    >
                      <b-form-input
                        id="input-created"
                        size="lg"
                        disabled
                        :value="showDate(user.created_on, 'ISO')"
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-lg-12 mt--30">
                    <b-form-group
                      label-cols="4"
                      label-cols-lg="2"
                      label-size="lg"
                      label="Last Login"
                      label-for="input-last"
                    >
                      <b-form-input
                        id="input-last"
                        size="lg"
                        disabled
                        :value="showDate(user.last_login, 'dynamicDateTime')"
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-lg-12 mt--30">
                    <b-form-group
                      label-cols="4"
                      label-cols-lg="2"
                      label-size="lg"
                      label="Email Verification"
                      label-for="input-email-verify"
                    >
                      <b-form-input
                        id="input-email-verify"
                        size="lg"
                        disabled
                        :value="String(user.email_verification)"
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-12 mt--30">
                    <b-form-group 
                      label-cols="4"
                      label-cols-lg="2" label="User Role:" label-for="user-role">
                      <b-form-select
                        id="user-role"
                        v-model="role"
                        :options="roleOptions"
                        required
                        size="lg"
                      ></b-form-select>
                    </b-form-group>
                  </div>

                  <div class="col-12 mt--30">
                    <b-form-group 
                      label-cols="4"
                      label-cols-lg="2" label="Verified:" label-for="user-verify">
                      <b-form-select
                        id="user-verify"
                        v-model="verify"
                        :options="verifyOptions"
                        required
                        size="lg"
                      ></b-form-select>
                    </b-form-group>
                  </div>

                  <div class="col-lg-12 mt--30">
                    <input type="submit" value="Update User" />
                  </div>
                </div>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterTwo />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { show } from "../../../plugins/dateUtils";
import { BForm, BFormGroup, BFormSelect, BFormInput } from "bootstrap-vue";

export default {
  middleware: "auth",
  async asyncData({ params, store }) {
    const id = params.id;
    const user = await store.dispatch("users/FETCH_USER_BY_ID", { id });
    const roles = await store.dispatch("users/FETCH_USER_ROLES");
    return { id, user, roles };
  },
  components: {
    HeaderBlack: () => import("@/components/home/HeaderBlack"),
    OffCanvasMobileMenu: () =>
      import("@/components/navigation/OffCanvasMobileMenu"),
    SearchPopup: () => import("@/components/home/SearchPopup"),
    BlogSidebar: () => import("@/components/blogs/BlogSidebar"),
    FooterTwo: () => import("@/components/home/FooterTwo"),
    BForm,
    BFormGroup,
    BFormSelect,
    BFormInput,
  },

  data() {
    return {
      isAdmin: false,
      role: 0,
      roleOptions: [],
      verify: false,
      verifyOptions: [],
    };
  },
  computed: {
    ...mapGetters({
      userRole: "users/USER_ROLE",
    }),
  },

  watch: {
    userRole() {
      this.setPermission();
    },
  },
  created() {},

  mounted() {
    document.body.classList.add("template-color-1", "template-font-1");
    this.setPermission();
    if (!this.isAdmin) this.$router.push("/");

    this.role = this.user.role_id - 1;
    this.roleOptions = this.roles.map((item, inx) => {
      return { value: inx, text: item.role_name };
    });
    this.verify = this.user.verified;
    this.verifyOptions = [false, true];
  },

  methods: {
    setPermission() {
      if (this.userRole && ["super admin", "admin"].indexOf(this.userRole) > -1)
        this.isAdmin = true;
    },
    async onSubmit(evt) {
      evt.preventDefault();
      const body = {
        id: this.id,
        role: this.role,
        verify: this.verify
      }
      
      const res = await this.$store.dispatch('users/UPDATE_USER', body)
      
      if(res.success){
        this.$router.push('/admin/user-management')
      }
    },
    onReset(evt) {
      evt.preventDefault();
    },
    showDate(date, type) {
      return show(date, type);
    },
  },

  head() {
    return {
      title: "User management",
    };
  },
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
.blog-detail iframe {
  height: 409.375px;
  width: 100%;
}
.blockquote_vp {
  margin: 20px 0 0 !important;
  font-size: 16px;
  padding: 30px !important;
  color: #051323;
  border: none;
  background: #f0f0f0;
  font-style: italic;
  box-sizing: border-box;
}
</style>
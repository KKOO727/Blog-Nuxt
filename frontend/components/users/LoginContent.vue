<template>
  <div class="contact-modern pb--120 pb_md--80 pb_sm--80">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-12 pr--50 ptb-md--80 ptb-sm--80">
          <div class="contact-modern bg_color--18 space_dec--100 pt--120 pb--120 pl--60 pr--60">
            <div class="inner">
              <h2 class="heading heading-h2 text-white">
                Start a new project?
              </h2>

              <div class="classic-address text-left mt--60">
                <h4 class="heading heading-h4 text-white">
                  Visit our studio at
                </h4>
                <div class="desc mt--15">
                  <p class="bk_pra line-height-2-22 text-white">
                    2005 Stokes Isle Apt. 896, <br> Vacaville 10010, USA
                  </p>
                </div>
              </div>

              <div class="classic-address text-left mt--60">
                <h4 class="heading heading-h4 text-white">
                  Message us
                </h4>
                <div class="desc mt--15 mb--30">
                  <p class="bk_pra line-height-2-22 text-white">
                    info@yourdomain.com <br> (+68) 120034509
                  </p>
                </div>
                <div class="social-share social--transparent text-white">
                  <a href="https://www.facebook.com/" target="_blank">
                    <i class="fab fa-facebook" />
                  </a>
                  <a href="https://twitter.com/" target="_blank">
                    <i class="fab fa-twitter" />
                  </a>
                  <a href="https://www.instagram.com/" target="_blank">
                    <i class="fab fa-instagram" />
                  </a>
                  <a href="https://dribbble.com/" target="_blank">
                    <i class="fab fa-dribbble" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-12 pl--50">
          <div class="contact-form">
            <form id="contact-form" class="mt-5" @submit.prevent>
              <h2 class="login-title text-center">
                LOG IN
              </h2>
              <div class="row">
                <div class="col-lg-12 mt--30">
                  <input v-model="email" name="con_email" type="text" placeholder="Email *">
                </div>
                <div class="col-lg-12 mt--30">
                  <input v-model="password" name="con_password" type="password" placeholder="Password *">
                </div>

                <div class="col-12 mt--30 pr--0 row">
                  <div class="check-box col-6">
                    <input id="check" type="checkbox" name="check" checked>
                    <label for="check">Remember me.</label>
                  </div>
                  <a class="text-muted col-6 pr--0" href="#" style="text-align:right;">Forgot password?</a>
                </div>

                <div class="col-lg-12 mt--30">
                  <input type="submit" value="Login" @click="login">
                  <p class="form-messege" />
                </div>

                <div class="col-lg-12 mt--30">
                  Don't have an account   <nuxt-link to="/signup">
                    Sign up
                  </nuxt-link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data: () => ({
    email: null,
    password: null,
    error: null,
    token: null,
    signingIn: false
  }),
  methods: {
    async login () {
      this.signingIn = true

      try {
        await this.$store.dispatch('users/SIGN_USER_IN', {
          email: this.email,
          password: this.password
        })

        await this.$router.push('/')
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.error = error.response.data.errors[0].messageKey
        } else {
          this.error = 'sign-in.auth-error'
        }
        this.signingIn = false
        
        this.$bvModal.msgBoxOk(`Happened a error during login. The error key is "${this.error}". Please contact with admin.`, {
          title: 'Confirmation',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
      }
    }
  }
}
</script>

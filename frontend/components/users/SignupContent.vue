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
                REGISTER
              </h2>
              <div class="row">
                <div class="col-lg-12">
                  <input v-model="username" name="con_name" type="text" placeholder="Name *">
                </div>

                <div class="col-lg-12 mt--30">
                  <input v-model="email" name="con_email" type="text" placeholder="Email *">
                </div>

                <div class="col-lg-12 mt--30">
                  <input v-model="password" name="con_password" type="password" placeholder="Password *">
                </div>

                <div class="col-12 mt--30 pr--0">
                  <div class="check-box col-6">
                    <input id="check" v-model="terms" type="checkbox" name="check">
                    <label for="check">I agree terms & conditions</label>
                  </div>
                </div>

                <div class="col-lg-12 mt--30">
                  <input type="submit" value="Sign Up" @click="submitForm">
                  <p class="form-messege">
                    {{ responceMessage }}
                  </p>
                </div>

                <div class="col-lg-12 mt--30">
                  have an account?  <nuxt-link to="/login">
                    Login
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
  name: 'SiignUp',
  data: () => ({
    email: null,
    password: null,
    username: null,
    terms: false,
    responceMessage: ''
  }),
  methods: {
    async submitForm () {
      this.error = ''
      try {
        this.sending = true
        this.wholeDisable = true
        const response = await this.$store.dispatch('users/CREATE_USER', {
          email: this.email,
          password: this.password,
          username: this.username
        })
        this.responceMessage = response.data.success
      } catch (error) {
        this.$log.error(error)
        if (error.response) {
          this.$refs.form.setErrors(error.response.data)
        } else {
          this.error = 'sign-up.something-went-wrong'
        }
      }
      return this.success
    }

  }
}

</script>

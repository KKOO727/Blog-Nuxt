<template>
  <div class="bk-brand-area bg_color--1 ptb--60">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="brand-wrapper">
            <div class="brand__list brand-default brand-style--1">
              <swiper :options="swiperOption">
                <div v-for="brand in data" :key="brand.id" class="brand swiper-slide">
                  <n-link to="/">
                    <img :src="brand.logo" alt="logo image">
                  </n-link>
                </div>
              </swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../data/brandLogo.json'
export default {
  data () {
    return {
      data,
      swiperOption: {
        loop: true,
        speed: 1000,
        autoplay: {
          delay: 3000
        },
        // Responsive breakpoints
        breakpoints: {
          1200: {
            slidesPerView: 5
          },

          768: {
            slidesPerView: 3

          },

          480: {
            slidesPerView: 2
          }
        }
      }
    }
  }
}
</script>

<template>
  <div class="bk-testimonial-area section-ptb-xl pt-0 bg_color--5 poss_relative pt_sm--0">
    <div class="container section-pt-xl">
      <div class="row">
        <div class="col-lg-12">
          <div class="section-title text-center wow move-up">
            <h3 class="theme-color">
              {{ data.sectionSubTitle }}
            </h3>
            <h2>{{ data.sectionTitle }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="testimonial-wrapper testimonial--horizontal testimonial--horizontal--active pagination-style-01 mt--80 wow move-up">
      <div class="testimonial-container">
        <swiper :options="swiperOption">
          <div v-for="testimonial in data.testimonials" :key="testimonial.id" class="swiper-slide">
            <TestimonialItem :testimonial="testimonial" />
          </div>
        </swiper>
        <!-- Add Pagination -->
        <div class="swiper-pagination swiper-pagination-custom" />
      </div>
    </div>
  </div>
</template>

<script>
import data from '../../data/testimonial.json'

export default {
  components: {
    TestimonialItem: () => import('../TestimonialItem')
  },

  data () {
    return {
      data,
      swiperOption: {
        spaceBetween: 20,
        autoplay: false,
        loop: true,
        loopedSlides: 9,
        autoplayDisableOnInteraction: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'custom',
          renderCustom (e, t, i) {
            let a = (100 / i) * t
            return a = a.toFixed(6), '<div class="progressbar"><div class="filled" data-width="' + a + '" style="width: ' + a + '%' + '"></div></div>'
          }
        },
        breakpoints: {
          1499: {
            slidesPerView: 5
          },

          992: {
            slidesPerView: 3
          },

          576: {
            slidesPerView: 2
          },

          300: {
            slidesPerView: 1
          }
        }
      }
    }
  }
}
</script>

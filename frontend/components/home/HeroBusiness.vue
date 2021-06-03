<template>
  <div class="slider-area hero-business position-relative">
    <div class="number-dot">
      <swiper :options="swiperOption">
        <div class="hero-item bg-image swiper-slide" :style="{ backgroundImage: `url('/img/slider/business-slide-01.jpg')` }">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="hero-content-2">
                  <h3>This is Brook <span>A full-service <br> creative agency.</span></h3>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-bottom-content">
            <a href="javascript:void(0)" class="scroll-more">
              <h6>Scroll for more</h6>
              <img src="/img/slider/mouse-icon.png" alt="icon">
            </a>
            <div class="video-btn">
              Watch video
              <a class="play__btn" href="https://www.youtube.com/watch?v=9No-FiEInLA" target="_blank">
                <div class="video-icon third-icon secondary-color" />
              </a>
            </div>
          </div>
        </div>

        <div class="hero-item bg-image swiper-slide" :style="{ backgroundImage: `url('/img/slider/business-slide-02.jpg')` }">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="hero-content-2">
                  <h3>This is Brook <span>A full-service <br> creative agency.</span></h3>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-bottom-content">
            <a href="#service" class="scroll-more">
              <h6>Scroll for more</h6>
              <img src="/img/slider/mouse-icon.png" alt="icon">
            </a>
            <div class="video-btn">
              Watch video
              <a class="play__btn" href="https://www.youtube.com/watch?v=9No-FiEInLA" target="_blank">
                <div class="video-icon third-icon secondary-color" />
              </a>
            </div>
          </div>
        </div>

        <div class="hero-item bg-image swiper-slide" :style="{ backgroundImage: `url('/img/slider/business-slide-03.jpg')` }">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="hero-content-2">
                  <h3>This is Brook <span>A full-service <br> creative agency.</span></h3>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-bottom-content">
            <a href="#service" class="scroll-more">
              <h6>Scroll for more</h6>
              <img src="/img/slider/mouse-icon.png" alt="icon">
            </a>
            <div class="video-btn">
              Watch video
              <a class="play__btn" href="https://www.youtube.com/watch?v=9No-FiEInLA" target="_blank">
                <div class="video-icon third-icon secondary-color" />
              </a>
            </div>
          </div>
        </div>
      </swiper>

      <!-- Add Pagination -->
      <div class="swiper-pagination-2" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      swiperOption: {
        spaceBetween: 20,
        loop: true,
        speed: 1000,
        pagination: {
          el: '.swiper-pagination-2',
          clickable: true,
          renderBullet (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .hero-business {
        .hero-content-2 {
            h3 {
                font-size: 70px;
                line-height: 1.2;
                // res
                @media #{$md-layout}{
                    font-size: 50px;
                }
                @media #{$sm-layout}{
                    font-size: 36px;
                }

                span {
                    display: inline-flex;
                    position: relative;
                    padding-left: 90px;
                    margin-left: 45px;
                    // res
                    @media #{$md-layout, $sm-layout}{
                        margin-left: 0;
                    }
                    @media #{$small-mobile}{
                        padding-left: 0;
                    }
                    &:before {
                        width: 70px;
                        height: 5px;
                        left: 0;
                        top: 45px;
                        content: "";
                        position: absolute;
                        background-color: rgb(255, 94, 225);
                        // res
                        @media #{$sm-layout}{
                            top: 20px;
                        }
                        @media #{$small-mobile}{
                            display: none;
                        }
                    }
                }
            }
        }
        .hero-bottom-content {
            bottom: 80px;
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            padding: 0 15px;

            // res
            @media screen and (min-width: 1200px) {
                padding: 0 150px;
            }
            @media #{$md-layout, $sm-layout}{
                bottom: 30px;
            }

            .scroll-more {
                display: flex;
                align-items: center;
                border: none;
                text-align: left;
                h6 {
                    color: $white;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 0;
                    padding-right: 15px;
                    font-family: $body-font;
                }
                // res
                @media #{$small-mobile}{
                    display: none;
                }
            }
            .video-btn {
                display: flex;
                align-items: center;
                color: $white;
                font-weight: 700;
                a {
                    padding-left: 30px;
                    .video-icon {
                        @media #{$sm-layout}{
                            width: 70px;
                            height: 70px;
                        }
                    }
                }
            }
        }
        .swiper-pagination-bullets {
            text-align: center;
            bottom: 122px;
            width: auto;
            // res
            @media #{$md-layout}{
                bottom: 72px;
            }
            @media #{$sm-layout}{
                bottom: 52px;
            }
            @media #{$large-mobile}{
                display: none;
            }
        }
    }
</style>

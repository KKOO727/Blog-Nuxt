<template>
  <div class="bk-number-speaks section-ptb-xl bg_image--3" :style="{ backgroundImage: `url('/img/bg/bg-image-3.jpg')` }">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-xl-6 col-md-12 col-sm-12 col-12">
          <div class="number-speaks">
            <div class="content wow move-up">
              <h3 class="theme-color">
                {{ data.sectionSubTitle }}
              </h3>
              <h2 v-html="data.SectionTitle">
                {{ data.SectionTitle }}
              </h2>
              <n-link to="/about-us-01" class="bk-btn theme-btn">
                Learn More
              </n-link>
            </div>
          </div>
        </div>

        <div class="col-lg-6 col-xl-6 col-md-12 col-sm-12 col-12 mt_md--40 mt_sm--40">
          <div class="speakers-number-wrap mtn--70">
            <div v-for="counter in data.counters.slice(0, 2)" :key="counter.id" class="number-wrap wow move-up mt--70">
              <span class="count theme-color">{{ counter.count }}</span>
              <div class="content">
                <h6>{{ counter.heading }}</h6>
                <p>{{ counter.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../../data/counterup.json'

export default {
  data () {
    return {
      data
    }
  }
}
</script>

<style lang="scss">
    .mtn--70 {
        margin-top: -70px;
    }
</style>

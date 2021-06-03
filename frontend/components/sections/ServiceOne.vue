<template>
  <div class="bk-service-area section-ptb-xl bg_image--2 test-bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="section-title text-center wow move-up">
            <h3>WHAT WE DO</h3>
            <h2>We design & build brands, campaigns & digital projects for businesses large & small.</h2>
          </div>
        </div>
      </div>
      <div class="row mt--70 mt_sm--20 mt_md--30">
        <div v-for="service in data.services.slice(0, 3)" :key="service.id" class="col-lg-4 col-md-6 wow move-up">
          <ServiceItemOne :service="service" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../../data/service.json'

import ServiceItemOne from '../ServiceItemOne'

export default {
  components: {
    ServiceItemOne
  },

  data () {
    return {
      data
    }
  }
}
</script>

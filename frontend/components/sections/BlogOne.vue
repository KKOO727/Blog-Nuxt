<template>
  <div class="bk-blog-area">
    <div class="black-bg-wrapper bg_image--4 section-pt-xl pb--320" :style="{ backgroundImage: `url('/img/bg/bg-image-4.jpg')` }">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="section-title text-center white-text wow move-up">
              <h3 class="text-white">
                {{ data.sectionSubTitle }}
              </h3>
              <h2>{{ data.sectionTitle }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="blog-wrapper pl--230 pr--230 pr_lp--100 pl_lp--100 pl_lg--100 pr_lg--100 pl_md--50 pr_md--50 pl_sm--30 pr_sm--30 section-pb-xl">
      <div class="row row--0 space_dec--250">
        <div v-for="blog in data.blogs.slice(0, 3)" :key="blog.id" class="col-xl-4 col-md-6 wow move-up mt_sm--40">
          <BlogPost :blog="blog" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../../data/blog.json'

import BlogPost from '@/components/blogs/BlogPost'

export default {
  components: {
    BlogPost
  },
  data () {
    return {
      data
    }
  }
}
</script>

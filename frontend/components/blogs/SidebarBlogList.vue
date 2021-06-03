<template>
  <div class="instagram-grid-wrap" :class="addClass">
    <div v-for="blog in blogs" :key="blog.blog_id" class="item-grid grid-style--1">
      <div class="thumb">
        <n-link :to="`/blog/${blog.slug}`">
          <img :src="imageLink" alt="instagram images">
        </n-link>
        <div class="item-info">
          <div class="inner">
            <n-link :to="`/blog/${blog.slug}`">
              <i class="fas fa-heart" />{{ blog.like }}
            </n-link>
            <n-link :to="`/blog/${blog.slug}`">
              <i class="fas fa-comment-dots" />{{ blog.comment }}
            </n-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['addClass', 'allBlogs'],

  data () {
    return {
      blogs:[],
      countPerPage: 6,
      imageLink: "/img/instagram/instagram-md-1.jpg"
    }
  },
  created(){
    this.blogs = (this.allBlogs.length >= this.countPerPage) ? this.allBlogs.slice(0, this.countPerPage): this.allBlogs;
  },

}
</script>

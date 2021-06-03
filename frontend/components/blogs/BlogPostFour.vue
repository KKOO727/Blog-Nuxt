<template>
  <div class="blog-grid" :class="addClass">
    <div class="post-thumb">
      <n-link :to="`/blog/${blog.slug}`">
        <img :src="image" :alt="blog.caption">
      </n-link>
    </div>
    <div class="post-content">
      <div class="post-inner">
        <h4 class="heading heading-h4">
          <n-link :to="`/blog/${blog.slug}`">
            {{ blog.caption }}
          </n-link>
        </h4>
        <div class="post-meta">
          <div class="post-date"><Date :date="`${(blog.update_on) ? blog.update_on : blog.created_on}`" format="ISO"/></div>
          <div class="post-category">
            <n-link :to="`/blog/${blog.slug}`">
                {{ (blog.category) ? blog.category: blog.tag  }}
              </n-link>
          </div>
          
          <DuplicateButton :blog="blog"/>
        </div>
        <div class="desc mt--20">
          <p class="bk_pra">{{ blog.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["blog", "addClass"],
  components:{
    Date: () => import('@/components/atoms/Date'),
    DuplicateButton:() => import('@/components/atoms/DuplicateButton')
  },
  data() {
    return {
      image: '/img/blog/grid/creative-1.jpg',
    }
  },
};
</script>
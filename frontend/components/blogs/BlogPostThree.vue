<template>
  <div class="blog-grid blog-standard" :class="addClass">
    <div class="post-thumb">
      <n-link :to="`/blog/${blog.slug}`">
        <img src="/img/blog/blog-1/blog-01.jpg" :alt="blog.alt">
      </n-link>
    </div>
    <div class="post-content text-center">
      <div class="post-inner">
        <div class="post-meta mb--10">
          <div class="post-date">
            <Date :date="blog.created_on" format="ISO"/>
          </div>
          <div class="post-category">
            <n-link :to="`/blog/category-tag/${blog.category}?type=category`">
              {{ blog.category }}
            </n-link>
          </div>
          <DuplicateButton :blog="blog"/>
        </div>
        <h5 class="heading heading-h5">
          <n-link :to="`/blog/${blog.slug}`">
            {{ blog.caption }}
          </n-link>
        </h5>
        <n-link v-show="readMoreButton" class="post-read-more" :to="`/blog/${blog.slug}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components:{
    Date: () => import('@/components/atoms/Date'),
    DuplicateButton:() => import('@/components/atoms/DuplicateButton')
  },
  props: ['blog', 'addClass', 'readMoreButton'],
  watch:{
    blog(){
      this.blog.image="/img/blog/blog-1/blog-01.jpg"
    },
  },
}
</script>

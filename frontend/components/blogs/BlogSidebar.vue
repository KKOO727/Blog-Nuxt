<template>
  <div class="blog-sidebar-container">
    <div class="blog-sidebar-wrapper">
      <!-- Start Single Widget -->
      <div class="bl-sidebar search">
        <h5 class="widget-title">
          Search
        </h5>
        <form class="inner">
          <div class="search-box">
            <input type="text" placeholder="Enter search keyword…" v-model="searchKeyword" @change="blogSearch">
            <button @click="blogSearch"><span class="fa fa-search" /></button>
          </div>
        </form>
      </div>
      <!-- End Single Widget -->

      <!-- Start Single Widget -->
      <div class="bl-sidebar instagram mt--50 wow move-up">
        <h5 class="widget-title">
          Recent Blog List
        </h5>
        <SidebarBlogList add-class="instagram-grid-5 inner" :allBlogs="allBlogs" v-if="!!allBlogs && allBlogs.length > 0"/>
      </div>
      <!-- End Single Widget -->

      <!-- Start Single Widget -->
      <div class="bl-sidebar category mt--50 wow move-up">
        <h5 class="widget-title">
          Categories
        </h5>
        <div class="inner">
          <ul class="category-list">
            <li v-for="category in categories" :key="category">
              <n-link :to="`/blog/category-tag/${category}?type=category`">
                {{ category }}
              </n-link>
            </li>
          </ul>
        </div>
      </div>
<!--       
      <div class="bl-sidebar banner mt--50 wow move-up">
        <div class="inner">
          <div class="thumb">
            <img class="w-100" src="/img/blog/big-img/banner-image.jpg" alt="banner">
          </div>
          <div class="content">
            <h4 class="heading heading-h4 text-white">
              Spot for banner
            </h4>
            <div class="banner-btn mt--25">
              <button class="brook-btn bk-btn-theme btn-sd-size btn-rounded space-between">
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div> -->
      

      <!-- <div class="bl-sidebar archive mt--50 wow move-up">
        <h5 class="widget-title">
          Archives
        </h5>
        <div class="inner">
          <select>
            <option>Select Month</option>
            <option>January 2019 </option>
            <option>July 2018 </option>
            <option> January 2018 </option>
          </select>
        </div>
      </div> -->

      <!-- Start Single Widget -->
      <div class="bl-sidebar tag mt--50 wow move-up">
        <h5 class="widget-title">
          Tags
        </h5>
        <div class="inner">
          <ul class="tagcloud">
            <li v-for="tag in tags" :key="tag">
              <n-link :to="`/blog/category-tag/${tag}?type=tag`">
                {{ tag }}
              </n-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- End Single Widget -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    SidebarBlogList: () => import('@/components/blogs/SidebarBlogList')
  },
  props:{
    allBlogs:{
      type: Array,
      default: () => [],
    }
  },
  data () {
    return {
      searchKeyword: ''
    }
  },
  computed: {
    ...mapGetters({
      categories: 'blogs/CATEGORIES',
      tags: 'blogs/TAGS',
      // allBlogs: 'blogs/GET_BLOGS'
    })
  },
  created(){
    this.$store.dispatch('blogs/FETCH_CATEGORIES')
    this.$store.dispatch('blogs/FETCH_TAGS')
  },
  methods: {
    blogSearch(event) {
      event.preventDefault();
      if(this.searchKeyword.trim() !== ''){
        this.$router.push(`/blog/category-tag/${this.searchKeyword}?type=search`)
      }
    }
  }
}
</script>

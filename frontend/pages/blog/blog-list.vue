<template>
  <div class="main-wrapper">
    <HeaderElement />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <Breadcrumb :items="items" title="Blog Grid Modern" />

    <div class="bk-blog-grid-area pt--100 pb--100 pt_md--80 pb_md--80 pb_sm--80 pt_sm--60 bg_color--5">
      <div class="container">
        <div class="row mtn--50">
          <div v-for="blog in blogs" :key="blog.blog_id" class="col-lg-4 col-sm-6 move-up wow mt--100">
            <BlogPostThree :blog="blog" add-class="blog-standard blog-grid--modern" read-more-button="true" />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="brook-pagination-wrapper text-center pt--80 pt_sm--50">
              <Pagination v-if="showPagination" @goPage="goPage" :page-count="pageCount"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterTwo />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderElement: () => import('@/components/home/HeaderElement'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    Breadcrumb: () => import('@/components/Breadcrumb'),
    BlogPostThree: () => import('@/components/blogs/BlogPostThree'),
    FooterTwo: () => import('@/components/home/FooterTwo'),
    Pagination: () => import('@/components/atoms/Pagination')
  },

  data () {
    return {
      blogs:[],
      pageCount: 0,
      countPerPage:3,
      showPagination: false,

      items: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Blog',
          to: '/blog'
        },
        {
          text: 'All Blog List',
          active: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      lang: 'GET_LOCALE',
      allBlogs: 'blogs/GET_BLOGS'
    })
  },
  watch:{
    allBlogs(){
      this.updatePagination()
      this.blogs = (this.allBlogs)? this.allBlogs.slice(0, this.countPerPage): []
    },
    lang(){
      this.$store.dispatch('blogs/GET_ALL_BLOGS', true)
    }
  },

  created(){
    this.$store.dispatch('blogs/GET_ALL_BLOGS', true)
  },

  mounted () {
    document.body.classList.add('template-color-1', 'template-font-1')
    
    if(this.allBlogs){
      this.updatePagination()
    }
  },
  methods:{
    updatePagination(){
      const c = (this.allBlogs)?this.allBlogs.length / this.countPerPage:0
      this.pageCount = (c === Math.floor(c))? c: Math.floor(c) + 1
      this.showPagination = true
    },
    goPage(pageNumber){
      const startNumber = (pageNumber - 1) * this.countPerPage
      this.blogs = this.allBlogs.slice(startNumber, startNumber + this.countPerPage)
    },
  },

  head () {
    return {
      title: 'Blog List'
    }
  }
}
</script>

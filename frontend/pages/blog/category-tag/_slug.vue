<template>
  <div class="main-container">

    <HeaderBlack addClass="header-transparent" />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <div class="breadcrumb-area pt--260 pb--80 pt_md--200 pt_sm--150 bg_color--5 breadcrumb-title-bar">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb-inner text-center">
                        <h1 class="heading heading-h1">Blog List by {{type}} - "{{slug}}"</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="blog-creative-area bg_color--5 pt--70 pb--100">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 pr--100 pr_lg--15 pr_md--15 pr_sm--15 mtn--70">

            <div class="breadcrumb-inner text-center" v-if="blogs.length === 0">
              <h2 class="heading heading-h2">No Blogs</h2>
            </div>
            <div class="creative-blog wow move-up mt--70" v-for="blog in blogs" :key="blog.blog_id" v-else>
                <BlogPostFour :blog="blog" addClass="blog-creative" />
            </div>

            <div class="brook-pagination-wrapper text-center pt--80">
              <Pagination v-if="showPagination" @goPage="goPage" :page-count="pageCount"/>
            </div>
          </div>

          <div class="col-lg-4 pl--40 pl_lg--15 pl_md--15 pl_sm--15 mt_md--40 mt_sm--40">
            <BlogSidebar :allBlogs="allBlogs"/>
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
  async asyncData({ params, query, store }) {
    const slug = params.slug;
    const type = query.type;

    let allBlogs;

    if(type === 'tag'){
      allBlogs = await store.dispatch('blogs/FETCH_BLOGS_BY_TAG', {slug})
    }else if(type === 'category'){
      allBlogs = await store.dispatch('blogs/FETCH_BLOGS_BY_CATEGORY', {slug})
    }else if(type === 'search'){
      allBlogs = await store.dispatch('blogs/FETCH_BLOGS_BY_SEARCH', {slug})
    }
    
    return { slug, type, allBlogs }
  },
  components: {
    HeaderBlack: () => import('@/components/home/HeaderBlack'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    BlogPostFour: () => import('@/components/blogs/BlogPostFour'),
    BlogSidebar: () => import('@/components/blogs/BlogSidebar'),
    FooterTwo: () => import('@/components/home/FooterTwo'),
    Pagination: () => import('@/components/atoms/Pagination')
  },
  
  data () {
    return {
      blogs: [],
      pageCount: 0,
      countPerPage:3,
      showPagination: false,
    }
  },

  computed: {
    ...mapGetters({
      lang: 'GET_LOCALE'
    })
  },
  watch:{
    async lang(){
      const slug = this.slug;
      if(this.type === 'tag'){
        this.allBlogs = await this.$store.dispatch('blogs/FETCH_BLOGS_BY_TAG', {slug})
      }else if(this.type === 'category'){
        this.allBlogs = await this.$store.dispatch('blogs/FETCH_BLOGS_BY_CATEGORY', {slug})
      }else if(this.type === 'search'){
        this.allBlogs = await this.$store.dispatch('blogs/FETCH_BLOGS_BY_SEARCH', {slug})
      }
      this.setBlogs()
    }
  },
  mounted () {
    document.body.classList.add('template-color-1', 'template-font-1')
    this.setBlogs()
  },
  methods: {
    setBlogs(){
      this.blogs = (this.allBlogs)? this.allBlogs.slice(0, this.countPerPage): []
      this.updatePagination()
    },
    updatePagination() {
      const c = (this.allBlogs)?this.allBlogs.length / this.countPerPage: 0
      this.pageCount = (c === Math.floor(c))? c: Math.floor(c) + 1
      this.showPagination = true
    },
    goPage(pageNumber){
      const startNumber = (pageNumber - 1) * this.countPerPage
      this.blogs = this.allBlogs.slice(startNumber, startNumber + this.countPerPage)
    },
  },

  head() {
    return {
      title: `Blog ${this.type} List - ${this.slug}`
    }
  },
};
</script>
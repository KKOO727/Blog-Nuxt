<template>
  <div class="main-wrapper">
    <HeaderElement />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <Breadcrumb :items="items" title="Blog Grid Classic Sidebar" />

    <div class="bk-blog-grid-area pt--70 pb--100 pt_md--80 pb_md--80 pb_sm--80 pt_sm--60 bg_color--5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div class="row">
              <div v-for="blog in blogs" :key="blog.blog_id" class="col-sm-6 move-up wow mt--30">
                <div class="blog-grid">
                  <div class="post-thumb">
                    <n-link :to="`/blog/blog-update/${blog.slug}`">
                      <img src="/img/blog/grid/grid-1.jpg" :alt="blog.note">
                    </n-link>
                  </div>
                  <div class="post-content">
                    <div class="post-inner">
                      <h5 class="heading heading-h5">
                        <n-link :to="`/blog/blog-update/${blog.slug}`">
                          {{ blog.caption }}
                        </n-link>
                      </h5>
                      <div class="post-meta">
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
                      

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-12">
                <div class="brook-pagination-wrapper text-center pt--80 pt_md--40 pt_sm--40">
                  
                  <Pagination v-if="showPagination" @goPage="goPage" :page-count="pageCount"/>

                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4 mt_md--40 mt_sm--40 mt--30">
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
  middleware: 'auth',
  components: {
    HeaderElement: () => import('@/components/home/HeaderElement'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    Breadcrumb: () => import('@/components/Breadcrumb'),
    BlogSidebar: () => import('@/components/blogs/BlogSidebar'),
    FooterTwo: () => import('@/components/home/FooterTwo'),
    Date: () => import('@/components/atoms/Date'),
    Pagination: () => import('@/components/atoms/Pagination'),
    DuplicateButton:() => import('@/components/atoms/DuplicateButton')
  },

  data () {
    return {
      blogs:[],
      pageCount: 0,
      countPerPage:4,
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
          text: 'Unpublished Blog List',
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
      this.blogs = (this.allBlogs)? this.allBlogs.slice(0, this.countPerPage): []
      this.updatePagination()
    },
    lang(){
      this.$store.dispatch('blogs/GET_ALL_BLOGS', false)
    },
  },

  created(){
    this.$store.dispatch('blogs/GET_ALL_BLOGS', false)
  },

  mounted () {
    document.body.classList.add('template-color-1', 'template-font-1')
    
    // if(this.count){
    //   this.updatePagination()
    // }
  },
  methods:{
    updatePagination() {
      const c = (this.allBlogs) ? this.allBlogs.length / this.countPerPage: 0
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
      title: 'Unphublished Blog List'
    }
  }
}
</script>

<template>
  <div class="main-container">
    <HeaderBlack />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <div class="blog-creative-area pt--70 pb--100">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div class="blog-details-wrapper">
              <article v-if="blog" class="blog-post standard-post">
                <!-- Start Header -->
                <div class="header mb--40 text-center">
                  <h1 class="heading heading-h1 font-32">
                    {{ blog.caption }}
                  </h1>

                  <TextToSpeech v-if="blogLoaded" :QUOTE_TEXT="blog.caption + '. ' + blog.content"/>

                  <div class="post-meta mt--20">
                    <div class="post-date">
                      Last Update: <Date :date="`${(blog.update_on) ? blog.update_on : blog.created_on}`" format="ISO"/>
                    </div>
                    <div class="post-category" v-if="blog.author">Author:{{ blog.author[0] }} </div>
                    <div class="post-category" v-if="blog.referringPage.length > 0"> Referring Page:{{ getBlogTitleBySlug(blog.referringPage[0]) }} </div>
                  </div>
                </div>
                <div class="el-tiptap-editor__content blog-detail" v-html="blog.content">

                </div>
                <div class="post-meta mt-5" v-if="blog.note">
                  <blockquote class="blockquote_vp">
                    {{ blog.note}}
                  </blockquote>
                </div>

                <div class="post-meta my-5" v-if="blog.relatedPage.length > 0">
                  <h3 class="heading heading-h1 font-32">
                    Related: {{ getBlogTitleBySlug(blog.relatedPage[0]) }}
                  </h3>
                </div>

                <n-link :to="`/blog/blog-update/${slug}?dup=false`" v-if="(blog && userId === blog.user_id) || isAdmin">
                  <button class="brook-btn bk-btn-theme btn-sm-size btn-rounded space-between">
                    Update
                  </button>
                </n-link>
                
                <DuplicateButton :blog="blog" className="btn-sm-size"/>
                
              </article>
              <!-- Start Post Nav Links -->
              <div class="post-nav-lisnt mb--45 wow move-up">
                <div class="nav-item previous" v-visible="prev">
                  <n-link :to="prevLink">
                    <div class="link-text">
                      <span class="fa fa-arrow-left" />
                      <p class="">
                        Prev
                      </p>
                    </div>
                    <span>{{(!!prev) ? prev.caption : ''}}</span>
                  </n-link>
                </div>
                <div class="nav-item next mt_sm--30" v-visible="next">
                  <n-link :to="nextLink">
                    <div class="link-text">
                      <p class="">
                        Next
                      </p>
                      <span class="fa fa-arrow-right" />
                    </div>
                    <span>{{(!!next) ? next.caption : ''}}</span>
                  </n-link>
                </div>
              </div>
              <!-- End Post Nav Links -->

              <div class="comments-wrapper">
                <div class="inner">
                  <h4 class="heading heading-h4">
                    3 Comments
                  </h4>
                  <div class="commnent-list-wrap mt--25">
                    <!-- Start Single Comment -->
                    <div class="comment wow move-up">
                      <div class="thumb">
                        <img src="/img/blog/client/client-1.jpg" alt="Multipurpose">
                      </div>
                      <div class="content">
                        <h6 class="heading heading-h6">
                          SCOTT JAMES
                        </h6>
                        <div class="text mt--10 pr--50 pr_sm--5">
                          <p class="bk_pra">
                            To link your Facebook and Twitter accounts, open the Instagram app on your phone or tablet, and select the Profile tab in the bottom-right corner of the screen.
                          </p>
                        </div>
                        <div class="comment-footer mt--10">
                          <span>May 17, 2018 at 1:59 am</span>
                          <span class="reply-btn">
                            <button>Reply</button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <!-- End Single Comment -->

                    <!-- Start Single Comment -->
                    <div class="comment comment-reply wow move-up">
                      <div class="thumb">
                        <img src="/img/blog/client/client-2.jpg" alt="Multipurpose">
                      </div>
                      <div class="content">
                        <h6 class="heading heading-h6">
                          OWEN CHRIST
                        </h6>
                        <div class="text mt--10 pr--50 pr_sm--5">
                          <p class="bk_pra">
                            To link your Facebook and Twitter accounts, open the Instagram app on your phone or tablet, and select the Profile tab in the bottom-right corner of the screen.
                          </p>
                        </div>
                        <div class="comment-footer mt--10">
                          <span>May 17, 2018 at 1:59 am</span>
                          <span class="reply-btn">
                            <button>Reply</button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <!-- End Single Comment -->

                    <!-- Start Single Comment -->
                    <div class="comment wow move-up">
                      <div class="thumb">
                        <img src="/img/blog/client/client-3.jpg" alt="Multipurpose">
                      </div>
                      <div class="content">
                        <h6 class="heading heading-h6">
                          EDNA WATSON
                        </h6>
                        <div class="text mt--10 pr--50 pr_sm--5">
                          <p class="bk_pra">
                            To link your Facebook and Twitter accounts, open the Instagram app on your phone or tablet, and select the Profile tab in the bottom-right corner of the screen.
                          </p>
                        </div>
                        <div class="comment-footer mt--10">
                          <span>May 17, 2018 at 1:59 am</span>
                          <span class="reply-btn">
                            <button>Reply</button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <!-- End Single Comment -->
                  </div>
                </div>
              </div>

              <!-- Start Comment Form -->
              <div class="comment-form-wrapper">
                <div class="header wow move-up">
                  <h4 class="heading heading-h4">
                    Leave A Comment
                  </h4>
                  <div class="coppent-note mt--20 mb--30">
                    <p class="bk_pra">
                      Your email address will not be published. Required fields are marked
                    </p>
                  </div>
                </div>
                <!-- Start Contact Area -->
                <div class="contact-form wow move-up">
                  <form>
                    <div class="row">
                      <div class="col-lg-12">
                        <input type="text" placeholder="Name *">
                      </div>

                      <div class="col-lg-12 mt--30">
                        <input type="text" placeholder="Email *">
                      </div>

                      <div class="col-lg-12 mt--30">
                        <input type="text" placeholder="Website">
                      </div>

                      <div class="col-lg-12 mt--30">
                        <textarea placeholder="Your Comment" />
                      </div>

                      <div class="col-lg-12 mt--30">
                        <div class="blog-btn">
                          <button class="brook-btn bk-btn-theme btn-sd-size btn-rounded space-between">
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <!-- End Contact Area -->
              </div>
              <!-- End Comment Form -->
            </div>
          </div>

          <div class="col-lg-4 mt_md--40 mt_sm--40">
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
  async asyncData({ params, store }) {
    const slug = params.slug
    const  blog = await store.dispatch('blogs/FETCH_BLOG_BY_SLUG', {slug})
    const allBlogs = await store.dispatch('blogs/GET_ALL_BLOGS', blog.published)
    return { slug, blog, allBlogs }
  },
  components: {
    HeaderBlack: () => import('@/components/home/HeaderBlack'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    BlogSidebar: () => import('@/components/blogs/BlogSidebar'),
    FooterTwo: () => import('@/components/home/FooterTwo'),
    Date: () => import('@/components/atoms/Date'),
    TextToSpeech: () => import('@/components/atoms/TextToSpeech'),
    DuplicateButton:() => import('@/components/atoms/DuplicateButton')
  },

  data () {
    return {
      title: '',
      id: '',
      prevLink:'',
      nextLink:'',
      prev: null,
      next: null,
      isAdmin: false,
      blogLoaded: false,
    }
  },
  computed: {
    ...mapGetters({
      userId: 'users/USER_ID',
      userRole: 'users/USER_ROLE',
    })
  },

  watch:{
    blog(){
    },
    allBlogs(){
      this.setPrevNext();
    },
    userRole(){
      this.setPermission();
    }
  },
  created() {
      this.blogLoaded = true;
      this.setPrevNext();
  },

  mounted () {
    document.body.classList.add('template-color-1', 'template-font-1')
    this.setPermission();
  },
  
  methods:{
    setPrevNext(){
      const currentIndex = this.allBlogs.findIndex((item) => {return String(item.slug) === String(this.slug)});

      this.prev = this.allBlogs[currentIndex - 1]
      this.next = this.allBlogs[currentIndex + 1]

      if(this.prev) this.prevLink=`/blog/${this.prev.slug}`;
      if(this.next) this.nextLink=`/blog/${this.next.slug}`;
    },
    setPermission() {
      if(this.userRole && ['super admin', 'admin'].indexOf(this.userRole) > -1) this.isAdmin = true;
    },
    getBlogTitleBySlug(slug){
      if(this.allBlogs.length > 0){
        const inx = this.allBlogs.findIndex(item => item.slug === slug)
        return (inx > -1) ? this.allBlogs[inx].caption : ''
      }
      return ''
    }
  },

  head () {
    const categories = [...this.blog.primary_category, ...this.blog.secondary_category];
    const tags = [...this.blog.primary_tag, ...this.blog.secondary_tag, ...this.blog.tags];
    return {
      title: this.blog.caption,
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: this.blog.description },
        { hid: 'category', name: 'keywords', content: categories.join(',')},
        { hid: 'tag', name: 'keywords', content: tags.join(',')},
      ],
      
      link: [
        { rel: 'alternate', hreflang: 'en', href: this.blog.url },
        {
          rel: 'alternate', 
          hreflang: 'ex',
          href: (this.blog.relatedPage.length > 0)? this.getBlogTitleBySlug(this.blog.relatedPage[0]): ''
        },
      ]
    }
  }
}
</script>

<style>
  html {
    scroll-behavior: smooth;
  }
  .blog-detail iframe {
    height: 409.375px;
    width: 100%;
  }
  .blockquote_vp {
    margin: 20px 0 0!important;
    font-size: 16px;
    padding: 30px!important;
    color: #051323;
    border: none;
    background: #f0f0f0;
    font-style: italic;
    box-sizing: border-box;
}
</style>
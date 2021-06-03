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
              <article class="blog-post standard-post">
                <div class="col-lg-12 mb--10 p-0">
                  <h3 class="heading heading-h3 font-32 mb-3">
                    Title <b-badge variant="warning" v-if="isDuplicate">duplicate</b-badge>
                  </h3>
                  <b-form-input size="lg" placeholder="Title" v-model="title"></b-form-input>
                </div>
                <h3 class="heading heading-h3 font-32 mt-5 mb-3">
                  Article Content <b-badge variant="warning" v-if="isDuplicate">duplicate</b-badge>
                </h3>
                <client-only>
                  <el-tiptap :extensions="extensions" :content="content" :readonly="editable" @onUpdate="onUpdate" />
                </client-only>
              </article>
              
              <!-- Start Post Nav Links -->
              <div class="post-nav-lisnt mb--45 wow move-up">
                <div class="banner-btn mt--25">
                  <button class="brook-btn bk-btn-theme btn-sd-size btn-rounded space-between" @click="updateBlog">
                    {{(isDuplicate)? 'Duplicate' : 'Update'}}
                  </button>
                  <button class="brook-btn bk-btn-pink btn-sd-size btn-rounded space-between" @click="deleteBlog" v-if="isAdmin">
                    Delete
                  </button>
                </div>
              </div>
              <!-- End Post Nav Links -->
            </div>
          </div>

          <div class="col-lg-4 mt_md--40 mt_sm--40">
            <AdminSidebar v-if="isAdmin" :blog="blog" @update="updateContent"/>
            <BlogSidebar v-else/>
          </div>
        </div>
      </div>
    </div>

    <FooterTwo />
  </div>
</template>

<script>

// import { get } from '../../../plugins/api'
import { mapGetters } from 'vuex'
import {BFormInput, BRow, BCol, BFromTextArea, BBadge} from 'bootstrap-vue'
import {
  Doc,
  Text,
  Paragraph,
  // text extensions
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  FontSize,
  FontType,
  TextColor,
  TextHighlight,
  // FormatClear,
  // paragraph extensions
  Heading,
  ListItem,
  BulletList,
  OrderedList,
  // TodoItem,
  // TodoList,
  TextAlign,
  LineHeight,
  Indent,
  Blockquote,
  CodeBlock,
  // rich and tools extensions
  Link,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Iframe,
  TrailingNode,
  HorizontalRule,
  // Fullscreen,
  // Print,
  // Preview,
  // SelectAll,
  // CodeView,
  History,
  CTAS
} from '../../../plugins/element-tiptap/index'

// import codemirror from 'codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/xml/xml.js' 
// import 'codemirror/addon/selection/active-line.js'
// import 'codemirror/addon/edit/closetag.js'

import Anchor from '../../../components/custom-tiptap/Anchor/index'

async function upload(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await window.$nuxt.$store.dispatch('blogs/UPLOAD_IMAGE', formData);
  return res.data.url;
}

export default {
  middleware: 'auth',
  async asyncData({ app, params, store, query }) {
    const slug = params.slug
    // store.dispatch('blogs/FETCH_BLOG_BY_SLUG', {slug})
    const  blog = await store.dispatch('blogs/FETCH_BLOG_BY_SLUG', {slug})
    const isDuplicate = (query.dup === 'true') && !blog.linked_id
    return { blog, slug, isDuplicate}
  },
  async fetch() {
    // this.$store.dispatch('blogs/FETCH_BLOG_BY_SLUG', {slug: this.slug})
  },
  components: {
    HeaderBlack: () => import('@/components/home/HeaderBlack'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    BlogSidebar: () => import('@/components/blogs/BlogSidebar'),
    AdminSidebar: () => import('@/components/blogs/AdminSidebar'),
    FooterTwo: () => import('@/components/home/FooterTwo'),
  },

  data () {
    return {
      id: this.$route.params.id,
      title: '',
      slug: '',

      editable: false,
      output: '',
      extensions: [],
      content: '',
      isAdmin: false,
      updateBody: null
    }
  },

  computed: {
    ...mapGetters({
      // blog: 'blogs/BLOG',
      userId: 'users/USER_ID',
      userRole: 'users/USER_ROLE',
    })
  },
  watch:{
    blog(){
    },
    userRole(){
      this.setPermission();
    }
  },
  mounted () {
    this.extensions = [
      new Doc(),
      new Text(),
      new Paragraph(),
      new Bold({ bubble: true, menubar: false }),
      new Underline({ bubble: true, menubar: false }),
      new Italic({ bubble: true, menubar: false }),
      new Strike({ bubble: true, menubar: false }),
      new Code(),
      new FontType({ bubble: true, menubar: false }),
      new FontSize({ bubble: true, menubar: false }),
      new TextColor({ bubble: true, menubar: false }),
      new TextHighlight({ bubble: true, menubar: false }),
      // new FormatClear(),
      new Heading({ level: 5 }),
      new ListItem(),
      new BulletList(),
      new OrderedList(),
      // new TodoItem(),==================
      // new TodoList(),==================
      new TextAlign({ bubble: true, menubar: false }),
      new LineHeight({ bubble: true, menubar: false }),
      new Indent(),
      new Blockquote(),
      new CodeBlock(),
      new Link({ bubble: true, menubar: false }),
      new Image({
        uploadRequest: upload,
      }),
      new Iframe(),
      new Table({ resizable: true }),
      new TableHeader(),
      new TableCell(),
      new TableRow(),
      new HorizontalRule(),
      // new Print(),
      // new Preview(),
      // new SelectAll(),
      // new Fullscreen(),
      // new CodeView({
      //   codemirror,
      //   codemirrorOptions: {
      //     styleActiveLine: true,
      //     autoCloseTags: true
      //   }
      // }),
      new TrailingNode(),
      new Anchor({ bubble: true, menubar: false }),
      new History(),
      new CTAS()
    ]
    this.setPermission();
    if(!this.isAdmin && this.blog.user_id !== this.userId) this.$router.push('/')
  },
  created(){
    this.slug = this.$route.params.slug;
    if(!process.client){
      this.$router.push('/')
    }
    this.setBlog()
  },
  methods: {
    updateContent(obj) {
      for (var property in this.updateBody) {
        if (obj.hasOwnProperty(property)) {
          this.updateBody[property] = obj[property]
        }
      }
    },
    async updateBlog () {
      if(this.title === '' || this.output === '') return false;
      const body = {
        ...this.updateBody,
        source: this.output,
        title: this.title,
        dup: this.isDuplicate
      }
      
      const result = await this.$store.dispatch('blogs/UPDATE_BLOG', body)
      
      if(this.isDuplicate){
        this.$router.push(`/blog/blog-list`)
      }else{
        this.$router.push(`/blog/${result.slug}`)
      }
      
    },
    async deleteBlog() {
        this.$bvModal.msgBoxConfirm('Please confirm that you want to delete everything.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(async value => {
            if(value) {
              const response = await this.$store.dispatch('blogs/DELETE_BLOG', {slug: this.slug});
              if(response.data.success){
                this.$router.push('/blog/blog-list');
              }
            }
          })
          .catch(err => {
            // An error occurred
          })
    },
    onUpdate (output, options) {
      const { getHTML } = options

      this.output = getHTML()
    },
    setPermission() {
      if(this.userRole && ['super admin', 'admin'].indexOf(this.userRole) > -1) this.isAdmin = true;
    },
    setBlog() {
      if(this.blog){

        this.content = this.blog.content
        this.output = this.content
        this.title = this.blog.caption

        this.slug = this.blog.slug

        this.updateBody = { ...this.blog }
      }
    }
  },

  head () {
    return {
      title: 'Update Blog'
    }
  }
}
</script>

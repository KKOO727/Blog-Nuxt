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
                <div class="col-lg-12 mb--30 p-0">
                  <h3 class="heading heading-h3 font-32 mb-3">
                    {{$t('title')}}
                  </h3>
                  <b-form-input size="lg" placeholder="Blog title" :formatter="titleFormatter" v-model="title"></b-form-input>
                  <div class="mt-1">Recommend: Max 60 Charactoers</div>
                </div>
                <h3 class="heading heading-h3 font-32 mt-5 mb-3">
                  {{$t('article-content')}}
                </h3>
                <el-tiptap :extensions="extensions" :content="content" :readonly="editable" @onUpdate="onUpdate" />
              </article>
              
              <!-- <TagSelector @changeTags="tagSelect" :formTags="tags"/> -->

              <!-- Start Post Nav Links -->
              <div class="post-nav-lisnt mb--45 wow move-up">
                <div class="banner-btn mt--25">
                  <button class="brook-btn bk-btn-theme btn-sd-size btn-rounded space-between" @click="saveBlog">
                    {{$t('publish')}}
                  </button>
                </div>
              </div>
              <!-- End Post Nav Links -->
            </div>
          </div>

          <div class="col-lg-4 mt_md--40 mt_sm--40">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>

    <FooterTwo />
  </div>
</template>

<script>

import {BFormInput} from 'bootstrap-vue'
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
  History
} from '../../plugins/element-tiptap/index'

// import codemirror from 'codemirror'
// import 'codemirror/lib/codemirror.css' // import base style
// import 'codemirror/mode/xml/xml.js' // language
// import 'codemirror/addon/selection/active-line.js' // require active-line.js
// import 'codemirror/addon/edit/closetag.js' // autoCloseTags

import Anchor from '../../components/custom-tiptap/Anchor/index'

async function upload(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await window.$nuxt.$store.dispatch('blogs/UPLOAD_IMAGE', formData);
  return res.data.url;
}

export default {
  middleware: 'auth',
  components: {
    HeaderBlack: () => import('@/components/home/HeaderBlack'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    BlogSidebar: () => import('@/components/blogs/BlogSidebar'),
    FooterTwo: () => import('@/components/home/FooterTwo'),
    TagSelector:()=> import('@/components/atoms/TagSelector'),
  },

  data () {
    return {
      tags: [],
      title: '',
      editable: false,
      output: '',
      extensions: [
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
        new History()
      ],
      content: ``
    }
  },

  mounted () {
    this.output = this.content
  },
  methods: {
    tagSelect(tags) {
      this.tags = tags;
    },
    async saveBlog () {
      if(this.title === '' || this.output === '') return false;
      const body={
        source: this.output,
        tags: this.tags,
        title: this.title
      }
      const result = await this.$store.dispatch('blogs/CREATE_BLOG', body)
      
      this.$router.push(`/blog/${result.slug}`)
    },
    onUpdate (output, options) {
      const { getHTML } = options
      
      this.output = getHTML()
    },
    titleFormatter(event){
      return String(event).substring(0,60)
    }
  },

  head () {
    return {
      title: 'Element Create Blog'
    }
  }
}
</script>

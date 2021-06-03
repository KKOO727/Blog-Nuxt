<template>
  <div class="blog-sidebar-container">
    <div class="blog-sidebar-wrapper">
      <h4 class="heading heading-h4 font-32 mb-3 text-center">
        Admin Panel
      </h4>
      
      <div class="bl-sidebar">
        <h5 class="widget-title">
          Slug
        </h5>
        <b-form-input size="lg" placeholder="Slug" v-model="slug" :formatter="slugFormatter"></b-form-input>
        <div class="mt-1">Recommend: Max 60 Charactoers</div>
      </div>

      <div class="bl-sidebar mt--50">
        <h5 class="widget-title">
          URL
        </h5>
        <b-form-input size="lg" placeholder="Slug" v-model="url" readonly></b-form-input>
      </div>
      
      <div class="bl-sidebar mt--50 wow">
        <h5 class="widget-title">
          Description
        </h5>
        <b-form-textarea
          v-model="description"
          placeholder="Description"
          rows="5"
          :formatter="descriptionFormatter"
          ></b-form-textarea>
        <div class="mt-1">Recommend: Max 160 Charactoers</div>
      </div>
      
      <div class="bl-sidebar mt--50 wow">
        <h5 class="widget-title">
          Rich Snippet Text
        </h5>
        <div class="inner">
          <b-form-textarea
          v-model="snippet"
          placeholder="Rich Snippet Text"
          :formatter="snippetFormatter"
          rows="1"
          ></b-form-textarea>
        <div class="mt-1">Recommend: Max 160 Charactoers</div>
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow">
        <h5 class="widget-title">
          Autor
        </h5>
        <div class="inner">
          <PageSelector :options="authorList" :limit="1" @setPage="setAuthor" :selectedList="author"/>
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          Updated Date
        </h5>
        <div class="inner">
          <DatePicker :date="updatedOn" @setUpdatedDate="setUpdatedDate"/>
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          Referring Page
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeBlogSlugList"
            :options="wholeBlogSlugList"
            @setPage="setReferringPage" :selectedList="referringPage"/>
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          Related Article
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeBlogSlugList"
          :options="wholeBlogSlugList"
          @setPage="setRelatedPage" :selectedList="relatedPage"/>
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          Note
        </h5>
        <div class="inner">
          <b-form-textarea
            v-model="note"
            placeholder="Note"
            :formatter="noteFormatter"
            rows="5"
            ></b-form-textarea>
        <div class="mt-1">Recommend: Max 160 Charactoers</div>
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          PRIMARY FOCUS TAG
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeTagList"
          :options="wholeTagList" :limit="1" @setPage="primaryTagSelect" :selectedList="primaryTag" type="tag"/>
          <!-- <TagSelector @changeTags="primaryTagSelect" :formTags="primaryTag" :limit="1" :wholeList="wholeTagList"/> -->
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          SECONDARY FOCUS TAG
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeTagList"
            :options="wholeTagList" :limit="1" @setPage="secondaryTagSelect" :selectedList="secondaryTag" type="tag"/>
          <!-- <TagSelector @changeTags="secondaryTagSelect" :formTags="secondaryTag" :limit="1" :wholeList="wholeTagList"/> -->
        </div>
      </div>
      
      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          RELATED TAGS
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeTagList"
            :options="wholeTagList" @setPage="tagSelect" :selectedList="tags" type="tag"/>
          <!-- <TagSelector @changeTags="tagSelect" :formTags="tags" :wholeList="wholeTagList"/> -->
        </div>
      </div>
      
      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          PRIMARY CATEGORY
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeCategoryList"
            :options="wholeCategoryList" :limit="1" @setPage="primaryCategorySelect" :selectedList="primaryCategory" type="category"/>
          <!-- <TagSelector @changeTags="primaryCategorySelect" :formTags="primaryCategory" :limit="1" :wholeList="wholeCategoryList"/> -->
        </div>
      </div>

      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          SECONDARY CATEGORY
        </h5>
        <div class="inner">
          <PageSelector v-if="!!wholeCategoryList"
            :options="wholeCategoryList" :limit="1" @setPage="secondaryCategorySelect" :selectedList="secondaryCategory" type="category"/>
          <!-- <TagSelector @changeTags="secondaryCategorySelect" :formTags="secondaryCategory" :limit="1" :wholeList="wholeCategoryList"/> -->
        </div>
      </div>
      
      <div class="bl-sidebar mt--50 wow ">
        <h5 class="widget-title">
          STATUS
        </h5>
        <div class="inner">
          <b-form-select v-model="status" :options="statusOption"></b-form-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    DatePicker: () => import('@/components/atoms/DatePicker'),
    PageSelector:()=> import('@/components/atoms/BlogSelect'),
    // TagSelector:()=> import('@/components/atoms/TagSelector'),
  },
  props: {
    blog: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      tags: [],
      primaryTag: [],
      secondaryTag: [],
      primaryCategory: [],
      secondaryCategory: [],
      description: '',
      snippet: '',
      author: null,
      updatedOn: null,
      referringPage: null,
      relatedPage: null,
      note: '',
      id: this.$route.params.id,
      title: '',
      slug: '',
      url:'',
      wholeBlogSlugList: [],
      allBlogs: [],
      authorList: [],

      status: false,
      statusOption:[
        { value: false, text: 'Draft' },
        { value: true, text: 'Publish' }
      ]
    }
  },
  watch:{
    allBlogs(){
      if(this.blog) {
        const result = [];
        this.allBlogs.forEach(item => {
          result.push(item.slug)
        })
        this.wholeBlogSlugList = result
      }
    },
    slug() {
      this.url = `${process.env.baseUrl}/${this.slug}`
      this.$emit('update', {slug: this.slug})
    },
    description() {
      this.$emit('update', {description: this.description})
    },
    snippet() {
      this.$emit('update', {snippet: this.snippet})
    },
    note() {
      this.$emit('update', {note: this.note})
    },
    status() {
      this.$emit('update', {published: this.status})
    }
  },
  computed: {
    ...mapGetters({
      userId: 'users/USER_ID',
      userRole: 'users/USER_ROLE',
      wholeTagList: 'blogs/TAGS',
      wholeCategoryList: 'blogs/CATEGORIES',
    })
  },
  async created() {

    this.$store.dispatch('blogs/FETCH_TAGS')
    this.$store.dispatch('blogs/FETCH_CATEGORIES')

    this.allBlogs = await this.$store.dispatch('blogs/GET_ALL_BLOGS_LIST')
    this.authorList = await this.$store.dispatch('users/FETCH_ALL_AUTHORS')

    if(this.blog) {
      this.tags = this.blog.tags
      this.slug = this.blog.slug
      this.url = this.blog.url

      this.primaryTag = this.blog.primary_tag
      this.secondaryTag = this.blog.secondary_tag
      this.primaryCategory = this.blog.primary_category
      this.secondaryCategory = this.blog.secondary_category

      this.description = this.blog.description
      this.snippet = this.blog.snippet
      this.author = this.blog.author
      this.updatedOn = this.blog.updated_on
      
      this.referringPage = this.blog.referringPage
      this.relatedPage = this.blog.relatedPage
      
      this.note = this.blog.note
      this.status = this.blog.published
      this.$store.dispatch('blogs/FETCH_BLOG_BY_SLUG', {slug: this.slug})
    }
      
  },
  methods: {
    setAuthor(author){
      this.author = author
      this.$emit('update', {author: author})
    },
    setUpdatedDate(date) {
      this.updatedOn = date
      this.$emit('update', {updated_on: date})
    },
    setReferringPage(page){
      this.referringPage = page
      this.$emit('update', {referringPage: page})
    },
    setRelatedPage(page) {
      this.relatedPage = page
      this.$emit('update', {relatedPage: page})
    },
    
    tagSelect(tags) {
      this.tags = tags;
      this.$emit('update', {tags})
    },  
    primaryTagSelect(tags) {
      this.primaryTag = tags;
      this.$emit('update', {primary_tag: tags})
    },
    secondaryTagSelect(tags) {
      this.secondaryTag = tags;
      this.$emit('update', {secondary_tag: tags})
    },
    primaryCategorySelect(category) {
      this.primaryCategory = category;
      this.$emit('update', {primary_category: category})
    },
    secondaryCategorySelect(category) {
      this.secondaryCategory = category;
      this.$emit('update', {secondary_category: category})
    },
    descriptionFormatter(event){
      return String(event).substring(0,160)
    },
    slugFormatter(event){
      return String(event).substring(0,60)
    },
    snippetFormatter(event){
      return String(event).substring(0,160)
    },
    noteFormatter(event){
      return String(event).substring(0,160)
    }
  }
}
</script>

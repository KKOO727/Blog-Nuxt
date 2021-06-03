
import { get, post, patch, deleteApi } from '../plugins/api'

export const state = () => ({
  categories: [],
  tags: [],
  blog: null,
  blogs: []
})

export const mutations = {
  SET_CATEGORIES: (state, payload) => {
    state.categories = payload
  },
  SET_TAGS: (state, payload) => {
    state.tags = payload
  },
  SET_BLOG: (state, payload) => {
    state.blog = payload
  },
  SET_BLOGS: (state, payload) => {
    state.blogs = payload
  }
}

export const getters = {
  CATEGORIES: state => state.categories,
  TAGS: state => state.tags,
  BLOG: state => state.blog,
  GET_BLOGS: state => state.blogs
}

export const actions = {

  FETCH_CATEGORIES: async (context) => {
    const response = await get('API', '/misc/categories/', context)
    context.commit('SET_CATEGORIES', response.data.data)
    return response.data.data
  },
  CREATE_CATEGORY: async (context, payload) => {
    const response = await post('API', '/misc/new-category', payload, context)
    context.commit('SET_CATEGORIES', response.data.data)
    return response.data.data
  },
  FETCH_TAGS: async (context) => {
    const response = await get('API', '/misc/tags/', context)
    context.commit('SET_TAGS', response.data.data)
    return response.data.data
  },
  CREATE_TAG: async (context, payload) => {
    const response = await post('API', '/misc/new-tag', payload, context)
    context.commit('SET_TAGS', response.data.data)
    return response.data.data
  },

  CREATE_BLOG: async (context, payload) => {
    const body = {...payload, lang: context.rootGetters.GET_LOCALE}
    const blog = await post('API', '/blog', body, context)
    return blog.data.data
  },
  UPDATE_BLOG: async (context, payload) => {
    delete(payload.content)
    const { blog_id } = payload
    const blogData = await patch('API', `/blog/${blog_id}/`, payload, context)
    const item = blogData.data.data
    context.commit('SET_BLOG', item)
    return item
  },
  FETCH_BLOG: async (context, payload) => {
    const blog = await get('API', `/blog/${payload.id}`)
    context.commit('SET_BLOG', blog.data.data)
    return blog.data.data
  },
  FETCH_BLOG_BY_SLUG: async (context, payload) => {
    const blog = await get('API', `/blog/slug/${payload.slug}`)
    context.commit('SET_BLOG', blog.data.data)
    return blog.data.data
  },
  
  UPLOAD_IMAGE: async (context, payload) => {
    const response = await post('API', '/uploadImage', payload, context)
    return response.data
  },

  FETCH_BLOGS_BY_CATEGORY: async (context, payload) => {
    const { slug } = payload
    const lang = context.rootGetters.GET_LOCALE
    const response = await get('API', `/category-blogs/${slug}/${lang}`)
    context.commit('SET_BLOGS', response.data.data)
    return response.data.data
  },
  FETCH_BLOGS_BY_TAG: async (context, payload) => {
    const { slug } = payload
    const lang = context.rootGetters.GET_LOCALE
    const response = await get('API', `/tag-blogs/${slug}/${lang}`)
    context.commit('SET_BLOGS', response.data.data)
    return response.data.data
  },
  FETCH_BLOGS_BY_SEARCH: async (context, payload) => {
    const { slug } = payload
    const lang = context.rootGetters.GET_LOCALE
    const response = await get('API', `/search-blogs/${slug}/${lang}`)
    context.commit('SET_BLOGS', response.data.data)
    return response.data.data
  },
  DELETE_BLOG: async (context, payload) => {
    const lang = context.rootGetters.GET_LOCALE
    const { slug } = payload
    return await deleteApi('API', `/delete-blog/${slug}/${lang}`, {}, context)
  },
  GET_ALL_BLOGS: async (context, published) => {
    const lang = context.rootGetters.GET_LOCALE
    const response = (published) ? await get('API', `/blogs/${lang}`, context) : await get('API', `/blogs/unpublished/${lang}`, context)
    context.commit('SET_BLOGS', response.data.data)
    return response.data.data
  },
  GET_ALL_BLOGS_LIST: async (context) => {
    const lang = context.rootGetters.GET_LOCALE
    const response = await get('API', `/blogs-all/${lang}`, context)
    context.commit('SET_BLOGS', response.data.data)
    return response.data.data
  },
  GET_ADMIN_BLOGS: async (context) => {
    const response = await get('API', `/admin-blogs/`, context)
    context.commit('SET_BLOGS', response.data.data)
    return response.data.data
  },
}

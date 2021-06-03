import jwtDecode from 'jwt-decode'
import {get, patch, post, deleteApi } from '../plugins/api'

export const state = () => ({
  authorized: false,
  userToken: null,
  userId: null,
  username: null,
  userRole: null,
  userEmail: null,
  userActivity: null,
  allAuthors: [],
  allUsers: [],
  updatingUsers: null,
  roles: []
})

export const getters = {
  IS_AUTHORIZED: state => state.authorized,
  USER_TOKEN: state => state.userToken,
  USER_ID: state => state.userId,
  USER_USERNAME: state => state.username,
  USER_ROLE: state => state.userRole,
  USER_EMAIL: state => state.userEmail,
  USER_ACTIVITY: state => state.userActivity,
  GET_ALL_AUTHORS: state => state.allAuthors,
  GET_ALL_USERS: state => state.allUsers,
  GET_UPDATING_USER: state => state.updatingUsers,
  GET_USER_ROLES: state => state.roles
}

export const mutations = {
  SET_AUTHORIZED: (state, payload) => {
    state.authorized = payload
  },
  SET_USER_TOKEN: (state, payload) => {
    state.userToken = payload
  },
  SET_USER_ID: (state, payload) => {
    state.userId = payload
  },
  SET_USER_USERNAME: (state, payload) => {
    state.username = payload
  },
  SET_USER_ROLE: (state, payload) => {
    state.userRole = payload
  },
  SET_USER_EMAIL: (state, payload) => {
    state.userEmail = payload
  },
  SET_USER_ACTIVITY: (state, payload) => {
    state.userActivity = payload
  },
  SET_ALL_AUTHORS: (state, payload) => {
    state.allAuthors = payload
  },
  SET_ALL_USERS: (state, payload) => {
    state.allUsers = payload
  },
  SET_UPDATING_USER: (state, payload) => {
    state.updatingUsers = payload
  },
  SET_USER_ROLES: (state, payload) => {
    state.roles = payload
  }
}

export const actions = {
  CHANGE_PASSWORD: async(context, payload) => {
    const body = {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword
    }
    await patch('API', `/users/${context.state.userId}/password`, body, context)
    await context.dispatch('SIGN_USER_OUT')
  },
  FORGOT_PASSWORD: async(context, payload) => {
    const body = {
      email: payload.email
    }
    const result = await post('API', '/forgotPassword', body)
    return result
  },
  RESET_PASSWORD: (context, payload) => {
    const body = {
      resetPasswordToken: payload.resetPasswordToken,
      password: payload.password
    }
    return post('API', '/resetPassword', body)
  },
  SIGN_USER_IN: async(context, payload) => {
    if (process.server) {
      return
    }
    context.commit('SET_USER_TOKEN', null)
    context.commit('SET_AUTHORIZED', false)
    context.commit('SET_USER_ID', null)
    context.commit('SET_USER_ROLE', null)
    context.commit('SET_USER_USERNAME', null)

    const body = {
      email: payload.email,
      password: payload.password
    }
    const response = await post('API', '/authorizeUser', body)

    const jwt = response.data.data
    const jwtData = jwtDecode(jwt)
    localStorage.setItem('jwt', jwt)

    context.commit('SET_USER_TOKEN', jwt)
    context.commit('SET_AUTHORIZED', true)
    context.commit('SET_USER_ID', jwtData.userId)
    context.commit('SET_USER_USERNAME', jwtData.username)
    context.commit('SET_USER_ROLE', jwtData.roles)
    return true
  },
  SIGN_USER_OUT: (context) => {
    if (process.server) {
      return
    }
    localStorage.removeItem('jwt')
    context.commit('SET_USER_TOKEN', null)
    context.commit('SET_AUTHORIZED', false)
    context.commit('SET_USER_ID', null)
    context.commit('SET_USER_USERNAME', null)
    context.commit('SET_USER_ROLE', null)
  },
  GET_DECODED_JWT: () => {
    if (process.server) {
      return
    }
    const jwt = localStorage.getItem('jwt')
    if (!jwt) { return }
    const jwtData = jwtDecode(jwt)
      // eslint-disable-next-line consistent-return
    return {
      decoded: jwtData,
      encoded: { token: jwt }
    }
  },
  FETCH_ALL_AUTHORS: async(context) => {
    const response = await get('API', '/users/author-all', context)
    context.commit('SET_ALL_AUTHORS', response.data.data)
    return response.data.data
  },
  FETCH_ALL_USERS: async(context) => {
    const response = await get('API', '/users/all', context)
    context.commit('SET_ALL_USERS', response.data.data)
    return response.data.data
  },
  FETCH_USER_BY_ID: async(context, payload) => {
    const { id } = payload
    const response = await get('API', `/user/${id}`, context)
    context.commit('SET_UPDATING_USER', response.data.data)
    return response.data.data
  },
  FETCH_USER_ROLES: async(context) => {
    const response = await get('API', `/user-roles`, context)
    context.commit('SET_USER_ROLES', response.data.data)
    return response.data.data
  },
  UPDATE_USER: async(context, payload) => {
    const { id } = payload
    const response = await patch('API', `/update-user/${id}`, payload, context)
    return response.data
  },
  DELETE_USER: async(context, payload) => {
    const { id } = payload
    const response = await deleteApi('API', `/delete-user/${id}`, {}, context)
    context.commit('SET_ALL_USERS', response.data.data)
    return response.data
  },
  LOAD_USER: async(context) => {
    if (process.server) {
      return
    }
    let jwt = localStorage.getItem('jwt')
    let clean = false
    if (jwt) {
      try {
        const jwtData = jwtDecode(jwt)
        context.commit('SET_USER_ID', jwtData.userId)
        context.commit('SET_USER_USERNAME', jwtData.username)
        context.commit('SET_AUTHORIZED', true)
        context.commit('SET_USER_TOKEN', jwt)
        context.commit('SET_USER_ROLE', jwtData.roles)

        if (Date.now() > 1000 * (jwtData.iat + 24 * 3600)) {
          const response = await post('API', `/users/${jwtData.userId}/validateToken`, {}, context)
          jwt = response.data.data
          localStorage.setItem('jwt', jwt)
          context.commit('SET_USER_TOKEN', jwt)
        }
      } catch (e) {
        clean = true
      }
    } else {
      clean = true
    }
    if (clean) {
      localStorage.removeItem('jwt')
      context.commit('SET_USER_TOKEN', null)
      context.commit('SET_AUTHORIZED', false)
      context.commit('SET_USER_ID', null)
    }
  },
  CREATE_USER: async(context, payload) => {
    const body = {
      email: payload.email,
      password: payload.password,
      username: payload.username
    }
    const result = await post('API', '/users', body)
    return result
  }
}
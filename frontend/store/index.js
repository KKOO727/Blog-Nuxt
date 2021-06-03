
export const state = () => ({
  locale: 'en',
})

export const mutations = {
  SET_LOCALE: (state, payload) => {
    state.locale = payload
  },
}

export const getters = {
  GET_LOCALE: state => state.locale,
}

export const actions = {
  LOCALE_ACTION: (context, payload) => {
    context.commit('SET_LOCALE', payload)
  },
}

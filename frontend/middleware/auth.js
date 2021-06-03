export default function ({ store, redirect }) {
  store.dispatch('users/LOAD_USER');
  if (!store.getters['users/IS_AUTHORIZED']) {
    return redirect('/login')
  }
}

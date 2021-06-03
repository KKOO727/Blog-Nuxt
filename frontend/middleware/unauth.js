export default function ({ store, redirect }) {
  if (store.getters['users/IS_AUTHORIZED']) {
    return redirect('/')
  }
}

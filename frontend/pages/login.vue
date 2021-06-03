<template>
  <div class="main-container">
    <HeaderElement />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <LoginBreadcrumb />

    <LoginContent />

    <FooterTwo />
  </div>
</template>

<script>
export default {
  middleware: 'unauth',
  components: {
    HeaderElement: () => import('@/components/home/HeaderElement'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    LoginBreadcrumb: () => import('@/components/users/LoginBreadcrumb'),
    LoginContent: () => import('@/components/users/LoginContent'),
    FooterTwo: () => import('@/components/home/FooterTwo')
  },

  head () {
    return {
      title: 'Panama || Login'
    }
  }
}
</script>

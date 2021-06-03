<template>
  <div class="main-container">
    <HeaderElement />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <SignupBreadcrumb />

    <SignupContent />

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
    SignupBreadcrumb: () => import('@/components/users/SignupBreadcrumb'),
    SignupContent: () => import('@/components/users/SignupContent'),
    FooterTwo: () => import('@/components/home/FooterTwo')
  },

  head () {
    return {
      title: 'Panama || Signup'
    }
  }
}
</script>

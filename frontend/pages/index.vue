<template>
  <div class="main-container">
    <Header />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <HeroBusiness />

    <ServiceOne id="service" />

    <PortfolioOne />

    <CounterUpOne />

    <TeamOne />

    <CurveShape>
      <template v-slot:bgcolor>
        <path
          style="fill: #f5f5f5;
                    stroke-miterlimit:10;"
          d="M3360.5,97.739c-242,0-480-48.375-480-48.375
                        S2647.5,0.5,2400.5,0.5s-480,48.375-480,48.375s-238,48.864-480,48.864s-480-48.375-480-48.375S727.5,0.5,480.5,0.5
                        S0.5,48.875,0.5,48.875V108h1920h1920V48.875C3840.5,48.875,3602.5,97.739,3360.5,97.739z"
        />
      </template>
    </CurveShape>
    <TestimonialOne />

    <BrandLogoCarousel />

    <BlogOne />

    <ContactUsOne />

    <Footer />
  </div>
</template>

<script>

export default {
  components: {
    Header: () => import('@/components/home/Header'),
    OffCanvasMobileMenu: () => import('@/components/navigation/OffCanvasMobileMenu'),
    SearchPopup: () => import('@/components/home/SearchPopup'),
    HeroBusiness: () => import('@/components/home/HeroBusiness'),
    ServiceOne: () => import('@/components/sections/ServiceOne'),
    PortfolioOne: () => import('@/components/sections/PortfolioOne'),
    CounterUpOne: () => import('@/components/sections/CounterUpOne'),
    TeamOne: () => import('@/components/sections/TeamOne'),
    TestimonialOne: () => import('@/components/sections/TestimonialOne'),
    BrandLogoCarousel: () => import('@/components/BrandLogoCarousel'),
    BlogOne: () => import('@/components/sections/BlogOne'),
    CurveShape: () => import('@/components/home/CurveShape'),
    ContactUsOne: () => import('@/components/home/ContactUsOne'),
    Footer: () => import('@/components/home/Footer')
  },

  mounted () {
    document.body.classList.add('template-color-1', 'template-font-2')
  },

  head () {
    return {
      title: 'Panama || Home Business'
    }
  }
}
</script>

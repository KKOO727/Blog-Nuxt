<template>
<div class="popup-mobile-menu popup-mobile-visiable" id="offcanvas-menu">
  <div class="mobile-menu-overlay" @click="mobiletoggleClass('removeClass', 'show-mobile-menu')"></div>
  <div class="inner">
    <div class="mobileheader">
      <div class="logo">
        <n-link to="/">
          <img src="/img/logo/brook-black.png" alt="brand logo">
        </n-link>
      </div>
      <a class="mobile-close" href="javascript:void(0)" @click="mobiletoggleClass('removeClass', 'show-mobile-menu')"></a>
    </div>
    <div class="menu-content">
      <MobileNavigation />
    </div>
  </div>
</div>
</template>

<script>
  export default {
    components: {
      MobileNavigation: () => import('@/components/navigation/MobileNavigation'),
    },
    methods: {
      // offcanvas menu close
      mobiletoggleClass(addRemoveClass, className) {
        const el = document.querySelector('#offcanvas-menu');
        if (addRemoveClass === 'addClass') {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
        }
      }
    }
  };
</script>
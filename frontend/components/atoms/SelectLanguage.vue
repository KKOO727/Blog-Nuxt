<template>
  <div>
    <b-form-select v-model="lang" :options="langs" size="sm"></b-form-select>
  </div>
</template>

<script>
import { BFormSelect } from 'bootstrap-vue'
export default {
  name: 'SelectLanguage',
  components:{
    BFormSelect
  },
  data () {
    return { 
      langs: ['en', 'es'],
      lang: 'en'
    }
  },
  watch:{
    'lang': 'changeLocale'
  },
  mounted(){
    this.lang = this.$store.getters.GET_LOCALE
  },
  methods:{
    changeLocale(){
      this.$store.dispatch('LOCALE_ACTION', this.lang)
      this.$i18n.locale = this.lang
    }
  }
}
</script>
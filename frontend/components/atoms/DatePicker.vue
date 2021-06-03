<template>
  <div>
    <b-form-datepicker
      v-model="value"
      menu-class="w-100"
      calendar-width="100%"
      class="mb-2"
      :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
      locale="en"
    ></b-form-datepicker>
  </div>
</template>

<script>
import {BFormDatepicker} from 'bootstrap-vue'
  export default {
    components:{
      BFormDatepicker
    },
    props:{
      date:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        value: ''
      }
    },
    watch: {
      value() {
        this.$emit('setUpdatedDate', this.value)
      },
      date(){
        this.value = this.date
      }
    },
    mounted() {
      this.value = this.date;
    }
  }
</script>
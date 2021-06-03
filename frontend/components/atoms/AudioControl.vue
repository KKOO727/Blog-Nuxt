<template>
    <b-card style="text-align: center">
        <b-card-text>
            <b-button variant="outline-primary" class="mr-2" @click="playing ? pause() : play()" :disabled="!loaded">
                <b-icon v-if="!playing || paused" icon="play" aria-hidden="true"></b-icon>
                <b-icon v-else icon="pause" aria-hidden="true"></b-icon>
            </b-button>
            <b-button variant="outline-primary" icon class="mr-2" @click="stop()" :disabled="!loaded">
                <b-icon icon="stop" aria-hidden="true"></b-icon>
            </b-button>
            <b-progress v-model="percentage" height="5" style="margin-top: 15px; margin-bottom: 15px;" @click="setPosition()" :disabled="!loaded"></b-progress>
            <!-- <p>{{ currentTime }} / {{ duration }}</p> -->
        </b-card-text>
    </b-card>
</template>

<script>
import {BCard, BCardText, BButton, BProgress, BIcon, BIconPlay, BIconPause, BIconStop} from 'bootstrap-vue'

  export default {
    components:{
      BCard, BCardText, BButton, BProgress, BIcon, BIconPlay, BIconPause, BIconStop
    },
    props: {
      loaded: {
        type: Boolean,
        default: false
      },
      playing: {
        type: Boolean,
        default: false
      },
      paused: {
        type: Boolean,
        default: false
      },
      currentTime: {
        type: Number,
        default: 0,
      },
      duration: {
        type: Number,
        default: 100,
      },
    },
    data () {
      return {
        percentage: 0
       }
    },
    watch:{
      currentTime() {
        this.percentage = Math.floor((this.currentTime / this.duration) * 100);
      }
    },
    methods: {
      setPosition () {
          // this.audio.currentTime = parseInt(this.audio.duration / 100 * this.percentage);
      },
      stop () {
        this.$emit('stop');
      },
      play () {
        this.$emit('play')
      },
      pause () {
        if(this.paused){
          this.play()
        }else{
          this.$emit('pause')
        }
      },
    },
    mounted () { },
  }
</script>
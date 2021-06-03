<template>
  <div>
    <AudioControl
      :loaded="true"
      :playing="VOICE_SPEAKING"
      :paused="VOICE_PAUSED"
      :currentTime="currentWord"
      :duration="totalWords"
      @stop="stop"
      @play="play"
      @pause="pause"
    />
    <div v-html="QUOTE_TEXT" ref="elGetText" style="display:none;"></div>
  </div>
</template>

<script>


export default {
  components:{
    AudioControl: () => import('@/components/atoms/AudioControl')
  },
  props:{
      QUOTE_TEXT : String,
  },
  data(){
    return {
      SYNTHESIS : null,
      VOICES : null,

      VOICE_SPEAKING : false,
      VOICE_PAUSED : false,
      VOICE_COMPLETE : false,
      voice: null,
      readText: '',
      currentWord: 0,
      totalWords: 1,
    }
  },
  watch:{
    QUOTE_TEXT(){
    }
  },
  mounted() {
    const str = this.$refs.elGetText.textContent;
    this.readText = str.replaceAll(/(\.)([A-Z])/gi, function (match, grp1, grp2, grp3, offset, s) {
        return grp1  + " " + grp2;
    });

    this.totalWords = this.readText.length;

    this.SYNTHESIS = window.speechSynthesis;
    
    let timer = setInterval(() => {
      let voices = this.SYNTHESIS.getVoices();

      if (voices.length > 0) {
        this.getVoices();
        clearInterval(timer);
      }
    }, 200);
  },
  beforeDestroy() {
    this.SYNTHESIS.cancel();
  },
  methods: {
    getVoices() {
      let langRegex = /^en(-[a-z]{2})?$/i;

      this.VOICES = this.SYNTHESIS.getVoices()
      //   .filter(function (voice) { return langRegex.test(voice.lang) })
      //   .map(function (voice) {
      //     return { voice: voice, name: voice.name, lang: voice.lang.toUpperCase() }
      //   });
      this.voice = (this.VOICES && this.VOICES.length > 0) ? this.VOICES[4]: null;
    },
    resetVoice() {
      this.VOICE_SPEAKING = false;
      this.VOICE_PAUSED = false;
      this.VOICE_COMPLETE = false;
      console.log('END')
    },
    paused() {
      this.VOICE_PAUSED = true;
    },
    resumed() {
      this.VOICE_PAUSED = false;
    },
    play() {
      window.utterances = [];

      if (this.VOICE_SPEAKING) {

        if (this.VOICE_PAUSED) this.SYNTHESIS.resume();
        this.resumed();

      } else {

        let quoteUtterance = new SpeechSynthesisUtterance(this.readText);

        if (this.voice) {
          quoteUtterance.voice = this.voice.voice;
        }

        quoteUtterance.onpause = (evt) => {
          this.VOICE_PAUSED = true;
        };
        quoteUtterance.onresume = (evt) => {
          this.VOICE_PAUSED = false;
        };

        
        const resumeInfinity = () => {
          if(!this.VOICE_PAUSED) this.SYNTHESIS.resume();
          const timeoutResumeInfinity = setTimeout(resumeInfinity, 1000);
        }
        
        quoteUtterance.onstart = (evt) => {
          this.VOICE_COMPLETE = false;
          this.VOICE_SPEAKING = true;
          resumeInfinity();
        }

        quoteUtterance.onboundary = (evt) => {
          this.currentWord = evt.charIndex;
        }
        quoteUtterance.onend = (evt) => {
          this.resetVoice();
        }
        this.SYNTHESIS.cancel();
        utterances.push( quoteUtterance );
        this.SYNTHESIS.speak(quoteUtterance);
      }
    },
    pause() {
      if (this.VOICE_SPEAKING) this.SYNTHESIS.pause();
      this.paused();
    },
    stop() {
      if (this.VOICE_SPEAKING) this.SYNTHESIS.cancel();
      this.resetVoice();

      this.VOICE_COMPLETE = true;
    }
  }
  
}
</script>
<style scoped>

</style>
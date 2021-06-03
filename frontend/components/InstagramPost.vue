<template>
  <div class="instagram-grid-wrap" :class="addClass">
    <div v-for="instagram in data" :key="instagram.id" class="item-grid grid-style--1">
      <div class="thumb">
        <n-link to="/">
          <img :src="instagram.image" alt="instagram images">
        </n-link>
        <div class="item-info">
          <div class="inner">
            <n-link to="">
              <i class="fas fa-heart" />{{ instagram.like }}
            </n-link>
            <n-link to="">
              <i class="fas fa-comment-dots" />{{ instagram.comment }}
            </n-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../data/instagram.json'
export default {
  props: ['addClass'],

  data () {
    return {
      data
    }
  }
}
</script>

<template>
    <div class="testimonial testimonial_style--1">
        <div class="content">
            <p v-html="testimonial.text">{{ testimonial.text }}</p>
            <div class="testimonial-info">
                <div class="post-thumbnail">
                    <img :src="testimonial.thumb" :alt="testimonial.alt">
                </div>
                <div class="clint-info">
                    <h6>{{ testimonial.name }}</h6>
                    <span>{{ testimonial.position }}</span>
                </div>
            </div>
            <div class="testimonial-quote">
                <span class="fa fa-quote-right"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['testimonial']
    };
</script>
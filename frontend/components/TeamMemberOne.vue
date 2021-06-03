<template>
    <div class="team team_style--1">
        <!-- Image Wrap -->
        <div class="image-wrap">
            <div class="thumb">
                <img :src="teamMember.image" alt="Team images">
                <div class="overlay"></div>
                <div class="shape">
                    <img class="shape-01" src="/img/team/shape/team-shape-1.png" alt="shape image">
                    <img class="shape-02" src="/img/team/shape/team-shape-2.png" alt="shape image">
                    <img class="shape-03" src="/img/team/shape/team-shape-3.png" alt="shape image">
                </div>
            </div>
            <!-- Social Network -->
            <div class="social-networks">
                <div class="inner">
                    <a class="hint--bounce hint--top hint--primary" href="https://www.facebook.com/" aria-label="Facebook" target="_blank">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a class="hint--bounce hint--top hint--primary" href="https://twitter.com/" aria-label="Twitter" target="_blank">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a class="hint--bounce hint--top hint--primary" href="https://www.instagram.com/" aria-label="Instagram" target="_blank">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            </div>

        </div>
        <!-- Team Info -->
        <div class="info">
            <h6 class="name">{{ teamMember.name }}</h6>
            <span class="position">{{ teamMember.position }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['teamMember']
    };
</script>

<style lang="scss">

</style>
<template>
  <div>
    <div v-if="!more" class="single-page">
      <router-link :to="{path: 'detail/'+slides[0].title}">
        <img :src="slides[0].imgurl">
        <h2 v-if="notitle">{{slides[0].title}}</h2>
      </router-link>
    </div>
    <div v-if="more" class="slide-show" @mouseover="clearInv" @mouseout="runInv">
      <div class="slide-img">
        <router-link :to="{path: 'detail/'+slides[nowIndex].title}">
          <transition name="slide-trans">
            <img v-if="isShow" :src="slides[nowIndex].imgurl">
          </transition>
          <transition name="slide-trans-old">
            <img v-if="!isShow" :src="slides[nowIndex].src">
          </transition>
        </router-link>
      </div>
      <h2>{{ slides[nowIndex].title }}</h2>
      <ul class="slide-pages">
        <li @click="goto(prevIndex)">&lt;</li>
        <li v-for="(item, index) in slides"
        @click="goto(index)"
        >
          <a :class="{on: index === nowIndex}">{{ index + 1 }}</a>
        </li>
        <li @click="goto(nextIndex)">&gt;</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slides: {
      type: Array,
      default: []
    },
    inv: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      nowIndex: 0,
      isShow: true
    }
  },
  computed: {
    notitle () {
      if (this.slides[0].title === ""){
        return 0
      }
      return 1
    },
    more () {
      if(this.slides.length <= 1){
        return 0
      }
      return 1
    },
    prevIndex () {
      if (this.nowIndex === 0) {
        return this.slides.length - 1
      }
      else {
        return this.nowIndex - 1
      }
    },
    nextIndex () {
      if (this.nowIndex === this.slides.length - 1) {
        return 0
      }
      else {
        return this.nowIndex + 1
      }
    }
  },
  methods: {
    goto (index) {
      this.isShow = false
      setTimeout(() => {
        this.isShow = true
        this.nowIndex = index
      }, 10)
    },
    runInv () {
      this.invId = setInterval(() => {
        this.goto(this.nextIndex)
      }, this.inv)
    },
    clearInv () {
      clearInterval(this.invId)
    }
  },
  mounted () {
    this.runInv();
    console.log(this.slides)
  }
}
</script>

<style scoped>
.single-page{
  position: relative;
  margin: 15px 15px 15px 0;
  width: 900px;
  height: 500px;
  overflow: hidden;
}
.single-page img{
  width:100%;
  height:100%;
  position: absolute;
  top: 0;
}
.single-page h2{
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #000;
  opacity: .5;
  bottom: 0;
  height: 30px;
  line-height: 30px;
  text-align: left;
  padding-left: 15px;
  font-weight:bold;
}
.slide-trans-enter-active {
  transition: all .5s;
}
.slide-trans-enter {
  transform: translateX(900px);
}
.slide-trans-old-leave-active {
  transition: all .5s;
  transform: translateX(-900px);
}
.slide-show {
  position: relative;
  margin: 15px 15px 15px 0;
  width: 900px;
  height: 500px;
  overflow: hidden;
}
.slide-show h2 {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #000;
  opacity: .5;
  bottom: 0;
  height: 30px;
  line-height: 30px;
  text-align: left;
  padding-left: 15px;
  font-weight:bold;
}
.slide-img {
  width: 100%;
}
.slide-img img {
  width:100%;
  height:100%;
  position: absolute;
  top: 0;
}
.slide-pages {
  position: absolute;
  bottom: 10px;
  right: 15px;
}
.slide-pages li {
  display: inline-block;
  padding: 0 10px;
  cursor: pointer;
  color: #fff;
}
.slide-pages li .on {
  text-decoration: underline;
}
</style>

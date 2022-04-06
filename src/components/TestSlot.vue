<template>
  <div>
    <div>
      <slot name="user" :user="user"></slot>
    </div>
    <div>
      <slot name="hobbies" :hobbies="hobbies"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        lastname: 'yang',
        firstname: 'yuqiang'
      },
      hobbies: {
        play: 'game'
      }
    }
  },
  methods: {
  }
}
</script>

<style>
</style>

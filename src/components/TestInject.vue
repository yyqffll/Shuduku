<template>
  <div></div>
</template>

<script>
export default {
  inject: ['say'],
  beforeMount () {
    // console.log('111')
  },
  mounted () {
    this.say()
  }
}
</script>

<style>
</style>

<template>
  <div>
    <input v-bind="$attrs" type="text" class="input" :value="value" @input="changeVal" />
  </div>
</template>

<script>
export default {
  name: 'Input',
  inheritAttrs: false,
  props: {
    value: ''
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    changeVal (e) {
      this.$emit('input', e.target.value)
      this.$emit('input2', e.target.value)
    }
  }
}
</script>

<style>
</style>

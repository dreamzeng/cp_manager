<template>
  <div class="components-container">
    <div>
      <Tinymce :height=200 ref="editor" v-model="content"></Tinymce>
    </div>
  </div>
</template>

<script>
    import Tinymce from 'components/Tinymce';

    export default {
      components: { Tinymce },
      data() {
        return {
          content: 'Tinymce'
        }
      }
    };
</script>

<style scoped>

</style>

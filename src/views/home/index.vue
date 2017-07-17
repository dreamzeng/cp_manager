<<template>
   <div class="app-container">
    <div class="wrapper">
      <code>
         当前用户：{{userName}}
    </code>
    </div>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default {
      name: 'home',
      data() {
        return {
         
        }
      },
      computed: {
        ...mapGetters([
          'userName'
        ])
      },
      mounted(){
       
      }
    }
</script>

<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item">
      <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1' to="" class="no-redirect">{{item.meta.title}}</router-link>
      <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
    export default {
      created() {
        this.getBreadcrumb()
      },
      data() {
        return {
          levelList: null
        }
      },
      methods: {
        getBreadcrumb() {
          let matched = this.$route.matched.filter(item=>item.meta.title);
          const first = matched[0];
          if (first && (first.meta.title !== '首页' || first.path !== '')) {
            matched = [{ path: '/',meta: {  title: '首页'} }].concat(matched)
          }
          this.levelList = matched;
        }
      },
      watch: {
        $route() {
          this.getBreadcrumb();
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-levelbar.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 10px;
        .no-redirect{
          color: #97a8be;
          cursor:text;
        }
    }
</style>

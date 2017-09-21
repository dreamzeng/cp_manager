<template>
  <div class="app-container calendar-list-container">

    <div class="headRight">
      <router-link :to="{name: 'article_add'}">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加</el-button>
      </router-link>
      <el-button type="danger" icon="delete" @click="handleDeleteAll">批量删除</el-button>
    </div>

    <!-- 搜索开始 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item class="el-form-item-rest" label="频道识别码" >
            <el-select clearable class="filter-item" v-model="channelMap.parent_code" placeholder="彩种" @change="selectChange">
              <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select>
            <el-select clearable class="filter-item" v-model="listQuery.channel_code" placeholder="频道识别码">
              <el-option v-for="item in  channelOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 列表开始 -->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column  align="center" label="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 分页结束 -->


  </div>
</template>

<script>
    import {channelList} from 'api/channel'
    import {lotteryList} from 'api/lottery'

    import {articleList,articleDel,articleDelBatch} from 'api/article'

    export default {
      name: 'article',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            channel_code:''
          }, 
          formParam: {
            id: undefined,
            code:'', //频道识别码
            name: '', //频道名称
            parentCode: '', //彩种识别码
            parentName: '',//彩种名称
            sort:''//排序
          },
          rules: {
            parentCode:[
                {required: true, message: '请选择彩种', trigger: 'change'}
            ],
            code:[{required: true, message: '请输入频道识别码', trigger: 'blur' }],
            parentName:[{required: true, message: '请输入频道名称', trigger: 'blur' }],
            name:[{required: true, message: '请输入彩种名称', trigger: 'blur' }],
            sort:[{required: true, message: '请输入排序', trigger: 'blur' }]
          },
          channelMap:{
            parent_code:'',
            channel_code:''
          },
          calendarTypeOptions:null, //彩种
          channelOptions:null,//频道识别码
          textMap: {
            update: '编辑',
            create: '创建'
          },
          ids:null
        }
      },
      created() {
       this.lotteryList();
      },
      methods: {
        //获取数据列表
        getList() {
          this.listLoading = true;
          articleList(this.listQuery).then(response => {
            let res = response.data;
            this.list = null;
            this.total = 0;
            if(res.code == 1){
              this.list = res.data && res.data.list;
              this.total = res.data && res.data.total;
            }
            this.listLoading = false;
          })
        },
        //获取采种数据
        lotteryList(){
          let lotterList = lotteryList().then(response=>{
              let res = response.data;
              if(res.code == 1){
                let temp = [],list = res.data.list;
                for(let i = 0,l = list.length;i < l;i++){
                    temp.push({
                      key:list[i]['code'],
                      display_name:list[i]['name']
                    })
                }
                this.calendarTypeOptions = temp;
                if(this.calendarTypeOptions.length > 0 ){
                  this.channelMap.parent_code = this.calendarTypeOptions[0]['key']
                }
              }
          });
        },
        //获取频道信息
        getChannelOptions(options={},cb=()=>{}){
            this.channelOptions=[];
            this.listQuery.channel_code = '';
            let _this = this;
            channelList(options).then(response => {
                let res = response.data;
                if(res.code == 1){
                    let temp = [],list = res.data.list;
                    for(let i = 0,l = list.length;i < l;i++){
                        temp.push({
                        key:list[i]['code'],
                        display_name:list[i]['name']
                        })
                    }
                    _this.channelOptions = temp;
                    if(_this.channelOptions.length > 0 ){
                        _this.listQuery.channel_code = _this.channelOptions[0]['key'];
                        cb();
                    } 
                }
            })
        },
        // 当数据发生改变时 更新列表
        selectChange(val){
            this.getChannelOptions({parent_code:val},()=>{this.getList()});
        },
        //查询
        handleFilter() {
          this.getList();
        },
        //分页信息
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        //分页信息
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },

        //更新
        handleUpdate(row) {
          this.$router.push({name: 'article_edit', params: { id: row.id}});
        },

         // 删除
        handleDelete(row) {
            let _this = this;
            this.$confirm('确认删除 ID：'+row.id+'？', '确定删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              articleDel(row.id).then(response=>{
                 _this.getList();
                    let res = response.data;
                    if(res.code == 1){
                      _this.$notify({
                        title: '成功',
                        message: res.message,
                        type: 'success',
                        duration: 2000
                      });
                    }
              });
            }).catch(() => {

            });
        },
        handleDeleteAll() {
            let _this = this;
            let ids = this.ids;
            if(ids==null||ids==''){
              this.$message.error('请选择要删除的项目！');
               return;
            }
            this.$confirm('确认删除 ID：'+ids+'？', '确定删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              articleDelBatch(ids).then(response=>{
                 _this.getList();
                    let res = response.data;
                    if(res.code == 1){
                      this.ids = null;
                      _this.$notify({
                        title: '成功',
                        message: res.message,
                        type: 'success',
                        duration: 2000
                      });
                    }
              });
            }).catch(() => {

            });
        },
        handleSelectionChange(items) {
          let ids = [];
          for(let i=0,l=items.length;i<l;i++){
            ids.push(items[i]['id']);
          }
          this.ids = ids.join(',');
        }
      }
    }
</script>
<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索开始 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item class="el-form-item-rest" label="彩种">
            <el-select clearable class="filter-item" v-model="listQuery.parent_code" placeholder="彩种">
              <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select>
        </el-form-item>
        
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 列表开始 -->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" label="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="频道识别码">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="频道名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="彩种识别码">
        <template scope="scope">
          <span>{{scope.row.parentCode}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="彩种名称">
        <template scope="scope">
          <span>{{scope.row.parentName}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime}}</span>
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
    <!-- 搜索结束 -->

    <!-- 信息编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="tiny">
      <el-form class="small-space" :model="formParam" :rules="rules" ref="formParam" label-position="left" label-width="120px">
        <el-form-item label="彩种识别码" prop="parentCode">
          <el-select clearable class="filter-item" filterable  v-model="formParam.parentCode" placeholder="彩种识别码">
              <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="频道识别码" prop="code">
          <el-input v-model="formParam.code"></el-input>
        </el-form-item>
        <el-form-item label="频道名称" prop="name">
          <el-input v-model="formParam.name"></el-input>
        </el-form-item>
        <el-form-item label="彩种名称" prop="parentName">
          <el-input v-model="formParam.parentName"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formParam.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('formParam')">确 定</el-button>
        <el-button v-else type="primary" @click="update('formParam')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import {channelList,channelAdd,channelUpdate,channelDel} from 'api/channel'
    import {lotteryList} from 'api/lottery'

    export default {
      name: 'channel',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            parent_code:''
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
          calendarTypeOptions:null, //彩种
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          }
        }
      },
      created() {
        this.getLottery();
      },
      methods: {
        //获取数据列表
        getList() {
          this.listLoading = true;
          channelList(this.listQuery).then(response => {
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
        getLottery(){
          lotteryList().then(response=>{
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
                  this.listQuery.parent_code = this.calendarTypeOptions[0]['key']
                  this.getList();
                }
              }
          })       
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
        //创建
        handleCreate() {
          this.resetFormParam();
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
        },
        //更新
        handleUpdate(row) {
          this.formParam = Object.assign({}, row);
          let temp = this.formParam.time;
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        },
        create(formName) {
          let _this = this;
          this.$refs[formName].validate(function(valid){
              if (valid) {
                  channelAdd(_this.formParam).then(response=>{
                    _this.getList();
                    let res = response.data;
                    if(res.code == 1){
                        _this.dialogFormVisible = false;
                        _this.$notify({
                          title: '成功',
                          message: res.message,
                          type: 'success',
                          duration: 2000
                        });
                    }
                })
              }
          })          
        },
        update(formName) {
          let _this = this;
          this.formParam.updateTime && delete this.formParam.updateTime;
          this.$refs[formName].validate(function(valid){
              if (valid) {
                  channelUpdate(_this.formParam).then(response=>{
                    _this.getList();
                    let res = response.data;
                    if(res.code == 1){
                        _this.dialogFormVisible = false;
                        _this.$notify({
                          title: '成功',
                          message: res.message,
                          type: 'success',
                          duration: 2000
                        });
                    }
                })
              }
          })  
        },
         // 删除
        handleDelete(row) {
            let _this = this;
            this.$confirm('确认删除 ID：'+row.id+'？', '确定删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              channelDel(row.id).then(response=>{
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
        resetFormParam() {
          this.formParam = {
            id: undefined,
            code:'', //频道识别码
            name: '', //频道名称
            parentCode: '', //彩种识别码
            parentName: '',//彩种名称
            sort:''//排序
          };
        },
        timeChang(val) {
            this.formParam.time = val;
        }
      }
    }
</script>
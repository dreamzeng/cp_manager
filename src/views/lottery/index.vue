<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">刷新</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" label="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="彩种识别码">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="图标">
        <template scope="scope">
           <img alt="" :src="scope.row.pic" style="width: 42px;height: 42px;margin:5px 0;">
        </template>
      </el-table-column>
      <el-table-column  align="center" label="种类">
        <template scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="是否显示">
        <template scope="scope">
          <el-tag
          :type="scope.row.display  ? 'success' : 'danger' || '' "
          close-transition>{{scope.row.display}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="最近一期开奖号码" width="150">
        <template scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="最近一期开奖时间" width="150">
        <template scope="scope">
          <span>{{scope.row.openTime}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="tiny">
      
      <el-form class="small-space" :model="formParam" :rules="rules" ref="formParam" label-position="left" label-width="120px">
        <el-form-item label="彩种识别码" prop="code">
          <el-input v-model="formParam.code"></el-input>
        </el-form-item>
        <el-form-item label="彩种名称" prop="name">
          <el-input v-model="formParam.name"></el-input>
        </el-form-item>
        <el-form-item label="彩种图标">
          <el-upload class="upload-demo" :action="uploadApi"
                      :file-list="fileList"
                      :headers="headers"
                      :on-remove="handleRemove"
                      :before-upload="beforeAvatarUpload"
                      :on-change="handleChange"
                      list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件（上传图片大小不能超过 2MB!）</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="彩种种类" prop="type">
          <el-input v-model="formParam.type"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch 
          on-text="是"
          off-text="否"
          v-model="state"
          on-value="true"
          off-value="false">
          </el-switch>
        </el-form-item>
        <el-form-item label="开奖号码" prop="number">
          <el-input v-model="formParam.number"></el-input>
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
    import {lotteryList,lotteryAdd,lotteryUpdate} from 'api/lottery'
    import { uploadApi } from 'utils';

    export default {
      name: 'lottery',
      data() {
        return {
          state:'true',
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20
          },
          formParam: {
            id: undefined,
            code:'', //彩种识别码
            name: '', //彩种名称
            pic: '', //彩种图标
            type: '', //彩种种类
            display:'1', //是否显示
            number:'', //最近一期开奖号码
            sort:'' //在列表中的顺序
          },
          rules: {
            code:[
                {required: true, message: '请输入彩种识别码', trigger: 'change'}
            ],
            name:[{required: true, message: '请输入彩种名称', trigger: 'blur' }],
            type:[{required: true, message: '请输入彩种种类', trigger: 'blur' }],
            number:[{required: true, message: '请输入最近一期开奖号码', trigger: 'blur' }],
            sort:[{required: true, message: '请输入排序顺序', trigger: 'blur' }]
          },
          calendarTypeOptions:null, //彩种
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          uploadApi:'',
          headers:{},
          fileList: []
        }
      },
      created() {
        this.getList();
        this.uploadApi = uploadApi();
        let token = this.$store.getters.token;
        this.headers = {token};
      },
      methods: {
        //获取数据列表
        getList() {
          this.listLoading = true;
          lotteryList(this.listQuery).then(response => {
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
          this.fileList = [];
          this.formParam = Object.assign({}, row);
          this.formParam.openTime && delete this.formParam.openTime;
          this.formParam.updateTime && delete this.formParam.updateTime;
          this.formParam.createTime && delete this.formParam.createTime;
          this.formParam.sort = this.formParam.sort+'';
          this.state = this.formParam.display+'';
          if(this.formParam.pic != ''){
            this.fileList.push({
              name:'pic',
              url:this.formParam.pic
            });
          }
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        },
        create(formName) {
          let _this = this;
          this.formParam['display'] = this.state;
          this.$refs[formName].validate(function(valid){
              if (valid) {
                  lotteryAdd(_this.formParam).then(response=>{
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
          this.formParam['display'] = this.state;
          if(this.formParam.pic == '' && this.fileList.length>0){
            this.formParam.pic = this.fileList[0];
          }
          this.$refs[formName].validate(function(valid){
              if (valid) {
                  lotteryUpdate(_this.formParam).then(response=>{
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
        resetFormParam() {
          this.fileList = [];
          this.formParam =  {
            id: undefined,
            code:'', //彩种识别码
            name: '', //彩种名称
            pic: '', //彩种图标
            type: '', //彩种种类
            display:'1', //是否显示
            number:'', //最近一期开奖号码
            sort:'' //在列表中的顺序
          };
        },
        handleRemove(file, fileList) {
          this.fileList = fileList;
          this.formParam.pic = '';
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt12M = file.size / 1024 / 1024 < 12;

          if (!isJPG && !isPNG) {
              this.$message.error('上传图片只能是 JPG,PNG 格式!');
              return false;
          }
          if (!isLt12M) {
              this.$message.error('上传图片大小不能超过 2MB!');
              return false;
          }
          return true;
        },
        handleChange(file, fileList) {
          if(file.response && file.response.code !=1){
              this.$message.error(file.response.msg);
              let _l = fileList.length-1;
              fileList.splice(_l, 1);
              this.fileList = fileList;
              return;
          }
          if(file.response && file.response.code == 1){
            this.formParam.pic = file.response.data;
            if(fileList.length > 1){
              fileList.splice(0, 1);
            }
          }
        }
      }
    }
</script>
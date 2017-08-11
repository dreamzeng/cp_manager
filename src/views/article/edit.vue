<template>
  <div class="components-container">
    <el-form class="small-space" :model="formParam" :rules="rules" ref="formParam" label-position="left" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formParam.title" ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-rest" label="频道识别码" prop="channelCode">
            <el-select clearable class="filter-item" v-model="channelMap.parent_code" placeholder="彩种" @change="selectChange">
              <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select>
            <el-select clearable class="filter-item" v-model="formParam.channelCode" placeholder="频道识别码">
              <el-option v-for="item in  channelOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="频道名称" prop="channelName">
          <el-input v-model="formParam.channelName"></el-input>
        </el-form-item>
       <el-form-item label="文章内容" prop="content">
        <Tinymce :height=200 ref="editor" v-model="formParam.content"></Tinymce>
       </el-form-item>

       <el-form-item>
        <el-button type="primary" @click="create('formParam')">提交</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import Tinymce from 'components/Tinymce';
    import {channelList} from 'api/channel';
    import {lotteryList} from 'api/lottery';
    import {articleAdd} from 'api/article'

    export default {
      components: { Tinymce },
      data() {
        return {
          formParam: {
            id: undefined,
            title:'', //文章标题
            channelCode: '', //频道识别码
            channelName: '', //彩种名称+频道名称
            content: ''//文章内容
          },
          rules: {
            title:[
                {required: true, message: '请输入标题', trigger: 'blur'}
            ],
            channelCode:[{required: true, message: '请选择', trigger: 'change' }],
            channelName:[{required: true, message: '请输入频道名称', trigger: 'blur' }],
            content:[{required: true, message: '文章内容', trigger: 'blur' }]
          },
          channelMap:{
            parent_code:''
          },
          calendarTypeOptions:null, //彩种
          channelOptions:null,//频道识别码
        }
      },
      created() {
        this.channelList();
      },
      methods: {
        //获取采种数据
        channelList(){
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
            this.formParam.channelCode = '';
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
                        _this.formParam.channelCode = _this.channelOptions[0]['key'];
                        cb();
                    } 
                }
            })
        },
        // 当数据发生改变时 更新列表
        selectChange(val){
            this.getChannelOptions({parent_code:val});
        },
        create(formName) {
          let _this = this;
          this.$refs[formName].validate(function(valid){
              if (valid) {
                  articleAdd(_this.formParam).then(response=>{
                    let res = response.data;
                    if(res.code == 1){
                        _this.dialogFormVisible = false;
                        _this.$notify({
                          title: '成功',
                          message: res.message,
                          type: 'success',
                          duration: 2000
                        });
                       _this.back();   
                    }
                })
              }
          })          
        },
        back:function(){
            this.$router.go(-1);
        }
      }
    };
</script>

<style scoped>

</style>

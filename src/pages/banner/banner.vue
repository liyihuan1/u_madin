<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 列表 -->
    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
    <!-- 弹框 -->
    <v-add :info="info" @init="init" :list="list" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import {reqbannerList} from "../../utils/http"
export default {
  components:{
    vList,
    vAdd
  },
  data(){
    return{
      info:{
        isshow:false,
        isadd:true //是添加还是修改

      },
      list:[]
    };
  },
  methods:{
    willAdd(){
      this.info.isshow = true;
      //是添加
      this.info.isadd = true
    },
    //列表
    init(){
      reqbannerList().then(res =>{
        if(res.data.code == 200){
          this.list = res.data.list
        }
      })
    },
    //编辑
    edit(id){
      //弹框出现
      this.info.isshow = true;
      //触发子组件的getOne方法
      this.$refs.add.getOne(id);
      //是修改
      this.info.isadd = false
    }
  },
  mounted(){
    //获取list
    this.init()
  }
}
</script>

<style>

</style>
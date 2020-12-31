<template>
  <div>
      <!-- 表格 -->
      <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
      <!-- 弹框 -->
      <v-add :info="info" @init="init" :list="list" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue" 
import {reqmemberlist} from "../../utils/http"
export default {
  components:{
    vList,
    vAdd
  },
  data(){
    return{
      info:{
        isshow:false,
        //用来判断是添加还是编辑打开的摊弹框
        isadd:true
      },
      list:[]
    };
  },
  methods:{
    init(){
        reqmemberlist().then(res =>{
        if(res.data.code == 200){
          this.list = res.data.list
        }
      })
    },
    edit(id){
      //出现弹框
      this.info.isshow = true;
      //调用add子组件方法
      this.$refs.add.getOne(id)
      //是编辑
      this.info.isadd = false;
    }
  },
  mounted() {
      this.init()
  }
}
</script>

<style>

</style>
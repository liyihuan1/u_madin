<template>
  <div>
    <!-- 1.拆分组件，并绘制静态页 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 数据展示表格 -->
    
    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>

    <!-- 添加弹框 -->
    
    <v-add :info="info" @init="init" :list="list" ref="add"></v-add>

    <!-- 一、分页
    page-size 每一页的数量
    current-change	currentPage 改变时会触发
     -->
    <el-pagination
    layout="prev, pager, next"
    :total="total"
    :page-size="pageSize"
    @current-change="changePage"
    >
  </el-pagination>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import { reqMenulist, reqRolelist, reqManagelist, reqManageCount } from "../../utils/http";
export default {
  components: {
    vList,
    vAdd
  },
  data() {
    return {
      info: {
        isshow: false,
      
        isadd:true
      },
      
      list: [],



      //一页的数量
      pageSize:2,
      //总数
      total:0,
      //当前页面
      page:1
    };
  },
  methods: {


    getTotal(){
      reqManageCount().then(res=>{
        if(res.data.code==200){
          this.total=res.data.list[0].total
        }
      })
    },

    //列表
    getList(){
      reqManagelist({page:this.page,size:this.pageSize}).then(res => {
        if (res.data.code == 200) {

          /*
          如果删除了最后一页的最后一条，那么当前页就会取到空数组；
          这个时候如果有上一页的话，就应该取上一页
          */
          if(res.data.list.length==0&&this.page>1){
            this.page--
            this.getList()
            return
          }


          this.list = res.data.list;
        }
      });
    },
   
    //获取列表
    init() {
      //获取总数
      this.getTotal();

      //获取列表
      this.getList()
    },
    // 修改了页码
    changePage(e){
      this.page=e;
      //再次取list
      this.getList()
    },


    willAdd() {
      this.info.isshow = true;
      //是添加
      this.info.isadd=true
    },
    //编辑触发
    edit(id){
      //弹框出现
      this.info.isshow=true;

      //是编辑
      this.info.isadd=false

      //触发add的getOne()
      this.$refs.add.getOne(id)
    }
  },
  mounted() {
    //获取list
    this.init();

    
  }
};
</script>

<style>
</style>
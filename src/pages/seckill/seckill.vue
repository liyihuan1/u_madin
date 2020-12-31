<template>
  <div>
      <el-button type="primary" @click="willAdd">添加</el-button>
        <!-- 列表 -->
        <v-list @edit="edit"></v-list>
        <!-- 弹框 -->
        <v-add :info="info" ref="add"></v-add>
  </div>
</template>
  <script>
import { mapActions, mapGetters } from "vuex";
import vList from "./components/list.vue";
import vAdd from "./components/add.vue"
export default {
    components:{
        vList,
        vAdd
    },
  data() {
    return {
        info:{
            isshow:false,
            isadd:true
        }
    };
  },
  computed: {
    ...mapGetters({
      list: "cate/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList"
    }),
    //点了添加
    willAdd(){
      this.info.isshow=true;
      this.info.isadd=true
    },
    //编辑
    edit(id){
      this.info.isshow=true;
      this.info.isadd=false 
      this.$refs.add.getOne(id)
    }
  },
  mounted() {}
};
</script>

  <style scoped>
</style>
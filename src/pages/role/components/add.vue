<template>
  <div>
    <!-- 绑定closed  -->
    <el-dialog :title="info.isadd?'添加角色':'编辑角色'" :visible.sync="info.isshow" @closed="cancel">
      <!--数据绑定到页面 -->
      <el-form :model="user">
        
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色权限" label-width="100px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children: 'children',label: 'title'}"
          ></el-tree>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isadd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqRoleAdd,  reqMenulist, reqRoleDetail, reqRoleUpdate } from "../../../utils/http";
import { successalert } from "../../../utils/alert";
import { mapActions, mapGetters } from "vuex";
export default {
 
  props: ["info", "list"],
  data() {
    return {
      //树形控件的数据
      menuList:[],
      //初始化user
      user: {
        rolename:"",
        menus:"",
        status:1
      },
     
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  mounted(){
    // 一进来就要获取菜单列表
    reqMenulist().then(res=>{
      if(res.data.code==200){
        this.menuList=res.data.list
      }
    })
  },
  mounted(){
    reqMenulist().then(res =>{
      if(res.data.code == 200){
        this.menuList = res.data.list;
      }
    })
  },
  methods: {
    ...mapActions({
      changeUser:"changeUser"
    }),
    //点了取消
    cancel() {
      //编辑清空数据
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空user
    empty() {
      this.user = {
       rolename:"",
        menus:"",
        status:1
      };
      //树形控件要清空数据
      this.$refs.tree.setCheckedKeys([])
    },
    //添加
    add() {
      
      this.user.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      
      reqRoleAdd(this.user).then(res => {
        if (res.data.code == 200) {
          // 封装了成功弹框
          successalert(res.data.msg);
          //弹框消失
          this.cancel();
          //清空user
          this.empty();
          //列表刷新
          this.$emit("init");
        }
      });
    },
    //修改了顶级菜单
    changePid() {
      if (this.user.pid == 0) {
        this.user.type = 1;
      } else {
        this.user.type = 2;
      }
    },
    //获取详情
    getOne(id) {
      reqRoleDetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //补id
          this.user.id = id;
          //给树形控件赋值
          this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus))
        }
      });
    },
    //修改
    update(){
      //先取出属性控件的数据给menus
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleUpdate(this.user).then(res=>{
        if(res.data.code==200){
          //弹成功消息
          successalert(res.data.msg);
          //修改的是当前登录的用户就退出重新登录
          if(this.user.id == this.userInfo.roleid){
            this.changeUser({});
            this.$router.push("/login");
            return;
          }
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //刷新列表
          this.$empty("init")
        }
      });
    }
  }
};
</script>

<style>
</style>
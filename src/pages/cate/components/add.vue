<template>
  <div class="form">
    
    <el-dialog :title="info.isadd?'添加分类':'编辑分类'" :visible.sync="info.isshow" @closed="cancel">
      
     
      <el-form :model="user">
        <el-form-item label="上级分类" label-width="100px">
          <el-select v-model="user.pid">
            <el-option value label="--请选择--" disabled></el-option>
            <el-option :value="0" label="顶级分类"></el-option>
            <!-- 少一个遍历 -->
            <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.catename"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="user.catename" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片" label-width="100px" v-if="user.pid!==0">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { reqcateAdd, reqcateDetail, reqcateUpdate } from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
import {mapActions,mapGetters} from "vuex"
export default {
  // 4.接收info
  props: ["info", ],
  computed:{
    ...mapGetters({
      list:"cate/list"
    })
  },
  data() {
    return {
      //图片地址
      imgUrl: "",
      user: {
        pid: "",
        catename: "",
        img: null,
        status: 1
      }
    };
  },
  mounted() {},
  methods: {
    ...mapActions({
      "reqList":"cate/reqList"
    }),
    
    //ui上传文件
    changeImg(e){
        let file=e.raw;
        //判断
        //文件大小验证 1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        erroralert("文件大小不能超过2M");
        return;
      }

      //后缀名
      let extname = path.extname(file.name);
      let arr = [".png", ".gif", ".jpg", ".jpeg"];
      if (!arr.some(item => item === extname)) {
        erroralert("请上传图片");
        return;
      }
        this.imgUrl=URL.createObjectURL(file)
        this.user.img=file;
    },

    //取消
    cancel() {
      //编辑清空数据
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空user
    empty() {
      this.imgUrl = "";
      this.user = {
        pid: "",
        catename: "",
        img: null,
        status: 1
      };
    },
    //添加
    add() {
      reqcateAdd(this.user).then(res => {
        if (res.data.code == 200) {
          // 成功弹框
          successalert(res.data.msg);
          //弹框消失
          this.cancel();
          //清空user
          this.empty();
          //刷新
          this.reqList()
        }
      });
    },

    //获取详情
    getOne(id) {
      reqcateDetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //补id
          this.user.id = id;
          //处理图片
          this.imgUrl = this.$pre + this.user.img;
        }
      });
    },
    //修改
    update() {
      reqcateUpdate(this.user).then(res => {
        if (res.data.code == 200) {
          //弹成功
          successalert(res.data.msg);
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //刷新list
          this.reqList()
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus">
// 穿透 
.form >>>.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
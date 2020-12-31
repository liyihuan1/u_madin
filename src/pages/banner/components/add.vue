<template>
  <div class="form">
    <el-dialog :title="info.isadd?'添加分类':'编辑分类'" :visible.sync="info.isshow" @closed="cancel">
      {{user}}
      <el-form :model="user">
        <el-form-item label="标题" label-width="100px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片" label-width="100px">
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
import { reqbannerAdd, reqbannerDetail, reqbannerUpdata } from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";

export default {
  props: ["info", "list"],
  data() {
    return {
      //图片地址
      imgUrl: "",
      //3.初始化user
      user: {
        title: "",
        img: null,
        status: 1
      }
    };
  },
  methods: {
    changeImg(e) {
      let file = e.raw;
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
      this.imgUrl = URL.createObjectURL(file);
      this.user.img = file;
    },
    //清空输入框
    empty() {
      this.imgUrl = "";
      this.user = {
        title: "",
        img: null,
        status: 1
      };
    },
    //   弹框消失
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //添加
    add() {
      reqbannerAdd(this.user).then(res => {
        if (res.data.code == 200) {
          //弹成功提示框
          successalert(res.data.msg);
          //弹框消失
          this.cancel();
          //清空输入框
          this.empty();
          //刷新列表
          this.$emit("init");
        }
      });
    },
    //一条详情
    getOne(id) {
      reqbannerDetail({ id: id }).then(res => {
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
      reqbannerUpdata(this.user).then(res => {
        if (res.data.code == 200) {
          //弹成功消息
          successalert(res.data.msg);
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //刷新数据
          this.$emit("init");
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus">
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
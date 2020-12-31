<template>
  <div>
    <el-dialog :title="info.isadd?'添加商品':'编辑商品'" :visible.sync="info.isshow" @closed="cancel">
      <el-form :model="user">
        <div>user:{{user}}</div>
        <div>value1:{{value1}}</div>

        <el-form-item label="活动名称" label-width="100px">
          <el-input v-model="user.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="100px">
          <template>
            <div class="block">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
              ></el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="一级分类" label-width="100px">
          <el-select v-model="user.first_cateid" @change="changeFirstCateId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="100px">
          <el-select v-model="user.second_cateid" @change="changeSecondCateId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="100px">
          <el-select v-model="user.goodsid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in threeCateList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
import { mapActions, mapGetters } from "vuex";
import {
  reqcatelist,
  reqgoodslist,
  reqseckilladd,
  reqseckilldetail,
  reqseckillupdate
} from "../../../utils/http";
import { successalert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      //二级分类列表
      secondCateList: [],
      //三级分类列表
      threeCateList: [],
      value1: []
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      seckilllist: "seckill/list"
    })
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqList",
      reqList: "seckill/reqList"
    }),
    // 修改一级分类
    changeFirstCateId() {
      //二级分类选中的要清除
      this.user.second_cateid = "";

      this.getSecondList();
    },
    getSecondList() {
      reqcatelist({ pid: this.user.first_cateid }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          this.secondCateList = res.data.list;
        }
      });
    },
    // //修改二级分类
    changeSecondCateId() {
      this.user.goodsid = "";

      this.getTreeList();
    },
    getTreeList() {
      reqgoodslist({
        fid: this.user.first_cateid,
        sid: this.user.second_cateid
      }).then(res => {
        if (res.data.code == 200) {
          this.threeCateList = res.data.list;
        }
      });
    },
    //取消
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    // 清空
    empty() {
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      };
      this.secondCateList=[],
      //三级分类列表
      this.threeCateList=[],
      this.value1=[]
    },
    //添加
    add() {
      this.user.begintime = this.value1[0];
      this.user.endtime = this.value1[1];
      reqseckilladd(this.user).then(res => {
        //1.弹框消失
        this.cancel();
        //2.数据清空
        this.empty();
        //3.弹成功
        successalert(res.data.msg);
        //刷新
        this.reqList();
      });
    },
    //获取一条数据
    getOne(id) {
      this.value1[0] =this.user.begintime;
      this.value1[1]= this.user.endtime;
      reqseckilldetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //重新获取二级分类的list
          this.getSecondList();
          //重新获取三级分类的list
          this.getTreeList();
          //补id
          this.user.id = id;
        }
      });
    },
    //修改
    update() {
       this.user.begintime = this.value1[0];
        this.user.endtime = this.value1[1];
      reqseckillupdate(this.user).then(res => {
        if (res.data.code == 200) {
          //1.弹框消失
          this.cancel();
          //2.数据清空
          this.empty();
          //3.弹成功
          successalert(res.data.msg);
          //4.刷新list
          this.reqList();
        }
      });
    }
  },
  mounted() {
    if (this.cateList.length === 0) {
      this.reqCateList();
    }
  }
};
</script>

  <style scoped>
</style>
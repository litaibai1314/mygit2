<template>
  <div @keyup.enter="enterHandel">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" class="addrole">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserlist">
            <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showdialog">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="tables" border style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope">
            <el-button type="primary" @click="updataTable(scope.row.id)">修改</el-button>
            <el-button type="danger" @click="delTable(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
        <!-- 表单项 -->
        <el-form ref="formr" :model="addForm" label-width="70px" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="changeSize"
        @current-change="changeCurrent"
        class="fenye"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1,2,5,10]"
        :current-page="queryInfo.pagenum"
      ></el-pagination>
    </el-card>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules=" addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      editDialogVisible: false,
      total: 0,
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },

      tables: [],
      addForm: {
        username: "",
        email: "",
        password: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { trigger: "blur" }
        ],
        role: [
          { required: true, message: "请输入权限", trigger: "blur" },
          { trigger: "blur" }
        ]
      },
      editForm: {}
    };
  },
  methods: {
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.tables = res.data.users;
      this.total = res.data.total;
    },
    showdialog() {
      this.dialogVisible = true;
      this.$refs.formr.resetFields();

      // this.addForm = null;
    },
    addDialogVisible() {
      this.$refs.formr.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);

        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败！");
        }
        console.log(res);
        this.$message.success("添加用户成功！");
        this.dialogVisible = false;
        this.getUserlist();
      });
    },
    // dianji修改按钮
    async updataTable(id) {
      this.editDialogVisible = true;
      // this.$refs.editFormRef.resetFields();
      const { data: res } = await this.$http.get("users/" + id);

      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }

      this.editForm = res.data;
    },
    // 点击确定修改按钮
    async editUserInfo() {
      const { data: res } = await this.$http.put("users/" + this.editForm.id, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      });

      if (res.meta.status !== 200) {
        return this.$message.error("更新用户信息失败！");
      }

      // 关闭对话框
      this.editDialogVisible = false;
      // 刷新数据列表
      this.getUserlist();
      // 提示修改成功
      this.$message.success("更新用户信息成功！");
    },
    async delTable(id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      if (result == "confirm") {
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status == 200) {
          this.$message.success("删除成功了");
        }
        this.getUserlist();
      }
    },
    //显示数目改变
    changeSize(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserlist();
    },
    //当前页面改变
    changeCurrent(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.getUserlist();
    },
    enterHandel() {
      if (this.queryInfo.query.trim() == "") {
        this.getUserlist();
      }
    }
  },
  created() {
    this.getUserlist();
  }
};
</script>
<style lang="less" scoped>
.addrole {
  margin: 20px 0;
}
.fenye {
  margin-top: 20px;
}
</style>
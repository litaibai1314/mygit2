<template>
  <div class="home">
    <el-container>
      <el-header>
        Header
        <el-button type="info" class="btn" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="iscollapse?'64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>

          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#002b36"
            text-color="#fff"
            active-text-color="red"
            router
          >
            <!-- 一级列表 -->
            <el-submenu :index="item1.id+''" v-for="item1 in menulist " :key="item1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item-group>
                <!-- 二级列表 -->

                <el-menu-item
                  :index="'/'+item2.path"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item2.authName}}</span>
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iscollapse: false,
      menulist: [],

      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    // this.handel();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    handel() {
      this.$router.push("/users");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      this.$message.success(res.meta.msg);
      console.log(res);
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="less" scoped>
.home,
.el-container {
  height: 100%;
}
.el-header,
.el-footer {
  position: relative;
  background-color: #002b36;
  color: #fff;
  text-align: center;
  line-height: 60px;
  .btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer !important;
  }
}

.el-aside {
  background-color: #002b36;
  color: #fff;
  text-align: center;
  line-height: 200px;
  height: 100%;
  .toggle-button {
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 15px;
    letter-spacing: 0.5em;
    cursor: pointer;
    color: blue;
  }
  // 菜单
  .el-menu {
    border: 0;
    // 二级菜单
    .el-menu-item-group {
      font-size: 15px;
      padding-left: 20px;
    }
  }
}
</style>

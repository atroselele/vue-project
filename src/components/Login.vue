<template>
  <div class="login">
    <div id="login-banner">
      <img class="bgImg" :src="bgImg" alt="" />
      <div class="form-login">
        <div class="loginBox-heard">
          <div class="loginBox-heard-headPortrait">
            <div><img :src="download" alt="" /></div>
            <!-- <img :src="download" alt="" /> -->
          </div>
        </div>
        <div class="loginBox-form">
          <h3 class="title">电商后台管理系统</h3>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="" prop="username">
              <el-input
                ref="username"
                prefix-icon="el-icon-user-solid"
                type="text"
                v-model="ruleForm.username"
                autocomplete="off"
                placeholder="请输入用户名"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input
                ref="password"
                prefix-icon="el-icon-lock"
                type="password"
                v-model="ruleForm.password"
                autocomplete="off"
                placeholder="请输入密码"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="loginBut"
                type="primary"
                @click="submitForm('ruleForm')"
                >登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bgImg from "@/assets/login/login_bgimg.png";
import download from "@/assets/login/download.png";

export default {
  name: "Login",
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入长度在6-15之前的字符"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      bgImg,
      download,
      ruleForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch("toLogin", this.ruleForm).then(() => {
            this.$router.push({ path: "/" });
          });
          // .catch(() => {
          //   this.$message.error("账号或密码错误");
          // });
        }
      });
    },
  },
};
</script>

<style scoped lang="less" src="./style/login.less"></style>
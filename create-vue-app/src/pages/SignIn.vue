<template>
  <!-- <form class="box" action="#" method="post"> -->
  <form @submit.prevent="signIn" class="box">
    <div
      @click="$router.push('/')"
      class="changePage"
      style="font-size: 24px; color: #ff7043"
    >
      Login
    </div>
    <br />
    <div @click="$router.push('/registration')" class="changePage">
      Registration
    </div>
    <input
      v-model="formData.userName"
      class="data"
      type="text"
      placeholder="Username"
    />
    <input
      v-model="formData.password"
      class="data"
      type="password"
      placeholder="Password"
    />
    <input type="submit" value="Login" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        userName: "",
        password: "",
      },
    }
  },
  methods: {
    signIn() {
      console.log(this.formData)
    },
  },
}
</script>

<style>
.box {
  width: 300px;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0.1px 4px 8px 5px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  text-align: center;
}

.changePage {
  font-size: 20px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.5);
  transition: 0.5s;
  cursor: pointer;
}

.changePage:hover {
  transform: scale(1.1);
}

.data {
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 14px 10px;
  width: 200px;
  outline: none;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  transition: 0.25s;
}

.data:focus {
  width: 280px;
  border-color: #2ecc71;
}

.box input[type="submit"] {
  font-weight: 700;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #2ecc71;
  padding: 14px 40px;
  outline: none;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}

.box input[type="submit"]:hover {
  background: #2ecc71;
  color: #17202a;
}
</style>

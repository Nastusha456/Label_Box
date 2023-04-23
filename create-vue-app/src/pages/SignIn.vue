<template>
  <Form @submit="signIn" class="box">
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
    <Field
      name="user_name"
      class="data"
      type="text"
      placeholder="User name"
      :rules="validateUserName"
    />
    <ErrorMessage name="user_name" class="error" />
    <Field
      name="password"
      class="data"
      type="password"
      placeholder="Password"
      :rules="validatePassword"
    />
    <ErrorMessage name="password" class="error" />
    <input type="submit" value="Login" />
  </Form>
  <button @click="GetData">Get</button>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate"
import axios from "axios"

const path = "http://10.17.17.112:5000/api/v1/classificator?format=json"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      message: {},
    }
  },
  methods: {
    GetData() {
      axios
        .get(path)
        .then((response) => {
          console.log("You received:")
          console.log(response)
          // console.log(response.data.items)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    signIn(values) {
      console.log(values)
      localStorage.setItem("accessToken", "SomeToken")
      this.$router.push("/work")

      // axios
      //   .post(path, values)
      //   .then(() => {
      //     console.log("Data sent!")
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })

      // this.GetData()
    },
    validateUserName(value) {
      if (value && value.trim()) {
        return true
      }
      return "This field is required"
    },
    validatePassword(value) {
      if (value && value.trim()) {
        return true
      }
      return "This field is required"
    },
  },
}
</script>

<style scoped>
.box {
  width: 380px;
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

.error {
  color: red;
}
</style>

<template>
  <Form @submit="registration" class="box">
    <div @click="$router.push('/')" class="changePage">Login</div>
    <br />
    <div
      @click="$router.push('/registration')"
      class="changePage"
      style="font-size: 24px; color: #ff7043"
    >
      Registration
    </div>
    <Field
      name="user_name"
      class="data"
      type="text"
      placeholder="User name"
      :rules="isRequired"
    />
    <ErrorMessage name="user_name" class="error" />
    <Field
      name="user_email"
      class="data"
      type="email"
      placeholder="User email"
      :rules="validateEmail"
    />
    <ErrorMessage name="user_email" class="error" />
    <Field
      name="password"
      class="data"
      type="password"
      placeholder="Password"
      :rules="validatePassword"
    />
    <ErrorMessage name="password" class="error" />
    <Field
      name="confirm_password"
      class="data"
      type="password"
      placeholder="Confirm Password"
      :rules="validateConfirmPassword"
    />
    <ErrorMessage name="confirm_password" class="error" />
    <input type="submit" value="Register" />
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate"
import axios from "axios"
import CryptoJS from "crypto-js"
import { mapMutations, mapGetters } from "vuex"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      minPasswordLength: 3,
      password: "",
    }
  },
  methods: {
    ...mapMutations(["setUserData"]),
    ...mapGetters(["getUserData", "getRegistrationPath"]),

    registration(values) {
      const registrationPath = this.getRegistrationPath()

      const hashedPassword = CryptoJS.MD5(
        values.password + "Qit7mef"
      ).toString()

      const userData = values
      userData.password = hashedPassword

      axios
        .post(registrationPath, userData)
        .then(() => {
          console.log("Data sent!")
        })
        .catch((error) => {
          console.log(error)
        })

      this.setUserData(userData)
      // const DATA = this.getUserData()
      // console.log(DATA)

      localStorage.setItem("accessToken", "SomeToken")
      // this.$router.push("/work")
    },
    isRequired(value) {
      if (value && value.trim()) {
        return true
      }
      return "This field is required"
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return "This field is required"
      }
      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
      if (!regex.test(value)) {
        return "This field must be a valid email"
      }
      // All is good
      return true
    },
    validatePassword(value) {
      if (value && value.trim()) {
        if (value.length < this.minPasswordLength) {
          return `Minimum password length is ${this.minPasswordLength}, currently ${value.length}`
        }
        this.password = value.trim()
        return true
      }
      return "This field is required"
    },
    validateConfirmPassword(value) {
      if (value && value.trim()) {
        if (value != this.password) {
          return "Passwords must match"
        }
        this.password = value.trim()
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

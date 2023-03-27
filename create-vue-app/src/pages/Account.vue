<template>
  <div class="box">
    <div>
      <img src="@/images/user-100.png" alt="User image" />
      <div @click="openNameForm" class="text">
        User name: <span>{{ this.userName }}</span>
      </div>
      <div @click="openEmailForm" class="text">
        User email: <span>{{ this.userEmail }}</span>
      </div>
    </div>
    <div>
      <div v-if="passwordBtn" @click="openPasswordForm" class="btn">
        Change password
      </div>
      <!-- ------------------------------- -->
      <Form v-if="nameFormIsVisible" @submit="changeName">
        <Field
          name="user_name"
          class="data"
          type="text"
          placeholder="User name"
          :rules="isRequired"
        />
        <ErrorMessage name="user_name" class="error" />
        <input type="submit" value="Change name" class="btn" />
      </Form>
      <Form v-if="emailFormIsVisible" @submit="changeEmail">
        <Field
          name="user_email"
          class="data"
          type="email"
          placeholder="User email"
          :rules="validateEmail"
        />
        <ErrorMessage name="user_email" class="error" />
        <input type="submit" value="Change email" class="btn" />
        <!-- ------------------------------- -->
      </Form>
      <Form v-if="passwordFormIsVisible" @submit="changePassword">
        <Field
          name="currentPassword"
          class="data"
          type="password"
          placeholder="currentPassword"
          :rules="validateCurrentPassword"
        />
        <ErrorMessage name="currentPassword" class="error" />
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
        <input type="submit" value="Change" class="btn" />
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      currentPassword: "currentPassword",
      userName: "userName",
      userEmail: "userEmail",
      minPasswordLength: 7,
      password: "",
      nameFormIsVisible: false,
      emailFormIsVisible: false,
      passwordFormIsVisible: false,
      passwordBtn: true,
    }
  },
  methods: {
    openNameForm() {
      this.nameFormIsVisible = true
      this.passwordBtn = false
    },
    changeName(values) {
      this.nameFormIsVisible = false
      this.passwordBtn = true
      this.userName = values.user_name
      console.log(values)
    },
    openEmailForm() {
      this.emailFormIsVisible = true
      this.passwordBtn = false
    },
    changeEmail(values) {
      this.emailFormIsVisible = false
      this.passwordBtn = true
      this.userEmail = values.user_email
      console.log(values)
    },
    openPasswordForm() {
      this.passwordFormIsVisible = true
      this.passwordBtn = false
    },
    changePassword(values) {
      this.passwordFormIsVisible = false
      this.passwordBtn = true
      console.log(values)
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
    validateCurrentPassword(value) {
      if (value && value.trim()) {
        if (value != this.currentPassword) {
          return "Incorrect password"
        }
        return true
      }
      return "This field is required"
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
img {
  width: 130px;
  height: 130px;
  border: 4px solid rgba(255, 255, 255, 0.25);
  border-radius: 100%;
  box-shadow: 3px 3px 7px;
}

.text {
  font-size: 17px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  transition: 0.5s;
  cursor: pointer;
}

.text span {
  color: rgba(255, 255, 255, 0.5);
}

.box {
  margin: 15px;
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

.btn {
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

.btn:hover {
  background: #2ecc71;
  color: #17202a;
}

.error {
  color: red;
}
</style>

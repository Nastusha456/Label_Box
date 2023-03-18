<template>
  <login-form action="sign_in">
    <div @click="$router.push('/')" style="font-size: 25px; color: #ff7043">
      Login
    </div>
    <br />
    <div @click="$router.push('/registration')">Registration</div>
    <input class="data" type="text" placeholder="Username" />
    <input class="data" type="password" placeholder="Password" />
    <input type="submit" value="Login" />
  </login-form>
</template>

<script>
export default {}
</script>

<style></style>

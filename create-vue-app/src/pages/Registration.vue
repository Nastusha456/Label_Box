<template>
  <login-form action="reg">
    <div @click="$router.push('/')">Login</div>
    <br />
    <div
      @click="$router.push('/registration')"
      style="font-size: 25px; color: #ff7043"
    >
      Registration
    </div>
    <input class="data" type="text" placeholder="Username" />
    <input class="data" type="password" placeholder="Password" />
    <input class="data" type="password" placeholder="Confirm Password" />
    <input type="submit" value="Login" />
  </login-form>
</template>

<script>
export default {}
</script>

<style></style>

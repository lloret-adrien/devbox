<template>
  <div class="ressource-card">
    <!-- <div class="img" :style="'background-image: url(https://s2.googleusercontent.com/s2/favicons?domain=' + ressource.url + ')'"></div> -->
    <div class="img" style="background-image: url(https://images.unsplash.com/photo-1554306274-f23873d9a26c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)"></div>
    <div class="container">
      <span class="name">{{ ressource.name }}</span>
      <span class="desc">{{ ressource.desc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RessourceCard',
  props: {
    ressource: Object,
  }
}
</script>

<style scoped>
.ressource-card {
  display: flex;
  flex-direction: row;
  min-width: 320px;
  min-height: 100px;
}

.ressource-card:hover {
  background-color: #80808029;
  cursor: pointer;
}

.name {
  font-size: 20px;
}

.desc {
  font-size: 14px;
  padding-bottom: 0.5rem;
}

.ressource-card .img {
  border-radius: 10px;
  background-color: var(--white);
  height: 100%;
  min-width: 100px;
  min-height: 100px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: center;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin: 1rem 0 0 2rem;
  align-items: start;
  text-align: start;
}
</style>

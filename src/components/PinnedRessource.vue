<template>
  <div class="pinned-card">
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
  name: 'PinnedRessource',
  props: {
    ressource: Object,
  }
}
</script>

<style scoped>
.pinned-card {
  display: flex;
  flex-direction: row;
  background-color: var(--white);
  min-width: 420px;
  width: 420px;
  height: 120px;
  border-radius: 0 5px 5px 0;
  box-shadow: 6px 6px 10px #00000029;
}

.name {
  font-size: 20px;
}

.desc {
  font-size: 14px;
}

.pinned-card .img {
  height: 100%;
  min-width: 120px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: center;
  border-radius: 5px 0 0 5px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 1rem 2rem;
  align-items: start;
  text-align: start;
}
</style>

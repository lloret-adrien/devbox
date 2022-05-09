<template>
  <a @click.left="this.$emit('consultRessource', this.ressource)" :href="ressource.url" target="_blank" class="ressource-card" :class="ressource.pinned && pinnedSection ? 'pinned' : ''">
    <div class="img" :style="setBackground()"></div>
    <div class="container">
      <span class="name">{{ ressource.name }}</span>
      <span class="desc">{{ ressource.desc }}</span>
    </div>
  </a>
</template>

<script>
export default {
  name: 'RessourceCard',
  props: {
    ressource: Object,
    pinnedSection: Boolean,
  },
  methods: {
    setBackground() {
      const img = this.ressource.image ? this.ressource.image : 'https://images.unsplash.com/photo-1554306274-f23873d9a26c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      return `background-image: url(${img})`
    },
  }
}
</script>

<style scoped>
.ressource-card {
  display: flex;
  flex-direction: row;
  min-width: 320px;
  min-height: 100px;
  text-decoration: none;
  color: var(--text-color);
}

.ressource-card:not(.pinned):hover {
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
  align-items: flex-start;
  text-align: start;
}

.pinned {
  background-color: var(--white);
  min-width: 420px;
  width: 420px;
  height: 120px;
  border-radius: 0 5px 5px 0;
  box-shadow: 6px 6px 10px #00000029;
  transition: transform 500ms;
}

.pinned:hover {
  transform: scale(1.1);
}

.pinned .img {
  min-width: 120px !important;
  border-radius: 5px 0 0 5px !important;
}

.pinned .container {
  padding: 1rem 2rem;
  margin: 0;
}
</style>

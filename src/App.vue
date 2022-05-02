<template>
  <div class="app">
    <div class="header">
      <img src="./assets/logo.png" alt="devbox logo">
      <SearchBar/>
    </div>

    <!-- Ressources épinglés -->
    <div v-if="getPinnedRessources().length" class="carousel">
      <PinnedRessource v-for="item in getPinnedRessources()" :key="item.id" :ressource="item"/>
    </div>
    
    <!-- Consultés dernièrement -->
    <div class="block-content last-viewed-ressources">
      <div class="back-content"></div>
      <div class="title">Consultés dernièrement</div>
      <ul>
        <li v-for="(item, i) in ressources" :key="item.id">
          <RessourceCard :ressource="item"/>
          <div class="separation" v-if="i < ressources.length - 1"></div>
        </li>
      </ul>
    </div>
    
    <!-- Dossiers -->
    <div class="block-content folders">
      <div class="back-content"></div>
      <div class="title">Dossiers</div>
      <ul>
        <li v-for="folder in getFoldersWithFavoriteFirst()" :key="folder.id" class="folder">
          <svg class="folder-svg" xmlns="http://www.w3.org/2000/svg" width="121.722" height="97.378" viewBox="0 0 121.722 97.378">
            <path @click="showRessourcesFolder(folder)" data-name="Icon material-folder" d="M51.689,6H15.172A12.156,12.156,0,0,0,3.061,18.172L3,91.205a12.208,12.208,0,0,0,12.172,12.172H112.55a12.208,12.208,0,0,0,12.172-12.172V30.344A12.208,12.208,0,0,0,112.55,18.172H63.861Z" transform="translate(-3 -6)" fill="#e9665b"/>
          </svg>
          <svg class="star-svg" :class="folder.favorite ? 'favorite' : ''" xmlns="http://www.w3.org/2000/svg" width="21.745" height="20.813" viewBox="0 0 21.745 20.813">
            <path @click="changeFavorite(folder)" data-name="Icon awesome-star" d="M11.147.723,8.493,6.1,2.555,6.97a1.3,1.3,0,0,0-.719,2.219l4.3,4.186L5.116,19.289A1.3,1.3,0,0,0,7,20.659l5.312-2.792,5.312,2.792a1.3,1.3,0,0,0,1.886-1.37L18.5,13.376l4.3-4.186a1.3,1.3,0,0,0-.719-2.219L16.134,6.1,13.48.723a1.3,1.3,0,0,0-2.333,0Z" transform="translate(-1.441 0.001)" fill="#f7f7f7"/>
          </svg>
          <span class="folder-name">{{ folder.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Contenu d'un dossier -->
    <div v-if="openFolder && getRessourcesFolder(openFolder.id).length" class="block-content folder-content">
      <div class="back-content"></div>
      <div class="title">{{ openFolder.name }}</div>
      <div class="close" @click="openFolder = null">X</div>
      <ul>
        <li v-for="(item, i) in getRessourcesFolder(openFolder.id)" :key="item.id">
          <RessourceCard :ressource="item"/>
          <div class="separation" v-if="i < getRessourcesFolder(openFolder.id).length - 1"></div>
        </li>
      </ul>
    </div>

    <!-- Non répertoriés -->
    <div v-if="getNotListedRessources().length" class="block-content not-listed">
      <div class="back-content"></div>
      <div class="title">Non répertoriés</div>
      <ul>
        <li v-for="(item, i) in getNotListedRessources()" :key="item.id">
          <RessourceCard :ressource="item"/>
          <div class="separation" v-if="i < getNotListedRessources().length - 1"></div>
        </li>
      </ul>
    </div>

    <!-- Bouton ajout de ressource -->
    <button @click="showAddRessource = !showAddRessource" function="show-add-ressource">+</button>

    <!-- Modal d'ajout d'une ressource -->
    <AddRessourceForm @close="showAddRessource = !showAddRessource" :folders="folders" :showAddRessource="showAddRessource"/>
  </div>
</template>

<script>
import PinnedRessource from './components/PinnedRessource.vue'
import RessourceCard from './components/RessourceCard.vue'
import SearchBar from './components/SearchBar.vue'
import AddRessourceForm from './components/AddRessourceForm.vue'

export default {
  name: 'App',
  components: {
    PinnedRessource,
    RessourceCard,
    SearchBar,
    AddRessourceForm,
  },
  data() {
    return {
      ressources: [
        {
          id: 1,
          name: 'Adonis JS',
          url: 'https://adonisjs.com/',
          desc: 'AdonisJS - A fully featured web framework for Node.js',
          pinned: true,
          folder: 2
        },
        {
          id: 2,
          name: 'Anime JS',
          url: 'https://animejs.com/',
          desc: 'anime.js • JavaScript animation engine',
          pinned: true,
          folder: 1
        },
        {
          id: 3,
          name: 'Three JS',
          url: 'https://threejs.org/',
          desc: '',
          pinned: false,
          folder: 1
        },
        {
          id: 4,
          name: 'MDN',
          url: '',
          desc: 'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          pinned: false,
          folder: null
        },
      ],
      folders: [
        {
          id: 1,
          name: 'JavaScript Front',
          icon: '',
          favorite: true,
        },
        {
          id: 2,
          name: 'JavaScript Back',
          icon: '',
          favorite: true,
        },
        {
          id: 3,
          name: 'Python',
          icon: '',
          favorite: false,
        },
        {
          id: 4,
          name: 'PHP',
          icon: '',
          favorite: true,
        },
      ],
      openFolder: null,
      showAddRessource: false,
    }
  },
  methods: {
    getPinnedRessources() {
      return this.ressources.filter((r) => r.pinned)
    },
    getNotListedRessources() {
      return this.ressources.filter((r) => !r.folder)
    },
    showRessourcesFolder(folder) {
      this.openFolder = folder
    },
    getRessourcesFolder(folderId) {
      return this.ressources.filter((r) => r.folder === folderId)
    },
    getFoldersWithFavoriteFirst() {
      return this.folders.sort(function compare(a, b) {
        if (a.favorite && a.favorite != b.favorite) return -1
        if (b.favorite && a.favorite != b.favorite) return 1
        return 0
      })
    },
    changeFavorite(folder) {
      folder.favorite = !folder.favorite
    }
  }
}
</script>

<style>
:root {
  --background-color: #FFFAF7;
  --recently-color: #FFEACB;
  --folder-background-color: #CED8F5;
  --folder-color: #FAD0CD;
  --text-color: #707070;
  --not-listed-color: #CAEFD7;
  --folder-content-color: #b7c8f8;
  --white: #FFFFFF;
  --border-radius: 15px;
}

body, * {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  max-width: 100vw;
  background-color: var(--background-color);
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 2rem;
}

.header img {
  max-height: 3rem;
}

.carousel {
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: scroll;
  padding: 0 2rem;
  gap: 2rem;
  height: 200px;
  max-width: 100vw;
}

.last-viewed-ressources ul {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 380px;
}
.last-viewed-ressources {
  background-color: var(--recently-color);
}
.separation {
  margin: 1rem 0 1rem 0;
  height: 1px;
  background-color: #DDDDDD;
}


.folders ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}
.folders {
  background-color: var(--folder-background-color);
}
.folder {
  position: relative;
  display: inline-block;
  user-select: none;
}
.folder-svg path {
  fill: var(--folder-color);
}
.folder-svg path:hover {
  fill: #E9665B;
  cursor: pointer;
}
.star-svg path {
  stroke: #808080;
  fill: none;
}
.star-svg path:hover {
  fill: #80808079;
  cursor: pointer;
}
.star-svg.favorite path {
  fill: #808080;
}
.folder.active .folder-svg path {
  fill: #E9665B;
  cursor: default !important;
}
.folder.active .star-svg path {
  stroke: #F7F7F7;
  cursor: default !important;
}
.star-svg {
  position: absolute;
  top: 10px;
  left: 10px;
}
.folder-name {
  font-size: 20px;
  position: absolute;
  bottom: 0.8rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  max-width: calc(100% - 1rem);
  overflow-wrap: break-word;
}

.block-content {
  position: relative;
  padding: 1rem 2rem 2rem 2rem;
  text-align: left;
}
.block-content ul {
  list-style: none;
  padding: 0;
}
.back-content {
  position: absolute;
  height: 1rem;
  width: 100%;
  left: 0;
  top: -1rem;
  border-radius: 10px 10px 0 0;
  background-color: var(--recently-color);
  z-index: 1;
}
.folders .back-content {
  background-color: var(--folder-background-color);
}
.not-listed, .not-listed .back-content {
  background-color: var(--not-listed-color);
}
.folder-content, .folder-content .back-content {
  background-color: var(--folder-content-color);
}

.close {
  position: absolute;
  cursor: pointer;
  font-size: 20px;
  right: 1rem;
  top: 1rem;
}

.title {
  font-size: 20px;
  margin-bottom: 1rem;
}

/* Bouton d'ajout */
button[function="show-add-ressource"] {
  position: fixed;
  z-index: 10;
  bottom: 1rem;
  right: 1rem;
  background-color: #f3ac4896;
  border-radius: 50px;
  width: 60px;
  height: 60px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  color: white;
}

button[function="show-add-ressource"]:hover {
  cursor: pointer;
  background-color: #f7a430;
}

button[function="show-add-ressource"]:active {
  transform: scale(0.8);
}
</style>

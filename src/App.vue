<template>
  <div @click="hideContext" class="app">
    <MyAlert v-if="alert.message" @closeAlert="closeAlert" :alert="alert" />
    <ContextMenu
      @click.prevent.stop
      v-if="context.ressource || context.folder"
      @pinnedORunpinned="pinnedORunpinned"
      @editElement="editElement"
      @editFolderHandler="editFolderHandler"
      @deleteElement="deleteElement"
      @hideContext="hideContext"
      :context="context"
      :folders="folders"
      @moveToFolder="moveToFolder"
    />

    <div class="header">
      <img src="./assets/logo.png" alt="devbox logo" />
      <SearchBar @search="search" />
    </div>

    <!-- Ressources épinglés -->
    <div v-if="getPinnedRessources().length" class="carousel">
      <RessourceCard
        @contextmenu.prevent="showContext(false, item, $event, true)"
        @consultRessource="addRecentlyConsulted"
        v-for="item in getPinnedRessources()"
        :key="item.id"
        :ressource="item"
        :pinnedSection="true"
      />
    </div>

    <!-- Consultés dernièrement -->
    <div v-if="!searchValue" class="block-content last-viewed-ressources">
      <div class="back-content"></div>
      <div class="title">Consultés dernièrement</div>
      <ul>
        <li v-for="(item, i) in recentlyConsulted" :key="item.id">
          <RessourceCard :ressource="item" />
          <div class="separation" v-if="i < recentlyConsulted.length - 1"></div>
        </li>
      </ul>
    </div>

    <!-- Dossiers -->
    <div
      v-if="
        !searchValue || (searchValue && getFoldersWithFavoriteFirst().length)
      "
      class="block-content folders"
    >
      <div class="back-content"></div>
      <div class="title">Dossiers</div>
      <ul>
        <li>
          <svg
            class="folder-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="121.722"
            height="97.378"
            viewBox="0 0 121.722 97.378"
          >
            <path
              @click="showAddFolder = !showAddFolder"
              data-name="Icon material-folder"
              d="M51.689,6H15.172A12.156,12.156,0,0,0,3.061,18.172L3,91.205a12.208,12.208,0,0,0,12.172,12.172H112.55a12.208,12.208,0,0,0,12.172-12.172V30.344A12.208,12.208,0,0,0,112.55,18.172H63.861Z"
              transform="translate(-3 -6)"
              fill="#e9665b"
            />
          </svg>
        </li>
        <li
          v-for="folder in getFoldersWithFavoriteFirst()"
          :key="folder.id"
          class="folder"
          @contextmenu.prevent="showContext(true, folder, $event)"
        >
          <svg
            class="folder-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="121.722"
            height="97.378"
            viewBox="0 0 121.722 97.378"
          >
            <path
              @click="openFolder = folder"
              data-name="Icon material-folder"
              d="M51.689,6H15.172A12.156,12.156,0,0,0,3.061,18.172L3,91.205a12.208,12.208,0,0,0,12.172,12.172H112.55a12.208,12.208,0,0,0,12.172-12.172V30.344A12.208,12.208,0,0,0,112.55,18.172H63.861Z"
              transform="translate(-3 -6)"
              fill="#e9665b"
            />
          </svg>
          <svg
            class="star-svg"
            :class="folder.favorite ? 'favorite' : ''"
            xmlns="http://www.w3.org/2000/svg"
            width="21.745"
            height="20.813"
            viewBox="0 0 21.745 20.813"
          >
            <path
              @click="changeFavorite(folder)"
              data-name="Icon awesome-star"
              d="M11.147.723,8.493,6.1,2.555,6.97a1.3,1.3,0,0,0-.719,2.219l4.3,4.186L5.116,19.289A1.3,1.3,0,0,0,7,20.659l5.312-2.792,5.312,2.792a1.3,1.3,0,0,0,1.886-1.37L18.5,13.376l4.3-4.186a1.3,1.3,0,0,0-.719-2.219L16.134,6.1,13.48.723a1.3,1.3,0,0,0-2.333,0Z"
              transform="translate(-1.441 0.001)"
              fill="#f7f7f7"
            />
          </svg>
          <span class="folder-name">{{ folder.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Contenu d'un dossier -->
    <div
      v-if="openFolder && getRessourcesFolder(openFolder.id).length"
      class="block-content folder-content"
    >
      <div class="back-content"></div>
      <div class="title">{{ openFolder.name }}</div>
      <div class="close" @click="openFolder = null">X</div>
      <ul>
        <li
          v-for="(item, i) in getRessourcesFolder(openFolder.id)"
          :key="item.id"
        >
          <RessourceCard
            @contextmenu.prevent="showContext(false, item, $event)"
            @consultRessource="addRecentlyConsulted"
            :ressource="item"
          />
          <div
            class="separation"
            v-if="i < getRessourcesFolder(openFolder.id).length - 1"
          ></div>
        </li>
      </ul>
    </div>

    <!-- Résultat de la recherche dans chaque dossiers -->
    <div v-for="folder in folders" :key="folder.id">
      <div
        v-if="
          searchValue && filterWithSearch(getRessourcesFolder(folder.id)).length
        "
        class="block-content folder-content"
      >
        <div class="back-content"></div>
        <div class="title">{{ folder.name }}</div>
        <ul>
          <li
            v-for="(item, i) in filterWithSearch(
              getRessourcesFolder(folder.id)
            )"
            :key="item.id"
          >
            <RessourceCard
              @contextmenu.prevent="showContext(false, item, $event)"
              @consultRessource="addRecentlyConsulted"
              :ressource="item"
            />
            <div
              class="separation"
              v-if="
                i < filterWithSearch(getRessourcesFolder(folder.id)).length - 1
              "
            ></div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Non répertoriés -->
    <div
      v-if="getNotListedRessources().length"
      class="block-content not-listed"
    >
      <div class="back-content"></div>
      <div class="title">Non répertoriés</div>
      <ul>
        <li v-for="(item, i) in getNotListedRessources()" :key="item.id">
          <RessourceCard
            @contextmenu.prevent="showContext(false, item, $event)"
            @consultRessource="addRecentlyConsulted"
            :ressource="item"
          />
          <div
            class="separation"
            v-if="i < getNotListedRessources().length - 1"
          ></div>
        </li>
      </ul>
    </div>

    <!-- Bouton ajout de ressource -->
    <button
      @click="showAddRessource = !showAddRessource"
      function="show-add-ressource"
    >
      +
    </button>

    <!-- Modal d'ajout d'une ressource -->
    <AddRessourceForm
      @errorAlert="errorAlert"
      @addRessource="add"
      @close="showAddRessource = !showAddRessource"
      :folders="folders"
      :showAddRessource="showAddRessource"
    />

    <!-- Modal d'ajout d'une ressource -->
    <AddFolderForm
      @errorAlert="errorAlert"
      @addFolder="addFolder"
      @close="showAddFolder = !showAddFolder"
      :showAddFolder="showAddFolder"
    />

    <!-- Modal d'edite d'une ressource -->
    <EditRessourceForm
      @errorAlert="errorAlert"
      @editRessource="edit"
      @close="showEditRessource = !showEditRessource"
      :folders="folders"
      :editRessource="editRessource"
      :showEditRessource="showEditRessource"
    />

    <!-- Modal d'edite d'un folder -->
    <EditFolderForm
      @errorAlert="errorAlert"
      @editFolder="editFolder"
      @close="showEditFolder = !showEditFolder"
      :folderToBeEdited="folderToBeEdited"
      :showEditFolder="showEditFolder"
    />
  </div>
</template>

<script>
import RessourceCard from "./components/RessourceCard.vue";
import SearchBar from "./components/SearchBar.vue";
import AddRessourceForm from "./components/AddRessourceForm.vue";
import AddFolderForm from "./components/AddFolderForm.vue";
import EditFolderForm from "./components/EditFolderForm.vue";
import EditRessourceForm from "./components/EditRessourceForm.vue";
import ContextMenu from "./components/ContextMenu.vue";

export default {
  name: "App",
  components: {
    RessourceCard,
    SearchBar,
    AddRessourceForm,
    AddFolderForm,
    EditRessourceForm,
    EditFolderForm,
    ContextMenu,
  },
  data() {
    return {
      alert: {
        message: "",
        type: "",
        bump: false,
      },
      context: {
        ressource: null,
        folder: null,
        posX: 0,
        posY: 0,
        pinned: false,
      },
      ressources: [],
      folders: [],
      recentlyConsulted: [],
      openFolder: null,
      showAddRessource: false,
      showAddFolder: false,
      showEditRessource: false,
      editRessource: {},
      showEditFolder: false,
      folderToBeEdited: {},
      searchValue: null,
    };
  },
  mounted() {
    this.ressources = JSON.parse(localStorage.getItem("ressources")) || [];
    this.recentlyConsulted =
      JSON.parse(localStorage.getItem("recentlyConsulted")) || [];
    this.folders = JSON.parse(localStorage.getItem("folders")) || [];

    window.addEventListener("scroll", () => {
      this.hideContext();
    });
  },
  methods: {
    search(value) {
      if (value.length >= 2) {
        this.searchValue = value.toLowerCase();
        this.openFolder = null;
      } else {
        this.searchValue = null;
      }
    },
    filterWithSearch(array, isFolder) {
      return isFolder === true
        ? array.filter((elt) =>
            elt.name.toLowerCase().includes(this.searchValue)
          )
        : array.filter((elt) => {
            return (
              elt.name.toLowerCase().includes(this.searchValue) ||
              elt.desc?.toLowerCase().includes(this.searchValue) ||
              elt.url.toLowerCase().includes(this.searchValue)
            );
          });
    },
    hideContext() {
      this.context.ressource = null;
      this.context.folder = null;
    },
    pinnedORunpinned() {
      this.context.ressource.pinned = !this.context.ressource.pinned;
      const pinned = this.context.ressource.pinned;
      this.hideContext();
      localStorage.setItem("ressources", JSON.stringify(this.ressources));
      this.alert.message = `Resource ${
        pinned ? "épinglée" : "retirée des éléments épinglés"
      } avec succès 🥳`;
      this.alert.type = "success";
      if (pinned) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    moveToFolder(value) {
      this.context.ressource.folder = value;
      this.hideContext();
      localStorage.setItem("ressources", JSON.stringify(this.ressources));
      this.alert.message = "Ressource déplacée avec succès 🥳";
      this.alert.type = "success";
    },
    deleteElement() {
      if (this.context.ressource) {
        this.context.ressource.deleted = true;
        localStorage.setItem("ressources", JSON.stringify(this.ressources));
        const index = this.recentlyConsulted.findIndex(
          (elt) => elt.id === this.context.ressource.id
        );
        if (index > -1) {
          this.recentlyConsulted.splice(index, 1);
          localStorage.setItem(
            "recentlyConsulted",
            JSON.stringify(this.recentlyConsulted)
          );
        }
        this.hideContext();
        return;
      }
      // Suppression d'un dossier => met en non répertorié les ressources
      this.context.folder.deleted = true;
      localStorage.setItem("folders", JSON.stringify(this.folders));
      this.ressources.forEach((ressource) => {
        if (ressource.folder === this.context.folder.id)
          ressource.folder = null;
      });
      localStorage.setItem("ressources", JSON.stringify(this.ressources));
      this.hideContext();
    },
    editElement(ressource) {
      this.showEditRessource = true;
      this.editRessource = ressource;
      return;
    },
    editFolderHandler(folder) {
      this.showEditFolder = true;
      this.folderToBeEdited = folder;
      return;
    },
    showContext(isFolder, element, e, pinned) {
      this.hideContext();
      this.context.pinned = pinned;
      this.context.posX = e.clientX;
      this.context.posY = e.clientY + window.scrollY;
      if (isFolder) {
        this.context.folder = element;
      } else {
        this.context.ressource = element;
      }
    },
    getPinnedRessources() {
      const ressources = this.ressources.filter((r) => r.pinned && !r.deleted);
      return this.searchValue ? this.filterWithSearch(ressources) : ressources;
    },
    getNotListedRessources() {
      const ressources = this.ressources.filter(
        (r) => !r.folder && !r.deleted && !r.pinned
      );
      return this.searchValue ? this.filterWithSearch(ressources) : ressources;
    },
    getRessourcesFolder(folderId) {
      return this.ressources.filter(
        (r) => r.folder === folderId && !r.deleted && !r.pinned
      );
    },
    getFoldersWithFavoriteFirst() {
      const folders = this.folders
        .sort(function compare(a, b) {
          if (a.favorite && a.favorite != b.favorite) return -1;
          if (b.favorite && a.favorite != b.favorite) return 1;
          return 0;
        })
        .filter((f) => !f.deleted);
      return this.searchValue ? this.filterWithSearch(folders, true) : folders;
    },
    changeFavorite(folder) {
      folder.favorite = !folder.favorite;
      localStorage.setItem("folders", JSON.stringify(this.folders));
    },
    async add(element) {
      if (element.folder) element.folder = Number(element.folder);
      element.id = this.ressources.length + 1;

      const text = await fetch(element.url)
        .then(async (response) => {
          if (response.ok) return response.text();
          return null;
        })
        .catch(() => {
          return null;
        });
      if (text) {
        const div = document.createElement("div");
        div.innerHTML = text.trim();
        div.style.display = "none";
        document.body.prepend(div);
        element.desc = div.querySelector("title").innerText;
        div.remove();
      }
      this.ressources.push(element);
      localStorage.setItem("ressources", JSON.stringify(this.ressources));
      this.alert.message = "Ressource ajoutée avec succès 🥳";
      this.alert.type = "success";
    },
    async edit(element) {
      // TODO: Get the resource and update in localstorage
      if (element.folder) element.folder = Number(element.folder);
      const index = this.ressources.findIndex((r) => r.id === element.id);
      const text = await fetch(element.url)
        .then(async (response) => {
          if (response.ok) return response.text();
          return null;
        })
        .catch(() => {
          return null;
        });
      if (text) {
        const div = document.createElement("div");
        div.innerHTML = text.trim();
        div.style.display = "none";
        document.body.prepend(div);
        element.desc = div.querySelector("title").innerText;
        div.remove();
      }
      this.ressources[index] = element;
      localStorage.setItem("ressources", JSON.stringify(this.ressources));
      this.alert.message = "Ressource ajoutée avec succès 🥳";
      this.alert.type = "success";
    },
    addRecentlyConsulted(ressource) {
      const index = this.recentlyConsulted.findIndex(
        (elt) => elt.id === ressource.id
      );
      if (index > -1) {
        this.recentlyConsulted.splice(index, 1);
      } else if (this.recentlyConsulted.length >= 3) {
        this.recentlyConsulted.pop();
      }
      this.recentlyConsulted.unshift(ressource);
      localStorage.setItem(
        "recentlyConsulted",
        JSON.stringify(this.recentlyConsulted)
      );
    },
    editFolder(element) {
      const index = this.folders.findIndex((r) => r.id === element.id);
      this.folders[index] = element;
      localStorage.setItem("folders", JSON.stringify(this.folders));
      this.alert.message = "Dossier Mofifier avec succès 🥳";
      this.alert.type = "success";
    },
    addFolder(element) {
      element.id = this.ressources.length + 1;
      this.folders.push(element);
      localStorage.setItem("folders", JSON.stringify(this.folders));
      this.alert.message = "Dossier ajoutée avec succès 🥳";
      this.alert.type = "success";
    },
    closeAlert() {
      this.alert.message = "";
      this.alert.type = "";
      this.alert.bump = false;
    },
    errorAlert(value) {
      if (this.alert.message === value) {
        this.alert.bump = true;
        return;
      }
      this.alert.message = value;
      this.alert.type = "error";
    },
  },
};
</script>

<style>
:root {
  --background-color: #fffaf7;
  --recently-color: #ffeacb;
  --folder-background-color: #ced8f5;
  --folder-color: #fad0cd;
  --text-color: #707070;
  --not-listed-color: #caefd7;
  --folder-content-color: #b7c8f8;
  --white: #ffffff;
  --border-radius: 15px;
}

body,
* {
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
  min-height: 100vh;
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
  background-color: #dddddd;
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
  fill: #e9665b;
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
  fill: #e9665b;
  cursor: default !important;
}
.folder.active .star-svg path {
  stroke: #f7f7f7;
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
  top: -0.9rem;
  border-radius: 10px 10px 0 0;
  background-color: var(--recently-color);
  z-index: 1;
}
.folders .back-content {
  background-color: var(--folder-background-color);
}
.not-listed,
.not-listed .back-content {
  background-color: var(--not-listed-color);
}
.folder-content,
.folder-content .back-content {
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

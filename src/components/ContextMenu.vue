<template>
  <div class="context-menu" :style="`left: ${getLeft()}px; top: ${getTop()}px`">
    <div
      v-if="
        (context.ressource && !context.ressource.pinned) ||
        (context.pinned && context.ressource && context.ressource.pinned)
      "
      class="hover"
      @click="this.$emit('pinnedORunpinned')"
    >
      {{ context.pinned ? "Retirer" : "Épinglé" }}
    </div>
    <div
      v-if="
        (context.ressource && !context.ressource.pinned) ||
        (context.pinned && context.ressource && context.ressource.pinned)
      "
      class="hr"
    ></div>
    <div class="hover" @click="this.$emit('editElement', context.ressource)">
      Modifier
    </div>
    <div v-if="!context.pinned" class="hr"></div>
    <div v-show="context.ressource && !context.pinned" class="dropdown hover">
      Déplacer
      <svg
        id="arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="6.64"
        height="11.613"
        viewBox="0 0 6.64 11.613"
      >
        <path
          id="Icon_ionic-ios-arrow-forward"
          data-name="Icon ionic-ios-arrow-forward"
          d="M15.885,12,11.49,7.61a.826.826,0,0,1,0-1.172.837.837,0,0,1,1.176,0l4.979,4.975a.828.828,0,0,1,.024,1.144l-5,5.01A.83.83,0,1,1,11.494,16.4Z"
          transform="translate(-11.246 -6.196)"
          fill="#fff"
        />
      </svg>
    </div>
    <div v-if="context.ressource" class="dropdown-content">
      <div v-if="context.ressource.folder" @click="moveToFolder(null)">
        Non répertorié
      </div>
      <div
        v-for="folder in folders.filter(
          (f) => f.id !== context.ressource.folder
        )"
        :key="folder.id"
        @click="moveToFolder(folder.id)"
      >
        {{ folder.name }}
      </div>
    </div>
    <div v-show="context.ressource && !context.pinned" class="hr"></div>
    <div
      v-show="!context.pinned"
      @click="this.$emit('deleteElement')"
      class="hover"
    >
      Supprimer
    </div>
  </div>
</template>

<script>
let timeOut;
export default {
  name: "ContextMenu",
  props: {
    context: Object,
    folders: Array,
  },
  mounted() {
    if (this.context.ressource) {
      const dropdown = document.querySelector(".dropdown");
      dropdown.addEventListener("click", () => {
        const arrow = document.getElementById("arrow");
        if (
          !arrow.style.transform ||
          arrow.style.transform == "rotate(180deg)"
        ) {
          arrow.style.transform = "rotate(90deg)";
          document.querySelector(".dropdown-content").style.display = "flex";
          this.setTop();
        } else {
          arrow.style.transform = "rotate(180deg)";
          document.querySelector(".dropdown-content").style.display = "none";
          this.setTop();
        }
      });
    }
    timeOut = setTimeout(() => {
      this.$emit("hideContext");
    }, 10000);
  },
  updated() {
    if (this.context.ressource) {
      const dropdown = document.querySelector(".dropdown");
      dropdown.addEventListener("click", () => {
        const arrow = document.getElementById("arrow");
        if (
          !arrow.style.transform ||
          arrow.style.transform == "rotate(180deg)"
        ) {
          arrow.style.transform = "rotate(90deg)";
          document.querySelector(".dropdown-content").style.display = "flex";
          this.setTop();
        } else {
          arrow.style.transform = "rotate(180deg)";
          document.querySelector(".dropdown-content").style.display = "none";
          this.setTop();
        }
      });
    }
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      this.$emit("hideContext");
    }, 10000);
  },
  methods: {
    moveToFolder(folderId) {
      this.$emit("moveToFolder", folderId);
    },
    setTop() {
      const ctx = document.querySelector(".context-menu");
      const height = document
        .querySelectorAll(".context-menu")[0]
        ?.getBoundingClientRect().height;
      if (window.innerHeight + window.scrollY - this.context.posY < height) {
        ctx.style.top = `${this.context.posY - height}px`;
        return;
      }
      ctx.style.top = `${this.context.posY}px`;
    },
    getTop() {
      const height =
        document.querySelectorAll(".context-menu")[0]?.getBoundingClientRect()
          .height || 160;
      if (window.innerHeight + window.scrollY - this.context.posY >= height) {
        return this.context.posY;
      }
      return this.context.posY - height;
    },
    getLeft() {
      const width =
        document.querySelectorAll(".context-menu")[0]?.getBoundingClientRect()
          .width || 160;
      if (window.innerWidth - this.context.posX >= width) {
        return this.context.posX;
      }
      return this.context.posX - width;
    },
  },
};
</script>

<style>
.context-menu {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: rgba(19, 39, 193, 0.38);
  backdrop-filter: blur(5px);
  box-shadow: 0px 0px 10px 4px #5552b669;
  gap: 0.5rem;
  font-size: 20px;
  min-width: 150px;
  padding: 0.4rem;
  border-radius: 5px;
  color: white;
  top: 0;
  left: 0;
  transition: top 500ms, left 500ms;
  user-select: none;
}

/* Liste déroulante des dossiers */
.dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 10px);
  cursor: pointer;
}

.dropdown div {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown-content {
  font-size: 15px;
  padding-left: 10px;
  padding-right: 5px;
  display: none;
  flex-direction: column;
  gap: 0.1rem;
  align-items: end;
  align-self: end;
  max-height: 100px;
  overflow: scroll;
}

.dropdown-content div:hover,
.hover:hover {
  color: rgb(121, 121, 121);
  cursor: pointer;
}

svg#arrow {
  transition: transform 300ms;
  transform: rotate(180deg);
}
/* FIN LISTE */

.hr {
  height: 1px;
  width: 100%;
  background-color: rgba(109, 109, 109, 0.102);
}

ul {
  list-style: none;
  margin: 0;
}
</style>

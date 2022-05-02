<template>
  <form v-if="showAddRessource" function="add-ressource" class="block-content">
    <div class="back-content"></div>
    <div>
      <div class="title">Nouvelle Ressource</div>
    </div>
    <div class="close" @click="closeModal()">X</div>
    <input placeholder="Lien" type="text" name="url" required>
    <div class="select">
      <select name="folder">
        <option class="placeholder" value="">Dossier</option>
        <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
      </select>
      <div class="select__arrow"></div>
    </div>
    <label id="pinned" class="control control--checkbox">
      Épinglé
      <input type="checkbox"/>
      <div class="control__indicator"></div>
    </label>
    <input type="submit" value="Enregistrer">
  </form>
</template>

<script>
export default {
  name: 'AddRessourceForm',
  props: {
    folders: Array,
    showAddRessource: Boolean,
  },
  methods: {
    closeModal() {
      this.$emit('close', false)
    }
  }
}
</script>

<style scoped>
form[function="add-ressource"], form[function="add-ressource"] .back-content {
  background-color: var(--not-listed-color);
}

form[function="add-ressource"] {
  position: fixed;
  width: calc(100% - 4rem);
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 100;
  animation: openForm 500ms ease-in-out;
}
@keyframes openForm {
  from {
    transform: translateY(calc(100% + 1rem));
  }
  to {
    transform: 0;
  }
}

form[function="add-ressource"] input, form[function="add-ressource"] select, form #pinned {
  background-color: var(--background-color);
  height: 50px;
  max-height: 50px;
  padding: 0.2rem 0.8rem;
  border: none;
  outline: none;
  border-radius: 10px;
  font-size: 14px;
}
form input[type="submit"] {
  width: 200px;
  align-self: end;
}

.select select {
  cursor: pointer;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: var(--text-color);
}
.select { 
  position: relative;
}
.select select::-ms-expand {
  display: none;
}
.select select:hover,
.select select:focus,
form[function="add-ressource"] input:focus,
form[function="add-ressource"] input:hover {
  background: #ccc;
}
.select select:disabled {
  opacity: 0.5;
  pointer-events: none;
}
.select__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.8rem;
  width: 0;
  height: 0;
  pointer-events: none;
  border-style: solid;
  border-width: 7px 10px 7px 0;
  border-color: transparent var(--text-color) transparent transparent;
}
option.placeholder {
  color: #707070ab;
}

.control {
  position: relative;
  cursor: pointer;
}
.control input {
  display: none;
}
#pinned {
  display: flex;
  text-align: center;
  align-items: center;
}
.control__indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.8rem;
  height: 20px;
  width: 20px;
  border-radius: 50px;
  background: #e6e6e6;
}
.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  background: #ccc;
}
.control input:checked ~ .control__indicator {
  background: var(--text-color);
}
.control input:disabled ~ .control__indicator {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
}
.control__indicator:after {
  content: '';
  position: absolute;
  display: none;
}
.control input:checked ~ .control__indicator:after {
  display: block;
}
.control--checkbox .control__indicator:after {
  left: 8px;
  top: 4px;
  width: 3px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.control--checkbox input:disabled ~ .control__indicator:after {
  border-color: #7b7b7b;
}
.control__indicator:after {
  background: #7b7b7b;
}
</style>

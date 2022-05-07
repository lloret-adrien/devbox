<template>
  <div class="searchbar">
    <label for="search" style="display: none;">Search text</label>
    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27.007" viewBox="0 0 27 27.007">
      <path id="Icon_ionic-ios-search" data-name="Icon ionic-ios-search" d="M31.184,29.545l-7.509-7.58a10.7,10.7,0,1,0-1.624,1.645l7.46,7.53a1.156,1.156,0,0,0,1.631.042A1.163,1.163,0,0,0,31.184,29.545ZM15.265,23.7a8.45,8.45,0,1,1,5.977-2.475A8.4,8.4,0,0,1,15.265,23.7Z" transform="translate(-4.5 -4.493)"/>
    </svg>
    <input type="search" name="search" placeholder="Rechercher dans mes ressources" required=""
      minlength="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="true" @input="this.$emit('search', $event.target.value)">
    <button type="submit" style="display: none;">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
}
</script>

<style scoped>
.searchbar {
  position: relative;
  flex: 1;
  max-width: 450px;
}

.searchbar input {
  width: 100%;
  height: 50px;
  border-radius: 30px;
  padding-left: 3rem;
  padding-right: 10px;
  font-size: 20px;
  outline: none;
  border: 1px solid #364C92;
  color: var(--text-color);
  background-color: var(--white);
  min-width: 300px;
}

.searchbar svg path {
  fill: #364C92;
}

.searchbar svg {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  width: 20px;
}
</style>
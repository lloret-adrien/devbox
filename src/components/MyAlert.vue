<template>
  <div id="test" class="my-alert" :class="alert.type + `${alert.bump ? ' bump' : ''}`">
    {{ alert.message }}
  </div>
</template>

<script>
export default {
  name: 'MyAlert',
  props: {
    alert: Object,
  },
  mounted() {
    setTimeout(() => {
      document.getElementById('test').classList.add('fadeOut')
      setTimeout(() => {
        this.$emit('closeAlert')
      }, 500)
    }, 3000)
  },
}
</script>

<style scoped>
  .my-alert {
    padding: 1rem 1.5rem;
    backdrop-filter: blur(5px);
    border-radius: 10px;
    display: block;
    position: fixed;
    max-width: 260px;
    top: 10px;
    z-index: 10;
    left: calc(50% - 125px);
    color: #ffffff;
    font-weight: bold;
    animation: show 500ms;
  }

  .fadeOut {
    top: -100px;
    transition: top 500ms;
  }

  .success {
    background-color: rgba(40, 177, 16, 0.5);
  }

  .error {
    background-color: rgba(255, 0, 0, 0.5)
  }

  @keyframes show {
    from {
      top: -100px;
    }
    to {
      top: 10px;
    }
  }

  .bump {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>

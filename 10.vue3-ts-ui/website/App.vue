<template>
  <div>
    <z-button type="danger" loading @click="buttonClick"></z-button>
    <z-button icon="z-icon-menu" type="danger">danger</z-button>
    <z-button icon="z-icon-loading" disabled="true" round="true">default</z-button>
    <z-icon name="loading"></z-icon>

    <z-button-group>
      <z-button icon="z-icon-arrow-left-bold">上一页</z-button>
      <z-button>
        下一页
        <i class="z-icon-arrow-right-bold"></i>
      </z-button>
    </z-button-group>

    <z-row tag="div">
      <z-col tag="p"></z-col>
    </z-row>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
const useButton = () => {
  const buttonClick = () => {
    console.log('handle-click');
  }

  return {
    buttonClick
  }
}

export default defineComponent({
  setup() {
    return {
      ...useButton()
    }
  },
})
</script>

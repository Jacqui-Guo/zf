<template>
  <div>
    <!-- button & icon -->
    <z-button type="danger" loading @click="buttonClick"></z-button>
    <z-button icon="z-icon-menu" type="danger">danger</z-button>
    <z-button icon="z-icon-loading" disabled="true" round="true"
      >default</z-button
    >
    <z-icon name="loading"></z-icon>

    <z-button-group>
      <z-button icon="z-icon-arrow-left-bold">上一页</z-button>
      <z-button>
        下一页
        <i class="z-icon-arrow-right-bold"></i>
      </z-button>
    </z-button-group>

    <!-- row & col  -->
    <z-row tag="div">
      <z-col :span="6">
        <div style="background: red">11</div>
      </z-col>
      <z-col :span="6">
        <div style="background: #0f0">22</div>
      </z-col>
      <z-col :span="6">
        <div style="background: #ff0">33</div>
      </z-col>
    </z-row>
    <z-row tag="div" gutter="20">
      <z-col :span="8">
        <div style="background: red">11</div>
      </z-col>
      <z-col :span="8">
        <div style="background: #0f0">22</div>
      </z-col>
      <z-col :span="8">
        <div style="background: #ff0">33</div>
      </z-col>
    </z-row>
    <z-row tag="div" :gutter="20" justify="end">
      <z-col :span="1">
        <div style="background: red">11</div>
      </z-col>
      <z-col :span="8">
        <div style="background: #0f0">22</div>
      </z-col>
      <z-col :span="8">
        <div style="background: #ff0">33</div>
      </z-col>
    </z-row>

    <!-- checkbox & checkbox-group -->
    {{checkVal}}
    <z-checkbox v-model="checkVal" @change="checkboxChange" disabled>
      checkbox
    </z-checkbox>
    <z-checkbox-group></z-checkbox-group>
  </div>
</template>
<script>
import { defineComponent,ref } from "vue";
const useButton = () => {
  const buttonClick = () => {
    console.log("handle-click");
  };

  return {
    buttonClick,
  };
};

const useCheckBox = () => {
  const checkVal = ref(true); // 将true变成 {value: true} 响应式的
  
  const checkboxChange = (e) => {
    console.log('change',e);
  }
  return {
    checkVal,
    checkboxChange
  }
}

export default defineComponent({
  setup() {
    return {
      ...useButton(),
      ...useCheckBox()
    };
  },
});
</script>

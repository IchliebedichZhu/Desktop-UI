<script setup lang="ts">
import { ref } from "vue";

const test = ref("123");

return {
  test,
};
</script>

<template>
  <div>hello {{ test }}</div>
</template>

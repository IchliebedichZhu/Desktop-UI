<script setup lang="ts">
import { ref } from "vue";

const test = ref("123");
</script>

<template>
  <div>hello {{ test }}</div>
</template>

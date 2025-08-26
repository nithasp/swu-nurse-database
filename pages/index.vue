<template></template>
<script setup>
onMounted(() => {
   const token = useCookie("swuNurseAccessToken");
   if (token.value) {
      navigateTo("/profile");
   } else {
      navigateTo("/login");
   }
});
</script>

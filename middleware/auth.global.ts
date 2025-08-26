export default defineNuxtRouteMiddleware((to) => {
   const token = useCookie("swuNurseAccessToken");

   if (token.value && to.name == "login") {
      return navigateTo("/");
   }

   if (!token.value && to.name != "login") {
      // abortNavigation();
      return navigateTo("/login");
   }
});

export default {
   async login(data: { username: string; password: string }) {
      const req = {
         username: data.username,
         password: data.password,
      };
      const options = {
         method: "POST",
         url: `/auth/login`,
         body: req,
         showToastError: false,
      };
      return await fetchApi(options);
   },
   async logout() {
      const options = {
         method: "PUT",
         url: `/auth/logout`,
      };
      return await fetchApi(options);
   },
   // async changePassword(data: { pwd: string; newPwd: string }) {
   //    const url = `/account/changePassword`;
   //    const req = {
   //       newPassword: data.pwd,
   //       confirmPassword: data.newPwd,
   //    };
   //    return await fetchApi("POST", url, req);
   // },
   async fetchProfileInfo() {
      const options = {
         method: "GET",
         url: `/account/profile`,
      };
      return await fetchApi(options);
   },
   // async upadteProfile(data: { firstname: string; lastname: string; selectedRoleId: number }) {
   //    const url = `/account/profile`;
   //    const req = {
   //       username: data.firstname,
   //       password: data.lastname,
   //       selectedRoleId: data.selectedRoleId,
   //    };
   //    return await fetchApi("POST", url, req);
   // },
   async fetchRolesListFirst(tokenTemp: string) {
      const options = {
         method: "GET",
         url: `/account/role`,
         tokenTemp,
      };
      return await fetchApi(options);
   },
   async changePasswordFirst(data: { password: string; confirmPassword: string; tokenTemp: string }) {
      const req = {
         password: data.password,
         confirmPassword: data.confirmPassword,
      };
      const options = {
         method: "POST",
         url: `/account/setFirstTime`,
         body: req,
         tokenTemp: data.tokenTemp,
      };
      return await fetchApi(options);
   },
   async updateRoleFirst(data: { roleId: number; tokenTemp: string }) {
      const options = {
         method: "PUT",
         url: `/account/role?roleId=${data.roleId}`,
         tokenTemp: data.tokenTemp,
      };
      return await fetchApi(options);
   },
   async fetchPermissionMenu() {
      const options = {
         method: "GET",
         url: `/account/permission`,
      };
      return await fetchApi(options);
   },
};

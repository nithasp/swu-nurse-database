export default {
   async fetchRolesList(filters: { keyword: string; offset: number; max: number; enabled: number; permissionIds: any[] }) {
      const { keyword, offset, max, enabled, permissionIds } = filters;
      const options = {
         method: "GET",
         url: `/role/?offset=${offset}&max=${max}&enabled=${enabled}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (permissionIds) {
         const ids = permissionIds.map((item) => item.id);
         options.url += `&permissionIds=${ids}`;
      }
      return await fetchApi(options);
   },
   async fetchRole(id: number) {
      const options = {
         method: "GET",
         url: `/role/${id}`,
      };
      return await fetchApi(options);
   },
   async addRole(data: { name: string; enabled: string; permissionIds: any[] }) {
      const { permissionIds, name, enabled } = data;
      const req = {
         permissionIds: permissionIds.map((item) => item.id),
         name,
         enabled: enabled == "1" ? true : false,
      };
      const options = {
         method: "POST",
         url: `/role/`,
         body: req,
      };
      return await fetchApi(options);
   },
   async updateRole(data: { id: number; name: string; enabled: string; permissionIds: any[] }) {
      const { id, permissionIds, name, enabled } = data;
      const req = {
         permissionIds: permissionIds.map((item) => item.id),
         name,
         enabled: enabled == "1" ? true : false,
      };
      const options = {
         method: "POST",
         url: `/role/${id}`,
         body: req,
      };
      return await fetchApi(options);
   },
   async deleteRole(id: number) {
      const options = {
         method: "DELETE",
         url: `/role/${id}`,
      };
      return await fetchApi(options);
   },
};

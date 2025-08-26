export default {
   async fetchPersonnelAddressList(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/address/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelAddressById(personnelId: string, addressId: string) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/address/${addressId}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelAddress(
      personnelId: string,
      body: {
         enabled: boolean | number;
         addressTypeId: number;
         houseNo: string;
         moo: string;
         floor: string;
         soi: string;
         room: string;
         street: string;
         subDistrictId: number;
         districtId: number;
         provinceId: number;
         zipcode: string;
         building: string;
         village: string;
         fax: string;
         tel: string;
      }
   ) {
      body = {
         ...body,
         enabled: body.enabled === 1 ? true : false,
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/address`,
         body,
      };
      return await fetchApi(options);
   },
   async updatePersonnelAddress(
      personnelId: string,
      addressId: string,
      body: {
         enabled: boolean | number;
         addressTypeId: number;
         houseNo: string;
         moo: string;
         floor: string;
         soi: string;
         room: string;
         street: string;
         subDistrictId: number;
         districtId: number;
         provinceId: number;
         zipcode: string;
         building: string;
         village: string;
         fax: string;
         tel: string;
      }
   ) {
      body = {
         ...body,
         enabled: body.enabled === 1 ? true : false,
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/address/${addressId}`,
         body,
      };
      return await fetchApi(options);
   },
   async deletePersonnelAddress(personnelId: string, addressId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/address/${addressId}`,
      };
      return await fetchApi(options);
   },
};

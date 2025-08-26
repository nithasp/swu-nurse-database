export default {
    async fetchPersonnelEmergency(id: string) {
       const options = {
          method: "GET",
          url: `/personnel/${id}/emergency/list`,
       };
       return await fetchApi(options);
    },

    async addUpdatePersonnelEmergency(
       personnelId: string,
       body: {
          emergencyContact: {
             prefix: string;
             firstname: string;
             middlename: string;
             lastname: string;
             relationship: string;
             workplace: {
                houseNo: string;
                village: string;
                floor: string;
                soi: string;
                moo: string;
                room: string;
                street: string;
                districtId: number;
                subDistrictId: number;
                provinceId: number;
                zipcode: string;
                branch: string;
                tel: string;
                fax: string;
                building: string;
             };
             currentAddress: {
                houseNo: string;
                village: string;
                floor: string;
                soi: string;
                moo: string;
                room: string;
                street: string;
                subDistrictId: number;
                districtId: number;
                provinceId: number;
                zipcode: string;
                branch: string;
                tel: string;
                fax: string;
                building: string;
             };
          };
       }
    ) {
       const options = {
          method: "POST",
          url: `/personnel/${personnelId}/emergency/`,
          body,
       };
       return await fetchApi(options);
    },

    async deletePersonnelEmergency(personnelId: string, emergencyId: string) {
        const options = {
           method: "DELETE",
           url: `/personnel/${personnelId}/emergency/${emergencyId}`
        };
        return await fetchApi(options);
     },
 };
 
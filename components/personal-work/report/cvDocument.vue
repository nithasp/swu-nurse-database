<template>
   <div class="bg-primary-500 rounded-t-lg h-[38px] px-4 flex items-center">
      <h2 class="text-white text-xl">เอกสาร CV</h2>
   </div>
   <div class="bg-white px-[26px] py-8">
      <div class="border-dashed border-2 border-primary-50 rounded-[20px] p-4">
         <div v-if="fileUpload.filename" class="flex justify-center items-center gap-2">
            <div
               :class="[
                  modePersonnel === 'edit' ? 'grid-cols-[1fr_25px]' : 'grid-cols-1',
                  'sm:w-[260px] rounded-lg bg-gray-200 p-3 my-3 grid justify-between items-center gap-x-2',
               ]"
            >
               <p class="line-clamp-1 text-sm">{{ fileUpload.filename }}</p>
               <UIcon v-if="modePersonnel === 'edit'" name="i-heroicons-x-mark" class="w-5 h-5 cursor-pointer" @click="setDialogDelete(true)" />
            </div>
            <UButton
               icon="i-heroicons-arrow-down-tray"
               color="gray"
               variant="solid"
               size="xl"
               label="ดาวน์โหลด"
               block
               class="rounded-lg w-[125px] bg-gray-200 hover:opacity-85 text-sm"
               @click="openNewTab(fileUpload.url)"
            />
         </div>
         <div v-else v-bind="getRootProps()" class="grid content-center text-center justify-center gap-y-4 min-h-72">
            <input v-bind="getInputProps()" type="file" accept=".pdf, .docx" id="input_file_cv" />
            <img :src="FolderImage" alt="Folder" class="h-[72px] m-auto" />
            <div>
               <p class="font-sarabun-bold" v-if="isDragActive">วางไฟล์ ..</p>
               <p v-else class="font-sarabun-bold">ลาก และ วางไฟล์ของคุณที่นี่</p>
               <p>รองรับไฟล์ : .PDF, .DOCX</p>
            </div>
            <UButton color="primary" variant="solid" label="เลือกไฟล์" block class="rounded-lg h-[37px] w-[125px] m-auto" />
         </div>
      </div>
   </div>
   <DialogConfirm
      :isOpen="isOpenDelete"
      :setDialog="setDialogDelete"
      title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDelete"
   />
   <Loading v-if="isLoading" />
</template>

<script setup>
import FolderImage from "~/assets/images/personal-work/cv/folder.png";
import DialogConfirm from "~/components/dialog/confirm";
import Loading from "~/components/loading";
import { useDropzone } from "vue3-dropzone";
const { fetchPersonnelCV, deletePersonnelCV } = usePersonnelCVAPI;
import usePersonnelCVAPI from "~/service/api/personnel/cv";

const props = defineProps({
   modePersonnel: String,
   personnelId: String,
});

const isLoading = ref(true);
onMounted(() => {
   getPersonnelCV();
});

const fileUpload = ref({});
const getPersonnelCV = async () => {
   isLoading.value = true;
   const res = await fetchPersonnelCV(props.personnelId);
   isLoading.value = false;
   if (res.code == 20000) {
      fileUpload.value = res.responseObject;
   }
};

const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({ onDrop });
async function onDrop(acceptFiles, rejectReasons) {
   if (acceptFiles.length) {
      isLoading.value = true;
      const res = await uploadFileCV(acceptFiles[0], props.personnelId);
      isLoading.value = false;
      if (res) {
         fileUpload.value.filename = res.fileName;
      }
      document.getElementById("input_file_cv").value = "";
   }
}

const isOpenDelete = ref(false);
const setDialogDelete = (status) => {
   isOpenDelete.value = status;
};

const fnDelete = async () => {
   isLoading.value = true;
   const res = await deletePersonnelCV(props.personnelId);
   isLoading.value = false;
   if (res.code == 20000) {
      fileUpload.value = {};
      setDialogDelete(false);
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      getPersonnelCV();
   }
};
</script>

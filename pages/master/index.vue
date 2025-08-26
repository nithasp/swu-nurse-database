<template>
   <div class="grid grid-cols-[260px_1fr] w-[1080px] sm:w-full overflow-x-auto">
      <div class="pe-6 ps-2 overflow-auto h-[calc(100vh-130px)]">
         <div class="pb-2" v-for="list in lists" :key="list.title">
            <p v-if="list.isLabel" :class="`${list.class} text-sm text-gray-500 pb-2`">{{ list.title }}</p>
            <div
               v-else
               :class="[
                  page == list.path ? '[&_p]:text-primary-500 [&_path]:fill-primary-500' : '',
                  'cursor-pointer [&_p]:hover:text-primary-500 [&_path]:hover:fill-primary-500',
               ]"
               @click="
                  navigateTo({
                     path: `/master`,
                     query: {
                        page: list.path,
                     },
                  })
               "
            >
               <div class="flex items-center justify-between">
                  <p>{{ list.title }}</p>
                  <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M1.20629 8.97392L0.265625 8.03125L3.79162 4.50258L0.265625 0.973916L1.20896 0.03125L4.73228 3.55992C4.98224 3.80995 5.12267 4.14903 5.12267 4.50258C5.12267 4.85614 4.98224 5.19521 4.73228 5.44525L1.20629 8.97392Z"
                        fill="#374957"
                     />
                  </svg>
               </div>
               <UDivider class="mt-2" />
            </div>
         </div>
      </div>
      <div class="overflow-auto h-[calc(100vh-130px)]">
         <Prefix v-if="page == 'prefix'" />
         <PersonnelType v-else-if="page == 'personnelType'" />
         <PersonnelStatus v-else-if="page == 'personnelStatus'" />
         <Agency v-else-if="page == 'agency'" />
         <Position v-else-if="page == 'position'" />
         <AcademicPosition v-else-if="page == 'academicPosition'" />
         <ContractType v-else-if="page == 'contractType'" />
         <LeaveType v-else-if="page == 'leaveType'" />
         <TrainingType v-else-if="page == 'trainingType'" />
         <EducationLevel v-else-if="page == 'educationLevel'" />
         <EducationCert v-else-if="page == 'educationCert'" />
         <EducationBranch v-else-if="page == 'educationBranch'" />
         <EducationInstitution v-else-if="page == 'educationInstitution'" />
         <ReportTopic v-else-if="page == 'reportTopic'" />
         <ImpactFactor v-else-if="page == 'impactFactor'" />
         <TextbookImpactFactor v-else-if="page == 'textbookImpactFactor'" />
         <InventionType v-else-if="page == 'inventionType'" />
         <WorkBranch v-else-if="page == 'workBranch'" />
         <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
               <p class="text-gray-500">โปรดเลือกเมนูด้านซ้าย</p>
            </div>
         </div>
      </div>
   </div>
</template>
<script setup>
import Prefix from "~/components/masterdata/prefix";
import PersonnelType from "~/components/masterdata/personnelType";
import PersonnelStatus from "~/components/masterdata/personnelStatus";
import Agency from "~/components/masterdata/agency";
import Position from "~/components/masterdata/position";
import AcademicPosition from "~/components/masterdata/academicPosition";
import ContractType from "~/components/masterdata/contractType";
import LeaveType from "~/components/masterdata/leaveType";
import TrainingType from "~/components/masterdata/trainingType";
import EducationLevel from "~/components/masterdata/educationLevel";
import EducationCert from "~/components/masterdata/educationCert";
import EducationBranch from "~/components/masterdata/educationBranch";
import EducationInstitution from "~/components/masterdata/educationInstitution";
import ReportTopic from "~/components/masterdata/reportTopic";
import ImpactFactor from "~/components/masterdata/impactFactor";
import TextbookImpactFactor from "~/components/masterdata/textbookImpactFactor";
import InventionType from "~/components/masterdata/inventionType";
import WorkBranch from "~/components/masterdata/workBranch";

const lists = ref([
   { isLabel: true, title: "งานบุคคล" },
   { title: "คำนำหน้าชื่อ", path: "prefix" },
   { title: "ประเภทบุคคลากร", path: "personnelType" },
   { title: "สถานภาพบุคลากร", path: "personnelStatus" },
   { title: "งาน", path: "workBranch" },
   { title: "หน่วยงานที่ปฏิบัติงาน", path: "agency" },
   { title: "ตำแหน่งงาน", path: "position" },
   { title: "ตำแหน่งทางวิชาการ", path: "academicPosition" },
   { title: "ประเภทสัญญา", path: "contractType" },
   { title: "ประเภทการลา", path: "leaveType" },
   { title: "ประเภทการฝึกอบรม", path: "trainingType" },
   { isLabel: true, title: "ข้อมูลการศึกษา", class: "mt-4" },
   { title: "ระดับการศึกษา", path: "educationLevel" },
   { title: "วุฒิการศึกษา", path: "educationCert" },
   { title: "สาขาวิชา", path: "educationBranch" },
   { title: "สถาบันการศึกษา", path: "educationInstitution" },
   { title: "หัวข้อรายงานการศึกษาต่อ", path: "reportTopic" },
   { title: "ระดับฐานข้อมูลวารสาร", path: "impactFactor" },
   { title: "ระดับฐานข้อมูลหนังสือ/ตำรา", path: "textbookImpactFactor" },
   { title: "ประเภทสิ่งประดิษฐ์", path: "inventionType" },
]);

const route = useRoute();
const page = ref("");

onMounted(() => {
   page.value = route.query?.page;
});

watch(
   () => route.query,
   (newValue) => {
      page.value = newValue?.page;
   }
);
</script>

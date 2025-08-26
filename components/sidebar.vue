<template>
   <aside class="bg-white relative h-[calc(100vh-98px)]">
      <div :class="[fullSidebar ? 'p-4' : 'p-2 pt-4', 'bg-primary-500 rounded-tr-[40px] h-full border border-primary-100 overflow-y-auto overflow-x-hidden']">
         <ul>
            <li v-for="(menu, indexMenu) in menus" :key="`menu-${indexMenu}`" :class="[!fullSidebar ? 'flex' : '', 'select-none']">
               <div
                  class="w-full my-2 cursor-pointer rounded-md transition-colors hover:bg-primary-100 flex justify-between items-center"
                  @click="openItem == menu.key ? (openItem = '') : (openItem = menu.key), !fullSidebar ? setNavbar(!fullSidebar) : ''"
               >
                  <NuxtLink :to="menu.path" :class="[menu.subMenus.length == 0 && route.name == menu.key ? 'bg-primary-100' : '', 'text-white w-full rounded-md']">
                     <UTooltip
                        v-if="!fullSidebar"
                        :text="menu.text"
                        :popper="{ placement: 'right', arrow: true, offsetDistance: 20 }"
                        :ui="{
                           ring: 'ring-gray-50',
                           shadow: 'shadow-none',
                           base: 'py-[6px] h-auto text-sm text-primary-500',
                           rounded: 'rounded-md',
                           arrow: {
                              base: 'before:w-4 before:h-4',
                              background: 'before:bg-white',
                              ring: 'ring-0 before:ring-[#eaeaea]',
                              shadow: 'before:shadow-none',
                           },
                        }"
                        class="px-3 py-2"
                     >
                        <img :src="menu.icon" :alt="menu.text" />
                     </UTooltip>
                     <div
                        v-else
                        :class="[
                           menu.subMenus.length == 0 && route.name == menu.key ? 'bg-primary-100' : '',
                           'flex items-center transition-colors w-full px-3 py-2 rounded-md',
                        ]"
                     >
                        <img :src="menu.icon" :alt="menu.text" class="me-2" />
                        <p class="text-white text-nowrap">
                           {{ menu.text }}
                        </p>
                     </div>
                  </NuxtLink>
                  <img
                     v-if="menu.subMenus.length && fullSidebar"
                     :src="ArrowIcon"
                     alt="Arrow Icon"
                     :class="[openItem == menu.key ? '!rotate-0' : '', 'me-3 rotate-[-90deg] transition-transform']"
                  />
               </div>
               <div
                  v-if="menu.subMenus && menu.subMenus.length && fullSidebar"
                  :class="[openItem == menu.key ? 'opacity-1' : 'opacity-0 h-0', '[transition:opacity_0.3s,height_0.3s] relative overflow-hidden']"
                  :style="`height: ${openItem == menu.key ? 45 * menu.subMenus.length + 10 : '0'}px;`"
                  :id="menu.key"
               >
                  <div v-for="(subMenu, index) in menu.subMenus" :key="`sub-menu-${index}`" class="my-1 h-10">
                     <NuxtLink :to="subMenu.path" class="text-white" @click="subMenu.path != '' ? (pathname = subMenu.path) : null">
                        <div
                           :class="[
                              getRouteActiveSubmenu(subMenu.id) ? 'bg-primary-100' : '',
                              'flex items-center cursor-pointer transition-colors rounded-md hover:bg-primary-100 h-10 w-full ps-11 pr-3 py-2',
                           ]"
                        >
                           <img :src="subMenu.icon" :alt="subMenu.text" class="me-2 w-4" />
                           <p class="text-white text-nowrap">{{ subMenu.text }}</p>
                        </div>
                     </NuxtLink>
                  </div>
               </div>
            </li>
         </ul>
      </div>
      <UButton
         icon="i-heroicons-chevron-double-left"
         size="lg"
         color="primary"
         :class="[
            !fullSidebar ? 'rotate-180' : '',
            'flex justify-center bg-primary-700 w-[38px] h-[38px] absolute bottom-4 right-[-20px] transition-all duration-300',
         ]"
         square
         variant="solid"
         :ui="{ rounded: 'rounded-full' }"
         @click="setNavbar(!fullSidebar)"
      />
   </aside>
</template>
<script setup>
import DashboardIcon from "~/assets/icons/menus/chart-histogram.svg";
import ResearchIcon from "~/assets/icons/menus/submenu/research.svg";
import GraduationIcon from "~/assets/icons/menus/submenu/graduation-cap.svg";
import UserIcon from "~/assets/icons/menus/user.svg";
import AppsIcon from "~/assets/icons/menus/submenu/apps.svg";
import DocumentIcon from "~/assets/icons/menus/document.svg";
import WorkIcon from "~/assets/icons/menus/submenu/work.svg";
import BookAltIcon from "~/assets/icons/menus/submenu/book-alt.svg";
import BookIcon from "~/assets/icons/menus/submenu/book.svg";
import SettingIcon from "~/assets/icons/menus/settings.svg";
import ArrowIcon from "~/assets/icons/menus/arrow.svg";
import BoxIcon from "~/assets/icons/menus/box.svg";
import HeadThinkingIcon from "~/assets/icons/menus/head-side-thinking.svg";
import TimeIcon from "~/assets/icons/menus/fi-rs-time-past.svg";

import useAuthAPI from "~/service/api/auth";
const { fetchPermissionMenu } = useAuthAPI;

defineProps({
   fullSidebar: Boolean,
   setNavbar: Function,
});

const route = useRoute();
const menus = ref([]);

const pathname = ref("");
onMounted(async () => {
   pathname.value = window.location.pathname;
   const routeName = route.name.split("-")[0];
   if (routeName == "index") {
      openItem.value = "dashboard";
   } else {
      openItem.value = route.name.split("-")[0];
   }
   getMenu();
});

const getMenu = async () => {
   const res = await fetchPermissionMenu();
   if (res.code == 20000) {
      for (const menu of res.responseObject.modules) {
         let obj = {};
         switch (menu.code) {
            // case "Account":
            //    if (menu.permission) {
            //       obj = {
            //          key: "profile",
            //          text: "ข้อมูลของฉัน",
            //          icon: BoxIcon,
            //          path: "/profile",
            //          id: ["profile"],
            //          subMenus: [],
            //       };
            //       menus.value.push(obj);
            //    }
            //    break;
            case "Dashboard":
               if (menu.permission) {
                  obj = {
                     key: "dashboard",
                     text: "Dashboard",
                     icon: DashboardIcon,
                     path: "",
                     subMenus: [],
                  };

                  if (menu.children.length) {
                     for (const subMenu of menu.children) {
                        switch (subMenu.code) {
                           case "DashboardPersonnel":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: UserIcon,
                                    text: "งานบุคคล",
                                    path: "/dashboard/personal",
                                    id: ["dashboard-personal"],
                                 });
                              }
                              break;
                           case "DashboardResearch":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: ResearchIcon,
                                    text: "งานวิจัย",
                                    path: "/dashboard/research",
                                    id: ["dashboard-research"],
                                 });
                              }
                              break;
                           case "DashboardAdministrator":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: GraduationIcon,
                                    text: "งานบริการวิชาการ",
                                    path: "/dashboard/academic",
                                    id: ["dashboard-academic"],
                                 });
                              }
                              break;
                        }
                     }
                  }
                  menus.value.push(obj);
               }
               break;
            case "Personnel":
               if (menu.permission) {
                  obj = {
                     key: "personal",
                     text: "งานบุคคล",
                     icon: UserIcon,
                     path: "",
                     subMenus: [],
                  };

                  if (menu.children.length) {
                     for (const subMenu of menu.children) {
                        switch (subMenu.code) {
                           case "PersonnelOverview":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: AppsIcon,
                                    text: "รายงานบุคลากร",
                                    path: "/personal-work/report",
                                    id: ["personal-work-report"],
                                 });
                              }
                              break;
                           case "PersonnelRoleManagement":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: SettingIcon,
                                    text: "จัดการสิทธิ์ผู้ใช้งาน",
                                    path: "/personal-work/role",
                                    id: ["personal-work-role"],
                                 });
                              }
                              break;
                        }
                     }
                  }
                  menus.value.push(obj);
               }
               break;
            case "Research":
               if (menu.permission) {
                  obj = {
                     key: "research",
                     text: "งานวิจัย",
                     icon: DocumentIcon,
                     path: "",
                     subMenus: [],
                  };

                  if (menu.children.length) {
                     for (const subMenu of menu.children) {
                        switch (subMenu.code) {
                           case "ResearchOverview":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: ResearchIcon,
                                    text: "งานวิจัย",
                                    path: "/research-work/research",
                                    id: ["research-work-research"],
                                 });
                              }
                              break;
                           case "ResearchArticle":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: BookAltIcon,
                                    text: "บทความวิจัย/วิชาการ",
                                    path: "/research-work/articles",
                                    id: ["research-work-articles"],
                                 });
                              }
                              break;
                           case "ResearchDocument":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: BookIcon,
                                    text: "หนังสือ/ตำรา",
                                    path: "/research-work/books",
                                    id: ["research-work-books"],
                                 });
                              }
                              break;
                           // case "ResearchTextBook":
                           //    if (subMenu.permission) {
                           //       obj.subMenus.push({
                           //          icon: HeadThinkingIcon,
                           //          text: "ทรัพย์สินทางปัญญา",
                           //          path: "/research-work/intellectual-property",
                           //          id: ["research-work-intellectual-property"],
                           //       });
                           //    }
                           //    break;
                        }
                     }
                  }
                  menus.value.push(obj);
               }
               break;
            case "Administrator":
               if (menu.permission) {
                  obj = {
                     key: "academic",
                     text: "งานบริการวิชาการ",
                     icon: DocumentIcon,
                     path: "",
                     subMenus: [],
                  };

                  if (menu.children.length) {
                     for (const subMenu of menu.children) {
                        switch (subMenu.code) {
                           case "AdministrationOverview":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: WorkIcon,
                                    text: "งานบริการวิชาการ",
                                    path: "/academic-services/academic",
                                    id: ["academic-services-academic"],
                                 });
                              }
                              break;
                        }
                     }
                  }
                  menus.value.push(obj);
               }
               break;
            case "Report":
               if (menu.permission) {
                  obj = {
                     key: "reports",
                     text: "รายงาน",
                     icon: DocumentIcon,
                     path: "",
                     subMenus: [],
                  };

                  if (menu.children.length) {
                     for (const subMenu of menu.children) {
                        switch (subMenu.code) {
                           case "ReportPersonnel":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: UserIcon,
                                    text: "งานบุคคล",
                                    path: "/reports/personal",
                                    id: ["reports-personal"],
                                 });
                              }
                              break;
                           case "ReportAdministration":
                              if (subMenu.permission) {
                                 obj.subMenus.push({
                                    icon: WorkIcon,
                                    text: "งานบริการวิชาการ",
                                    path: "/reports/academic",
                                    id: ["reports-academic"],
                                 });
                              }
                              break;
                        }
                     }
                  }
                  menus.value.push(obj);
               }
               break;
            case "Master":
               if (menu.permission) {
                  obj = {
                     key: "master",
                     text: "กำหนดค่าพื้นฐาน",
                     icon: SettingIcon,
                     path: "/master",
                     id: ["master"],
                     subMenus: [],
                  };
                  menus.value.push(obj);
               }
               break;
            case "History":
               if (menu.permission) {
                  obj = {
                     key: "history",
                     text: "ประวัติการใช้งาน",
                     icon: TimeIcon,
                     path: "/history",
                     id: ["history"],
                     subMenus: [],
                  };
                  menus.value.push(obj);
               }
               break;
         }
      }
   }
};

const openItem = ref("");

const getRouteActiveSubmenu = (subMenuId) => {
   let active = false;
   const found = subMenuId.find((val) => val == route.name) || subMenuId.find((val) => val + "-form" == route.name);
   if (found) {
      active = true;
   }
   return active;
};
</script>

import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import Gallery from "@/views/Gallery";
import AddPhoto from "@/views/AddPhoto";
import EditPhoto from '@/views/EditPhoto'

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Gallery",
    name: "Gallery",
    component: Gallery,
  },
  {
    path: "/AddPhoto",
    name: "AddPhoto",
    component: AddPhoto,
  },
  {
    path: "/EditPhoto",
    name: "EditPhoto",
    component: EditPhoto,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

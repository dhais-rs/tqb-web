/*
 * @Author: your name
 * @Date: 2021-01-13 17:32:55
 * @LastEditTime: 2021-12-02 17:02:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\plugins\permission.js
 */
import { SET_MENU_LIST, SET_PERMISSION_LIST } from "@/store/modules/app/type";

import globalRoutes from "@/router/globalRoutes";
import mainRoutes from "@/router/mainRoutes";
import NProgress from "nprogress";

console.log('this', mainRoutes, globalRoutes)



const submenuList = [
    {
        parentId: -1,
        id: 100,
        name: "系统设置", //看官网，这个名字是3-5之间的
        url: "",
        menu: "",
        type: 0,
        icon: "Setting",
        sort: 1,
        iframe: 1
    },
    {
        parentId: 100,
        id: 1,
        name: "用户管理", //看官网，这个名字是3-5之间的
        url: "system/Users", //这个类似上面的id一个，只是初始值是从100开始的
        menu: "",
        type: 1,
        icon: "UserFilled",
        sort: 2,
        iframe: 0,
        role: ['1'],
    },
    // {
    //     parentId: 100,
    //     id: 5,
    //     name: "菜单管理", //看官网，这个名字是3-5之间的
    //     url: "system/Menus", //这个类似上面的id一个，只是初始值是从100开始的
    //     menu: "",
    //     type: 1,
    //     icon: "Menu",
    //     sort: 1,
    //     iframe: 0,
    // },

    // {
    //     parentId: 100,
    //     id: 11,
    //     name: "角色管理", //看官网，这个名字是3-5之间的
    //     url: "system/Roles", //这个类似上面的id一个，只是初始值是从100开始的
    //     menu: "",
    //     type: 1,
    //     icon: "HelpFilled",
    //     sort: 3,
    //     iframe: 0,
    // },
    {
        parentId: -1,
        id: 15,
        name: "参考资料", //看官网，这个名字是3-5之间的
        url: "",
        menu: "",
        type: 0,
        icon: "DocumentCopy",
        sort: 2,
        iframe: 1,
    },
    {
        parentId: 15,
        id: 16,
        name: "vue3.0", //看官网，这个名字是3-5之间的
        url: "https://www.vue3js.cn/docs/zh/", //这个类似上面的id一个，只是初始值是从100开始的
        menu: "",
        type: 1,
        icon: "Promotion",
        sort: 1,
        iframe: 1,
        role: ['0'],
    },
    {
        parentId: 15,
        id: 17,
        name: "element-plus", //看官网，这个名字是3-5之间的
        url: "https://element-plus.org/#/zh-CN", //这个类似上面的id一个，只是初始值是从100开始的
        menu: "",
        type: 1,
        icon: "ElemeFilled",
        sort: 1,
        iframe: 1,
    },
];


const menuList = submenuList.filter((item, index) => {
    let role = item.role;
    let menuBool = role ? role.includes('1') : true;
    return menuBool;
});

console.log('menuList')

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
    let temp = [];
    for (let i = 0; i < globalRoutes.length; i++) {
        if (route.name === globalRoutes[i].name) {
            return "global";
        } else if (
            globalRoutes[i].children &&
            globalRoutes[i].children.length >= 1
        ) {
            temp = temp.concat(globalRoutes[i].children);
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : "main";
}

export default {
    install: (app, { router, store }) => {
        // let router = opt;
        router.beforeEach(async (to, from, next) => {
            const token = store.getters.token;
            if (
                router.options.isAddDynamicMenuRoutes ||
                fnCurrentRouteType(to, globalRoutes) === "global"
            ) {
                //* 1. 已经添加 or 全局路由, 直接访问
                if (to.meta.title) {
                    document.title = to.meta.title;
                }
                NProgress.start();
                next();
            } else {
                // let token = sessionStorage.getItem("token");
                if (!token || !/\S/.test(token)) {
                    next({ name: "Login" });
                } else {
                    // let data = await VE_API.system.userMenuList();
                    let data = {
                        code: "00",
                        list: menuList,
                    };
                    if (data && data.code === "00") {
                        let _list = XE.clone(data.list, true);
                        data.list = XE.mapTree(
                            XE.toArrayTree(_list, {
                                sortKey: "sort",
                            }),
                            (item) => {
                                if (
                                    item.children &&
                                    item.children.length <= 0
                                ) {
                                    delete item.children;
                                }
                                return item;
                            }
                        );
                        await fnAddDynamicMenuRoutes(data.list);
                        router.options.isAddDynamicMenuRoutes = true;
                        await store.dispatch(`app/${SET_MENU_LIST}`, data.list);
                        await store.dispatch(
                            `app/${SET_PERMISSION_LIST}`,
                            data.list
                        );
                        NProgress.start();
                        next({ ...to, replace: true });
                    } else {
                        next({ name: "Login" });
                    }
                }
            }
        });
        router.afterEach(() => {
            NProgress.done();
        });

        /**
         * 添加动态(菜单)路由
         * @param {*} menuList 菜单列表
         * @param {*} routes 递归创建的动态(菜单)路由
         */
        // eslint-disable-next-line no-unused-vars
        const fnAddDynamicMenuRoutes = async (menuList = [], routes = []) => {
            let temp = [];
            for (let i = 0; i < menuList.length; i++) {
                if (
                    menuList[i].type == 0 &&
                    menuList[i].children &&
                    menuList[i].children.length >= 1
                ) {
                    temp = temp.concat(menuList[i].children);
                } else if (menuList[i].type == 1) {
                    // } else if (menuList[i].type==1 && /\S/.test(menuList[i].url)) {
                    // const url = menuList[i].url.replace(/\//g, "_");
                    let route = {
                        path:
                            menuList[i].url.replace(/\//g, "-") +
                            `-${menuList[i].id}`,
                        component: null,
                        name:
                            menuList[i].url.replace(/\//g, "-") +
                            `-${menuList[i].id}`,
                        // meta: {
                        // }
                    };
                    // url以http[s]://开头, 通过iframe展示
                    if (menuList[i].iframe == 1) {
                        route["path"] = `i-${menuList[i].id}`;
                        route["name"] = `i-${menuList[i].id}`;
                        route["props"] = { url: menuList[i].url };
                        route["component"] = () => import("@/views/IFrame.vue");
                    } else {
                        const l = "views/layoutpages/" + menuList[i].url;
                        route["component"] = () => import("@/" + l + ".vue");
                    }
                    routes.push(route);
                }
            }
            if (temp.length >= 1) {
                fnAddDynamicMenuRoutes(temp, routes);
            } else {
                mainRoutes.children = mainRoutes.children.concat(routes);
                // mainRoutes.children = routes;
                console.log(
                    "控制台打印--> ~ file: permission.js ~ line 127 ~ fnAddDynamicMenuRoutes ~ mainRoutes.children",
                    mainRoutes.children
                );

                await router.addRoute(mainRoutes);
                await router.addRoute({
                    path: "/:w+",
                    redirect: { name: "404" },
                });
            }
        };
    },
};

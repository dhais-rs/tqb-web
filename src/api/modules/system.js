/*
 * @Author: your name
 * @Date: 2021-02-07 13:40:50
 * @LastEditTime: 2021-12-02 15:59:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\api\modules\system.js
 */
// const Mock = require("mockjs"); //引入
/**
 * @description: 列表查询
 * @param {*}
 * @return {*}
 */

module.exports = {
    login: {
        url: "/user/login",
        type: "post",
    },
    userList: {
        url: "/user/page",
        type: "post",
    },
    userState: {
        url: "/user/updateState",
        type: "post"
    },
    delUser: {
        url: "/user/delUser",
        type: "get"
    },
    addUser: {
        url: "/user/addUser",
        type: "post"
    },
    editUser: {
        url: "/user/update",
        type: "post"
    },
    //轮播图管理
    bannerList: {
        url: "/banner/page",
        type: "post"
    }

};

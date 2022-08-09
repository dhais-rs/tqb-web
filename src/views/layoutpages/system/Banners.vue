<!--
 * @Author: your name
 * @Date: 2021-02-05 14:52:13
 * @LastEditTime: 2021-11-30 18:49:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\views\layoutpages\system\Roles.vue
-->
<template>
	<div class="ve_container">
		<!-- 搜索 -->
		<el-form ref="queryForm" :inline="true" :model="params">
			<el-form-item label="名称" prop="bannerName">
				<el-input clearable v-model="bannerName" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit(params, getDataList)">
					{{ menus.search.name }}
				</el-button>
				<el-button @click="resetForm(queryForm, params, getDataList)">
					重置
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 列表 -->
		<ve-table :table="{
			data: tableData,
		}" :pagination="{
	onSizeChange: (val) =>
		handleSizeChange(val, params, getDataList),
	onCurrentChange: (val) =>
		handleCurrentChange(val, params, getDataList),
	currentPage: page,
	pageSize: limit,
	total: total,
}">
			<template #tool_bar>
				<el-button v-permission="['add']" size="small" type="primary" @click="handleEdit(menus.add.name)">
					{{ menus.add.name }}
				</el-button>
			</template>
			<el-table-column prop="bannerName" label="轮播图名称"></el-table-column>
			<el-table-column prop="url" label="地址" width="120"></el-table-column>
			<el-table-column prop="status" label="状态">
				<template v-slot="{ row }">
					<el-switch :loading="row.load ? true : false" v-model="row.status" :active-value="1"
						:inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"
						@change="(val) => handelSwitch(val, row)">
						>
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column prop="creator" label="创建人"></el-table-column>
			<el-table-column prop="createBy" label="创建人账号"></el-table-column>
			<el-table-column prop="createDate" label="创建时间"></el-table-column>
			<el-table-column prop="updater" label="更新人"></el-table-column>
			<el-table-column prop="updateBy" label="更新人账号"></el-table-column>
			<el-table-column prop="updateDate" label="更新时间"></el-table-column>
			<el-table-column fixed="right" label="操作">
				<template v-slot:default="{ row }">
					<el-button v-permission="['edit']" @click.prevent="handleEdit(menus.edit.name, row)" type="primary"
						size="small">
						{{ menus.edit.name }}
					</el-button>
					<el-button v-permission="['del']" @click.prevent="handleDel(row.id)" type="danger" size="small">
						{{ menus.del.name }}
					</el-button>
				</template>
			</el-table-column>
		</ve-table>

		<!-- 编辑组件 -->
		<role-edit v-if="showDialog" :rowData="rowData" :title="dialogTitle" :showDialog="showDialog"
			@closeDialog="handelDialog($event)" />
	</div>
</template>
<script>
export default {
	data: () => ({
		description: "角色信息查询与设置",
		menus: {
			search: { name: "查询" },
			add: { name: "添加" },
			edit: { name: "编辑" },
			del: { name: "删除" },
		},
	}),
};
</script>

<script setup>
import BannerEdit from "./components/BannerEdit";
import {
	reactive,
	toRefs,
	computed,
	ref,
	onMounted,
	getCurrentInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { findName } from "../common";

//*导入公共查询方法
import {
	onSubmit,
	resetForm,
	handleSizeChange,
	handleCurrentChange,
} from "@/views/layoutpages/common";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();
const menuList = computed(() => store.getters.menuList).value;

const rowData = ref(null);
const dialogTitle = ref("");
const showDialog = ref(false);

const queryForm = ref(null);
const tableData = ref([]);
const params = reactive({
	bannerName: "",
	currentNum: 1,
	size: 10,
	total: 50,
});
const { name, limit, page, total } = toRefs(params);

/**
 * @description:添加or编辑事件
 * @param {*}
 * @return {*}
 */
const handleEdit = (title, row = null) => {
	showDialog.value = true;
	dialogTitle.value = title;
	rowData.value = row;
};
/**
 * @description: dialog事件
 * @param {*}
 * @return {*}
 */
const handelDialog = (e) => {
	showDialog.value = e;
	getDataList();
};
/**删除行数据
 * @description:
 * @param {*}
 * @return {*}
 */
const handleDel = (id) => {
	proxy
		.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "error",
		})
		.then(async () => {
			const { code } = await VE_API.system.roleDel({ id });
			if (code == "00") {
				getDataList();
			}
		})
		.catch(() => {
			proxy.$message({
				type: "info",
				message: "已取消删除",
			});
		});
};
/**
 * @description: 获取列表数据
 * @param {*}
 * @return {*}
 */
const getDataList = async () => {
	const { code, info, total, row } = await VE_API.system.bannerList(params);
	if (code == "1") {
		params.total = total;
		tableData.value = row;
	}
};
onMounted(async () => {
	await getDataList();
	// maxHeight(pagination, queryForm, toolBar, ve_max_height);
});
</script>

<style lang="scss" scoped>
</style>

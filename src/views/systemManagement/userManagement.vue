<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-user" class="handle-del mr10" @click="addNews">新增用户</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="id" label="id" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="cnName" label="中文名" align="center"></el-table-column>
                <el-table-column prop="userStatus" label="状态" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="320">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleUser(scope.$index, scope.row)">绑定角色</el-button>
                        <el-button size="mini" type="danger" @click="handleModify(scope.$index, scope.row)">修改密码
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleState(scope.$index, scope.row)">启用/禁用
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flexBlock">
                <div class="block">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size='pageSize'
                        layout="total, sizes, prev, pager, next, jumper" :total='total'>
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 新增用户弹窗 -->
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible" center>
            <el-form>
                <el-form-item label="用户名:" label-width="100px">
                    <el-input v-model="addUserValue.userNmae" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码:" label-width="100px">
                    <el-input v-model="addUserValue.passWord" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名:" label-width="100px">
                    <el-input v-model="addUserValue.addressName" placeholder="请输入用户姓名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消操作</el-button>
                <el-button type="primary" @click="determineAdd" style="margin-left: 260px;">确定添加
                </el-button>
            </div>
        </el-dialog>
        <!-- 修改密码弹窗 -->
        <el-dialog title="修改密码" :visible.sync="modifyFormVisible" center>
            <el-form>
                <el-form-item label="原密码:" label-width="100px">
                    <el-input v-model="modifyPassword.originalPassword" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" label-width="100px">
                    <el-input v-model="modifyPassword.newPassword" placeholder="请输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyFormVisible = false">取消操作</el-button>
                <el-button type="primary" @click="determineModify" style="margin-left: 260px;">确定修改
                </el-button>
            </div>
        </el-dialog>
        <!-- 启用、禁用弹窗 -->
        <el-dialog title="用户状态启用或禁用" :visible.sync="stateFormVisible" center>
            <el-form>
                <el-radio v-model="stateSwitch.delivery" label="1">启用</el-radio>
                <el-radio v-model="stateSwitch.delivery" label="0">禁用</el-radio>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="stateFormVisible = false">取消操作</el-button>
                <el-button type="primary" @click="determineState" style="margin-left: 260px;">确定修改
                </el-button>
            </div>
        </el-dialog>
        <!-- 绑定角色按钮 -->
        <el-dialog title="绑定角色" :visible.sync="userFormVisible" center>
            <el-checkbox-group v-model="bindUser.checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(city,index) in bindUser.data" :key="index" :label="city">
                    {{city.roleName}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userFormVisible = false">取消操作</el-button>
                <el-button type="primary" @click="determineuser" style="margin-left: 260px;">确认绑定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                input: '',
                tableData: [],
                total: 0,
                currentPage4: 1,
                pageSize: 10,
                current: 1,
                dialogFormVisible: false,
                modifyFormVisible: false,
                stateFormVisible: false,
                userFormVisible: false,
                query: {
                    name: '',
                },
                addUserValue: {
                    userNmae: "",
                    passWord: "",
                    addressName: ""
                },
                modifyPassword: {
                    id: "",
                    originalPassword: "",
                    newPassword: ""
                },
                stateSwitch: {
                    id: "",
                    delivery: '1'
                },
                bindUser: {
                    id: "",
                    checkedCities: [],
                    data: []
                }
            }
        },
        methods: {
            // 新增用户按钮
            addNews() {
                this.dialogFormVisible = true;
            },
            // 确定添加按钮
            determineAdd() {
                this.post({
                    url: "/manager/admin/addSysUser",
                    data: {
                        username: this.addUserValue.userNmae,
                        password: this.addUserValue.passWord,
                        cnName: this.addUserValue.addressName
                    },
                    onload: ({ data }) => {
                        this.dialogFormVisible = false;
                        this.pagePost();
                    }
                })
            },
            // 点击修改密码按钮
            handleModify(index, scope) {
                this.modifyFormVisible = true;
                this.modifyPassword.id = scope.id;
            },
            // 确定修改密码按钮
            determineModify() {
                this.post({
                    url: "manager/admin/updatePassword",
                    data: {
                        userId: this.modifyPassword.id,
                        password: this.modifyPassword.originalPassword,
                        newPwd: this.modifyPassword.newPassword
                    },
                    onload: ({ data }) => {
                        this.modifyFormVisible = false;
                        this.pagePost();
                    }
                })
            },
            // 点击启用、禁用按钮
            handleState(index, scope) {
                this.stateSwitch.id = scope.id;
                this.stateFormVisible = true;
            },
            // 确定状态处理按钮
            determineState() {
                this.post({
                    url: "/manager/admin/updateUserStatus",
                    headers: 'formData',
                    data: {
                        userId: this.stateSwitch.id,
                        userStatus: this.stateSwitch.delivery
                    },
                    onload: ({ data }) => {
                        this.stateFormVisible = false;
                        this.pagePost();
                    }
                })
            },
            // 绑定角色
            handleUser(index, scope) {
                this.bindUser.id = scope.id;
                this.userFormVisible = true;
                this.get({
                    url: "manager/role/getRoleList",
                    onload: ({ data }) => {
                        this.bindUser.data = data
                    }
                })
            },
            handleCheckedCitiesChange(value) {
                this.bindUser.checkedCities = value;
            },
            determineuser() {
                this.post({
                    headers: 'formData',
                    url: "/manager/admin/configUserRole",
                    data: {
                        userId: this.bindUser.id + '',
                        roleIds: this.bindUser.checkedCities
                    },
                    onload: ({ data }) => {
                        console.log('data', data);
                    }
                })
            },
            // 条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.pagePost();
            },
            // 页数
            handleCurrentChange(val) {
                this.current = val;
                this.pagePost();
            },
            // 获取页面数据
            pagePost() {
                this.post({
                    url: "/manager/admin/getSysUserByPage",
                    data: {
                        cnName: "",
                        current: this.current,
                        size: this.pageSize
                    },
                    onload: ({ data }) => {
                        this.total = Number(data.total);
                        this.tableData = [];
                        data.records.forEach(element => {
                            this.tableData.push({
                                id: element.id,
                                createTime: element.createTime,
                                username: element.username,
                                userStatus: element.userStatus == 1 ? '可用' : '不可用',
                                cnName: element.cnName
                            })
                        });
                    }
                })
            }
        },
        created() {
            this.pagePost()
        },
    }
</script>
<style scoped>
    .block {
        margin-top: 30px;
        float: right;
    }

    .flexBlock {
        width: 100%;
        height: 100px;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .handle-select {
        width: 120px;
    }

    .mr10 {
        margin-right: 10px;
    }
</style>
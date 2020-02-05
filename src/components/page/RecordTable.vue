<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户意见
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.type" placeholder="类型" class="handle-select mr10">
                </el-select>
                <el-select v-model="query.state" placeholder="状态" class="handle-select mr10">
                </el-select>
                <el-input v-model="query.addr" placeholder="地址" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="recordId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="nickname" label="用户名"></el-table-column>
                <el-table-column label="地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">{{scope.row.description}}</template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.typeMsg}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                effect="dark" :type="scope.row.state===0?'warning':(scope.row.state===1?'success':'info')"
                        >{{scope.row.stateMsg}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >审核
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNum"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 弹出框 -->
        <el-dialog title="审核" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.nickname" disabled></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="种类">
                    <el-input v-model="form.type" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="form.state" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    addr: null,
                    userId:null,
                    type:null,
                    state:null,
                    pageNum: 0,
                    pageSize: 10
                },
                tableData: [
                    {
                        'recordId': 71,
                        'userId': 11,
                        'createdTime': 1573474776288,
                        'nickname': 'noname',
                        'type': 0,
                        'typeMsg':'路况异常',
                        'description': '测试2',
                        'address': '广东省佛山市南海区信息大道南250号靠近教学大楼',
                        'state': 0,
                        'stateMsg':'未审核',
                    },
                    {
                        'recordId': 72,
                        'userId': 11,
                        'createdTime': 1573477470068,
                        'nickname': 'noname',
                        'type': 1,
                        'description': '测试1',
                        'address': '广东省佛山市南海区万锦路250号靠近华南师范大学南海校区',
                        'state': 1
                    }],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            //this.getData();
            this.tableData.forEach(item=>{
                item.createdTime=this.formatDateTime(item.createdTime)
            })
        },
        methods: {
            formatDateTime(time) {
                let date = new Date(time);
                return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                fetchData(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.list;
                    this.pageTotal = res.pageTotal || 50;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>

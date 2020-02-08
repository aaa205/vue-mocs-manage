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
                <el-select v-model="typeOption.value" placeholder="类型" class="handle-select mr10">
                    <el-option
                        v-for="option in typeOption"
                        :key="option.key"
                        :value="option.value"
                        :label="option.value"
                    ></el-option>
                </el-select>
                <el-select v-model="stateOption.value" placeholder="状态" class="handle-select mr10">
                    <el-option
                        v-for="option in stateOption"
                        :key="option.key"
                        :value="option.value"
                        :label="option.value"
                    ></el-option>
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
                <el-table-column prop="nickname" label="用户名" width="140" align="center"></el-table-column>
                <el-table-column label="地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">{{scope.row.description}}</template>
                </el-table-column>
                <el-table-column label="类型" align="center" prop="typeMsg" width="120">
                    <!-- <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.type===0?'success':(scope.row.type==='失败'?'danger':'')"
                        >{{scope.row.typeMsg}}
                        </el-tag>
                    </template>-->
                </el-table-column>
                <el-table-column label="状态" align="center" prop="state" width="100">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.stateMsg==='未审核'?'info':scope.row.stateMsg==='处理中'?'warning':scope.row.stateMsg==='已完成'?'success':'danger'"
                        >{{scope.row.stateMsg}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间" width="180" align="center"></el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >审核</el-button>
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
                    <el-input v-model="form.typeMsg" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="stateOption.value"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="option in stateOption"
                            :key="option.key"
                            :value="option.value"
                            :label="option.value"
                        ></el-option>
                    </el-select>
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
                userId: null,
                type: [],
                state: [],
                pageNum: 0,
                pageSize: 10
            },
            tableData: [
                {
                    recordId: 71,
                    userId: 11,
                    createdTime: 1573474776288,
                    nickname: 'noname',
                    type: 0,
                    typeMsg: '路况异常',
                    description: '测试2',
                    address: '广东省佛山市南海区信息大道南250号靠近教学大楼',
                    state: 0,
                    stateMsg: '未审核'
                },
                {
                    recordId: 72,
                    userId: 11,
                    createdTime: 1573477470068,
                    nickname: 'noname',
                    type: 1,
                    description: '测试1',
                    address: '广东省佛山市南海区万锦路250号靠近华南师范大学南海校区',
                    state: 1
                }
            ],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            stateOption: [
                { key: 0, value: '未审核' },
                { key: 1, value: '处理中' },
                { key: 2, value: '已完成' }
            ],
            typeOption: [
                { key: 0, value: '路况异常' },
                { key: 1, value: '设施故障' },
                { key: 2, value: '设施设置不合理' },
                { key: 3, value: '其他' }
            ]
        };
    },
    created() {
        //this.getData();
        this.tableData.forEach(item => {
            item.createdTime = new Date(item.createdTime).toLocaleString();
            switch (item.state) {
                case 0:
                    item.stateMsg = '未审核';
                    break;
                case 1:
                    item.stateMsg = '处理中';
                    break;
                case 2:
                    item.stateMsg = '已完成';
                    break;
                default:
                    item.stateMsg = '异常';
                    break;
            }
            switch (item.type) {
                case 0:
                    item.typeMsg = '路况异常';
                    break;
                case 1:
                    item.typeMsg = '设施故障';
                    break;
                case 2:
                    item.typeMsg = '设施设置不合理';
                    break;
                case 3:
                    item.typeMsg = '其他';
                    break;
                default:
                    item.typeMsg = '未知类型';
                    break;
            }
        });
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
            // this.tableData[this.idx].state = this.form.stateO
            // this.tableData[this.idx].stateMsg = this.stateStrings
            switch (this.stateOption.value) {
                case '未审核':
                case '处理中':
                case '已完成':
                    this.tableData[this.idx].stateMsg = this.stateOption.value;
                    break;
                default:
                    this.tableData[this.idx].stateMsg = '异常';
                    break;
            }
            // alert(this.stateOption.value);
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
    width: 150px;
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

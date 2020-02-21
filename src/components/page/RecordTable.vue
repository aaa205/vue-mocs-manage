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
                <el-select
                    v-model="typeOption.value"
                    clearable
                    placeholder="类型"
                    class="handle-select mr10"
                >
                    <el-option
                        v-for="option in typeOption"
                        :key="option.key"
                        :value="option.value"
                        :label="option.value"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="stateOption.value"
                    clearable
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option
                        v-for="option in stateOption"
                        :key="option.key"
                        :value="option.value"
                        :label="option.value"
                    ></el-option>
                </el-select>
                <el-input v-model="addrQuery" clearable placeholder="地址" class="handle-input mr10"></el-input>
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
                <el-table-column label="类型" align="center" prop="typeMsg" width="120"></el-table-column>
                <el-table-column label="状态" align="center" prop="stateMsg" width="100">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.stateMsg==='未审核'?'info':scope.row.stateMsg==='处理中'?'warning':scope.row.stateMsg==='已完成'?'success':'danger'"
                        >{{scope.row.stateMsg}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="localtime" label="创建时间" width="180" align="center"></el-table-column>
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >审核</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-refrigerator"
                            @click="handleProgress(scope.$index, scope.row)"
                        >进度</el-button>
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
                    <el-select v-model="stateOptionInForm.value" class="handle-select mr10">
                        <el-option
                            v-for="option in stateOptionInForm"
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

        <el-dialog title="进度" :visible.sync="timelineVisible" width="30%">
            <el-timeline :reverse="true">
                <el-timeline-item
                    v-for="(step, index) in steps"
                    :key="index"
                    :timestamp="step.timestamp"
                >{{step.description}}</el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleProgressUpdate">进度更新</el-button>
                <el-button @click="timelineVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 弹出输入框 -->
        <el-dialog :visible.sync="inputVisible" width="30%">
            <el-form :model="progressDesc" label-width="70px">
                <el-input v-model="progressDesc"></el-input>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="inputVisible = false">取 消</el-button>
                <el-button type="primary" @click="addProgress">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchRecordList, fetchRecordSteps, updateRecordState, updateProgress } from '../../api';
export default {
    name: 'basetable',
    data() {
        return {
            backupData: [],         //搜索时进行备份，上传时使用
            query: {                //初始模板的变量
                addr: null,
                userId: null,
                type: [],
                state: [],
                pageNum: 0,
                pageSize: 10
            },
            addrQuery: '',         //与地址搜索栏绑定
            progressDesc: '',      //与step输入栏绑定
            stateMsg: [],          //用于表格上显示状态信息
            typeMsg: [],           //用于表格上显示类型信息
            tableData: [           //用于表格上所有的数据
                {
                    recordId: 71,
                    userId: 11,
                    createdTime: 1573474776288,
                    localtime: '',
                    nickname: 'noname',
                    type: 0,
                    description: '测试1232',
                    address: '广东省佛山市南海区信息大道南250号靠近教学大楼',
                    state: 0,
                    stateMsg: '',   
                    typeMsg: ''     
                }
            ],
            steps: [
                {
                    stepId: 0,
                    description: '',
                    createdTime: 0,
                    timestamp: ''           //时间线的时间戳
                }
            ],
            multipleSelection: [],          //模板数据
            delList: [],                    //模板数据
            editVisible: false,             //控制审核弹窗显示
            timelineVisible: false,         //控制进度（时间线）弹窗显示
            inputVisible: false,            //控制添加进度弹窗显示
            pageTotal: 0,                   //模板数据，总页数
            form: {},                       //审核弹窗内表单的数据
            idx: 0,                         //用于选择操作时确定当前选中的某一行的索引
            stateOption: [                  //搜索状态下拉内容
                { key: 0, value: '未审核' },
                { key: 1, value: '处理中' },
                { key: 2, value: '已完成' },
                { key: 3, value: '' }
            ],
            typeOption: [                   //搜索类型下拉内容
                { key: 0, value: '路况异常' },
                { key: 1, value: '设施故障' },
                { key: 2, value: '设施设置不合理' },
                { key: 3, value: '' }
            ],
            stateOptionInForm: [            //审核表单中修改状态的下拉菜单
                { key: 0, value: '未审核' },
                { key: 1, value: '处理中' },
                { key: 2, value: '已完成' },
                { key: 3, value: '' }
            ]
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 初始格式化数据
        format() {
            this.tableData.forEach((item, index) => {
                item.localtime = new Date(item.createdTime).toLocaleString();
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
                        this.type = '未知类型';
                        break;
                }
            });
            this.backupData = this.tableData;
        },
        // 获取服务器中records数据
        getData() {
            fetchRecordList().then(res => {
                this.tableData = res;
                this.pageTotal = this.tableData.length;
                this.format();
            });
        },
        // 触发搜索按钮
        handleSearch() {
            //刷新
            if (!this.typeOption.value && !this.stateOption.value && !this.addrQuery) {
                this.tableData = this.backupData;
            } else {
                this.queryData();
            }
        },
        // 查找功能
        queryData() {
            this.tableData = this.backupData;
            let typeValue = this.typeOption.value;
            let stateValue = this.stateOption.value;
            let addrValue = this.addrQuery;
            let queryList = [];
            this.tableData.forEach(data => {
                if (
                    typeValue === data.typeMsg &&
                    (!stateValue || stateValue === data.stateMsg) &&
                    (!addrValue || data.address.includes(addrValue))
                ) {
                    queryList.push(data);
                } else if (
                    (!typeValue || typeValue === data.typeMsg) &&
                    stateValue === data.stateMsg &&
                    (!addrValue || data.address.includes(addrValue))
                ) {
                    queryList.push(data);
                } else if (
                    (!typeValue || typeValue === data.typeMsg) &&
                    (!stateValue || stateValue === data.stateMsg) &&
                    data.address.includes(addrValue)
                ) {
                    queryList.push(data);
                }
                this.searched = true;
            });
            this.tableData = queryList;
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作弹出
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            fetchRecordSteps(this.form.recordId).then(res => {
                this.steps = res;
                this.steps.forEach(step => {
                    this.$set(step, 'timestamp', new Date().toLocaleString()); //这步可能会导致卡顿
                });
            });
        },
        //进度（时间轴）弹出操作
        handleProgress(index, row) {
            this.idx = index;
            this.form = row;
            this.stateMsg[row.state];
            this.timelineVisible = true;
            fetchRecordSteps(this.form.recordId).then(res => {
                this.steps = res;
                this.steps.forEach(step => {
                    step.timestamp = new Date(step.createdTime).toLocaleString();
                });
            });
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            let index = this.idx;
            let step = this.steps;
            let tableData = this.tableData[this.idx];
            this.tableData[this.idx].state = this.form.stateO;
            this.tableData[this.idx].stateMsg = this.stateStrings;
            switch (this.stateOptionInForm.value) {
                case '未审核':
                    if (tableData.state != 0) {
                        tableData.state = 0;
                    }
                    break;
                case '处理中':
                    if (tableData.state != 1) {
                        tableData.state = 1;
                    }
                    break;
                case '已完成':
                    if (tableData.state != 2) {
                        tableData.state = 2;
                    }
                    break;
                default:
                    break;
            }
            tableData.stateMsg = this.stateOptionInForm.value;
            this.stateOptionInForm.value = '';
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            updateRecordState(this.tableData[this.idx].recordId, this.tableData[this.idx].state).then();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 时间线添加弹出操作
        handleProgressUpdate() {
            this.inputVisible = true;
        },
        // 提交step desc
        addProgress() {
            this.inputVisible = false;
            updateProgress(this.tableData[this.idx].recordId, this.progressDesc).then();
            this.$message.success(`添加成功`);
            let date = new Date();
            this.$set(this.steps, this.steps.length, {
                stepId: this.steps[this.idx].stepId,
                createdTime: date.getTime(),
                description: this.progressDesc,
                timestamp: date.toLocaleString()
            });
            this.progressDesc = '';
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

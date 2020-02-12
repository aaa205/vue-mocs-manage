<template>
    <div>
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="8">
                <el-card shadow="hover" style="height:252px; ">
                    <div slot="header" class="clearfix">
                        <span>意见状态</span>
                    </div>
                    <div v-for="item in data.stateList">{{stateStrings[item.code]}} &nbsp&nbsp {{item.quantity}}条
                        <el-progress :percentage="parseInt(100*item.quantity/data.recordQuantity)" color="#42b983"></el-progress>
                    </div>

                </el-card>
                <el-card shadow="hover" style="height:252px; margin-top: 18px">
                    <div slot="header" class="clearfix">
                        <span>种类分布</span>
                    </div>
                    <div v-for="item in data.typeList">{{typeStrings[item.code]}} &nbsp&nbsp {{item.quantity}}条
                        <el-progress :percentage="parseInt(100*item.quantity/data.recordQuantity)" color="#42b983"></el-progress>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{data.userQuantity}}</div>
                                    <div>用户量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num" style="color: #64d572">{{data.newsQuantity}}</div>
                                    <div>发布新闻</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-comment grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{data.recordQuantity}}</div>
                                    <div>意见数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="editVisible=true">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item">{{scope.row}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-delete" @click="removeTodoItem(scope)" ></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="添加待办事项" :visible.sync="editVisible" width="30%">
            <el-form ref="todoItem" label-width="70px">
                <el-form-item label="内容">
                    <el-input v-model="todoItem" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="pushTodoItem">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchIndex } from '../../api';

    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                typeStrings: this.$global.typeStrings,
                stateStrings:this.$global.stateStrings,
                data:[],
                todoItem:'',
                todoList: JSON.parse(localStorage.getItem('todo_list')),
                editVisible:false
            };
        },
        created() {
            this.fetchData();

        },
        methods: {
            //保存到本地
            saveTodoList(){
                localStorage.setItem('todo_list',JSON.stringify(this.todoList));
            },
            removeTodoItem(item){
                let rmIndex=this.todoList.findIndex((i)=>i==item);
                this.todoList.splice(rmIndex,1);
                this.saveTodoList()
            },
            pushTodoItem(){
              this.todoList.push(this.todoItem);
              this.todoItem='';
              this.editVisible=false;
              this.saveTodoList();
            },
            //获取首页数据
            fetchData() {
                fetchIndex().then(resp => {
                    this.data=resp;
                });
            }
        }
    };
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>

<template>
    <div v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-news"></i> 新闻编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-input v-model="news.title" maxlength="24" minlength="3" show-word-limit placeholder="请输入标题"></el-input>
            <quill-editor ref="myTextEditor" v-model="news.content" :options="editorOption"></quill-editor>
            <el-row>
                <el-col :span="3">
                    <el-upload
                            class="upload-block"
                            accept=".jpg,.jpeg,.png"
                            action="#"
                            :auto-upload="false"
                            :limit='1'
                            :file-list="fileList"
                            :show-file-list="false"
                            :on-change="handleChange"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传封面</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                    </el-upload>
                </el-col>
                <el-col :span="1"><img width="100px" height="60px" v-if="news.cover" :src="news.cover"></el-col>
            </el-row>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>

    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import { fetchNews, postNews, updateNews } from '../../api';

    export default {
        name: 'editor',
        data: function() {
            return {
                news: {
                    title: '',
                    content: '',
                    cover: ''
                },
                id: -1,
                loading: false,
                fileList: [],
                editorOption: {}
            };
        },
        components: {
            quillEditor
        },
        created() {

        },
        beforeRouteEnter(to, from, next) {
            //有指定的newsid 重新加载
            let id = to.query.id;
            next(vm => {
                vm.id = id;
                if (vm.id != -1) {
                    fetchNews(vm.id).then(resp => {
                        vm.news = resp;
                    });
                }
            });
        },
        methods: {
            //转base64保存
            handleChange(file, fileList) {
                let reader = new FileReader();
                reader.onload = () => {
                    let base64 = reader.result;
                    this.news.cover = base64;
                };
                reader.readAsDataURL(file.raw);
            },
            submit() {
                this.loading = true;
                //检查是否填满
                let news = this.news;
                if (news.title.length == 0 || news.content.length == 0 || news.cover.length == 0) {
                    this.$message.error('请确保填写完标题、正文、封面');
                    this.loading = false;
                    return;
                }
                //创建新的News
                if(this.id>0) {
                    //覆盖news
                    updateNews(this.id,this.news).then(resp=>{
                        this.$message.success(resp)
                    }).finally(()=>this.loading = false)
                }else{
                    postNews(this.news).then(resp => {
                        this.$message.success(resp);
                    }).catch(() => {
                        this.$message.error('上传失败');
                    }).finally(() => {
                        this.loading = false;
                    });
                }

            }
        }
    };
</script>
<style scoped>
    .editor-btn {
        margin-top: 20px;
    }

    .upload-block {
        margin-top: 10px;
        width: 360px;
    }
</style>

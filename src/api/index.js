import request from '../utils/request';

export const fetchIndex = () => {
    return request({
        url: './index',
        method: 'get'
    });
};
export const postNews = (data) => {
    return request({
        url:'./news',
        method: 'post',
        data:data,
    });
};
export const fetchNewsList=(params)=>{
    return request({
        url:'./news',
        method:'get',
        params:params
    });
};
export const fetchNews=(newsId)=>{
    return request({
        url:`./news/${newsId}`,
        method:'get'
    })
}
export const updateNews=(id,data)=>{
    return request({
        url:`./news/${id}`,
        method:'put',
        data:data
    })
}
export const uploadImg=(file)=>{
    let form=new FormData();
    form.append('smfile',file)
    return request({
        url:'./upload',
        method:'post',
        headers:{
            'Authorization':'DiQMO10k4SkZk5caKQ4FmPnwRLLea1j1'
        },
        data:form
    })
}

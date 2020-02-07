import request from '../utils/request';

export const fetchTypeStatistics = () => {
    return request({
        url: './records/type-statistics',
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

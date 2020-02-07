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
    })
};


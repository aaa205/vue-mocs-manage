import request from '../utils/request';
import qs from 'qs';
export const fetchTypeStatistics = () => {
    return request({
        url: './records/type-statistics',
        method: 'get'
    });
};
export const postNews = (data) => {
    return request({
        url: './news',
        method: 'post',
        data: data,
    });
};
export const fetchNewsList = (params) => {
    return request({
        url: './news',
        method: 'get',
        params: params
    });
};
export const fetchNews = (newsId) => {
    return request({
        url: `./news/${newsId}`,
        method: 'get'
    })
}
export const updateNews = (id, data) => {
    return request({
        url: `./news/${id}`,
        method: 'put',
        data: data
    })
}
export const fetchRecordList = () => {
    return request({
        url: '/records',
        method: 'get'
    });
};
export const updateRecordState = (recordId, state) => {
    return request({
        url: `/records/${recordId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            state: state
        },
        transformRequest: [data => {
            let ret = ''
            ret = qs.stringify(data);
            return ret;
        }]
    });
};
export const fetchRecordSteps = (recordId) => {
    return request({
        url: `/records/${recordId}/steps`,
        method: 'get'
    });
};
export const updateProgress = (recordId, desc) => {
    return request({
        url: `/records/${recordId}/steps`,
        method: 'post',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        data: {
            description: desc
        }
        // transformRequest: [data => {
        //     let ret = ''
        //     ret = qs.stringify(data);
        //     return ret;
        // }]
    });
};
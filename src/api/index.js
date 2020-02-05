import request from '../utils/request';

export const fetchTypeStatistics = () => {
    return request({
        url: './records/type-statistics',
        method: 'get'
    });
};

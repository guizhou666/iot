//模板管理

const Mock = require('mockjs')

const data = Mock.mock({
    'item|23': [
        {
            "id": '@id',
            "code|+1": 1000,
            "name": '@name',
            "type|1": ['主表', '单表', '子表', '单表(树)'],
            "version|1": ['1.0','1.1','2.0'],
            "serve": '@name',
            "description": '@cparagraph',
            "createdTime": '@datetime',
        }
    ]
})

module.exports = [
    {
        url: '/vue-admin-template/template/getCharts',
        type: 'get',
        response: config => {
            const { query: { current, size } } = config
            return {
                code: '200',
                data: {
                    current,
                    pages: 1,
                    records: data.item,
                    size,
                    total: 23
                },
                message: '成功'
            }
        }
    },

]
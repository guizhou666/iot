//模板管理

const Mock = require('mockjs')

const data = Mock.mock({
    'item|23': [
        {
            "id": '@id',
            "code|+1": 1000,
            "name": '@name',
            "type|1": ['通用', '系统', '邮件', '短信'],
            "description": '@cparagraph',
            "update": '@datetime',
        }
    ]
})

module.exports = [
    {
        url: '/vue-admin-template/template/getTemplate',
        type: 'get',
        response: config => {
            const { query: { current, size } } = config

            return {
                code: '200',
                data: {
                    current,
                    pages: 1,
                    records: data.item.splice((current - 1) * size, current * size),
                    size,
                    total: 23
                },
                message: '成功'
            }
        }
    },
   
]
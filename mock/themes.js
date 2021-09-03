const themes = {
    default: {
        themeName: 'default'
    },
    htsy: {
        themeName: 'htsy'
    },
    yxt: {
        themeName: 'yxt'
    },
    yyzc: {
        themeName: 'yyzc'
    },
}

module.exports = [
    // themes select
    {
        url: '/vue-admin-template/themes/getThemes\.*',
        type: 'get',
        response: config => {
            const { themesType } = config.query
            const name = themes[themesType]

            // mock error
            if (!name) {
                return {
                    code: 60204,
                    message: 'please select correct Themes.'
                }
            }

            return {
                code: 20000,
                data: name
            }
        }
    },
]
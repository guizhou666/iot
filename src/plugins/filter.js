export default vue => {
    vue.filter('isNull', (value) => {
        if (!value) return '--'
        return value
    })
    // 将时间转换为 年月日格式
    vue.filter('day', (val) => {
        if (!val) return
        let time = new Date(val)
        let year = time.getFullYear()
        let month = String(time.getMonth() + 1)
        let day = String(time.getDate())
        if (month.length == 1) {
            month = month.padStart(2, 0)
        }
        if (day.length == 1) {
            day = day.padStart(2, 0)
        }
        return `${year}-${month}-${day}`
    })
}


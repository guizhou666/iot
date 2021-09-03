
export default vue => {
    vue.directive('has', {
        bind(el, binging) {

            // 路由跳转后控制按钮显示隐藏，避免当前菜单信息获取延迟的问题。

            // 获取当前选中的菜单信息
            let activeMenu = JSON.parse(localStorage.getItem('activeMenu'))

            if (activeMenu && activeMenu.childList) {
                // 获取当前菜单包含的按钮列表
                const buttonList = activeMenu.childList
                let isShow, resourceAlias


                buttonList.map(item => {
                    if (item.name == el.innerText || item.resourceAlias == el.innerText) {
                        isShow = true
                        resourceAlias = item.resourceAlias
                    }
                })
                if (!isShow) {
                    el.style.display = 'none'
                }
                if (resourceAlias) {
                    el.innerText = resourceAlias
                }
            }
        },
        inserted(el, binging) {
            el.title = el.innerText
        }
    })

}
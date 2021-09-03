const getters = {
    showSettingDrawer: state => state.app.showSettingDrawer,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    
    relevanceResource: state => state.app.relevanceResource,
    appInfo: state => state.app.appInfo,
    userInfo: state => state.user.userInfo,
    directorys: state => state.app.directorys,
    menus: state => state.app.menus,
    activeDirectory: state => state.app.activeDirectory,
    activeMenu: state => state.app.activeMenu,
    theme: state => state.app.theme,
    activeUrl: state => state.app.activeUrl,
    isCollapse: state => state.app.isCollapse,
    showSideMenu: state => state.app.showSideMenu,
}
export default getters

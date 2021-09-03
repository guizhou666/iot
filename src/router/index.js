import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import SubLayout from '@/layout/SubLayout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */


export const constantRoutes = [{
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'Home',
            component: () =>
                import ('@/views/home/index'),
        }]
    },
    {
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/nomenu',
        component: Layout,
        hidden: true
    },
    { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [{
        path: '/roleManagement',
        component: Layout,
        redirect: '/roleManagement/table',
        name: 'Role',
        meta: { title: '角色管理', icon: 'tree', keepAlive: true },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/common/roleManagement'),
                meta: { title: '角色管理', icon: 'tree', keepAlive: true, breadcrumb: false, }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/common/roleManagement/addorEdit'),
                meta: { title: '添加角色', icon: 'tree' },
                hidden: true
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/common/roleManagement/addorEdit'),
                meta: { title: '修改角色', icon: 'tree' },
                hidden: true
            },
            {
                path: 'access',
                name: 'Access',
                component: () =>
                    import ('@/views/common/roleManagement/accessConfiguration'),
                meta: { title: '权限配置', icon: 'tree' },
                hidden: true
            }
        ]
    },
    {
        path: '/userManagement',
        component: Layout,
        redirect: '/userManagement/table',
        name: 'Role',
        meta: { title: '用户管理', icon: 'tree' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/common/userManagement'),
                meta: { title: '用户管理', icon: 'tree', breadcrumb: false }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/common/userManagement/addorEdit'),
                meta: { title: '添加用户', icon: 'tree' },
                hidden: true
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/common/userManagement/addorEdit'),
                meta: { title: '修改用户', icon: 'tree' },
                hidden: true
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/common/userManagement/detail'),
                meta: { title: '用户详情', icon: 'tree' },
                hidden: true
            }
        ]
    },
    {
        path: '/resourceManagement',
        component: Layout,
        redirect: '/resourceManagement/table',
        name: 'ResourceManage',
        meta: { title: '资源管理', icon: 'tree' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/operation/resourceManagement'),
                meta: { title: '资源管理', icon: 'tree', breadcrumb: false }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/operation/resourceManagement/addOrEdit'),
                hidden: true,
                meta: { title: '添加资源', icon: 'tree' }
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/operation/resourceManagement/addOrEdit'),
                hidden: true,
                meta: { title: '修改资源', icon: 'tree' }
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/operation/resourceManagement/detail'),
                hidden: true,
                meta: { title: '查看资源', icon: 'tree' }
            }
        ]
    },
    {
        path: '/tenementManagement',
        component: Layout,
        redirect: '/tenementManagement/table',
        name: 'ResourceManage',
        meta: { title: '租户管理', icon: 'tree' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/tenement/tenementManagement'),
                meta: { title: '租户管理', icon: 'tree', breadcrumb: false }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/tenement/tenementManagement/addOrEdit'),
                hidden: true,
                meta: { title: '添加租户', icon: 'tree' }
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/tenement/tenementManagement/addOrEdit'),
                hidden: true,
                meta: { title: '修改租户', icon: 'tree' }
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/tenement/tenementManagement/detail'),
                hidden: true,
                meta: { title: '查看租户', icon: 'tree' }
            },
            {
                path: 'product',
                name: 'product',
                component: SubLayout,
                redirect: '/tenementManagement/product/table',
                meta: { title: '产品配置', icon: 'tree' },
                hidden: true,
                children: [{
                        path: 'table',
                        component: () =>
                            import ('@/views/tenement/tenementManagement/productConfiguration'),
                        hidden: true,
                        meta: { title: '产品配置', icon: 'tree', breadcrumb: false }
                    },
                    {
                        path: 'add',
                        name: 'Add',
                        component: () =>
                            import ('@/views/tenement/tenementManagement/productConfiguration/addOrEdit'),
                        hidden: true,
                        meta: { title: '添加产品', icon: 'tree' }
                    },
                    {
                        path: 'edit',
                        name: 'Edit',
                        component: () =>
                            import ('@/views/tenement/tenementManagement/productConfiguration/addOrEdit'),
                        hidden: true,
                        meta: { title: '修改产品', icon: 'tree' }
                    },
                    {
                        path: 'detail',
                        name: 'Detail',
                        component: () =>
                            import ('@/views/tenement/tenementManagement/productConfiguration/detail'),
                        hidden: true,
                        meta: { title: '查看产品', icon: 'tree' }
                    }
                ]
            }
        ]
    },
    {
        path: '/productManagement',
        component: Layout,
        redirect: '/productManagement/table',
        name: 'ProductManagement',
        meta: { title: '产品管理', icon: 'tree' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/common/productManagement'),
                meta: { title: '产品管理', icon: 'tree', breadcrumb: false }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/common/productManagement/addOrEdit'),
                hidden: true,
                meta: { title: '添加产品', icon: 'tree' }
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/common/productManagement/addOrEdit'),
                hidden: true,
                meta: { title: '修改产品', icon: 'tree' }
            },
            {
                path: 'update',
                name: 'Update',
                component: () =>
                    import ('@/views/common/productManagement/addOrEdit'),
                hidden: true,
                meta: { title: '更新产品', icon: 'tree' }
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/common/productManagement/detail'),
                hidden: true,
                meta: { title: '查看产品', icon: 'tree' }
            },
            {
                path: 'access',
                name: 'access',
                component: () =>
                    import ('@/views/common/productManagement/accessConfiguration'),
                hidden: true,
                meta: { title: '资源配置', icon: 'tree' }
            }
        ]
    },
    {
        path: '/organizationManagement',
        component: Layout,
        redirect: '/organizationManagement/table',
        name: 'ProductManagement',
        meta: { title: '机构管理', icon: 'tree' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/organization/organizationManagement'),
                meta: { title: '机构管理', icon: 'tree', breadcrumb: false }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/organization/organizationManagement/addOrEdit'),
                hidden: true,
                meta: { title: '添加机构', icon: 'tree' }
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/organization/organizationManagement/addOrEdit'),
                hidden: true,
                meta: { title: '修改机构', icon: 'tree' }
            },
            {
                path: 'update',
                name: 'Update',
                component: () =>
                    import ('@/views/organization/organizationManagement/addOrEdit'),
                hidden: true,
                meta: { title: '更新机构', icon: 'tree' }
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/organization/organizationManagement/detail'),
                hidden: true,
                meta: { title: '查看机构', icon: 'tree' }
            },
            {
                path: 'product',
                name: 'product',
                component: SubLayout,
                redirect: '/organizationManagement/product/table',
                meta: { title: '产品配置', icon: 'tree' },
                hidden: true,
                children: [{
                        path: 'table',
                        component: () =>
                            import ('@/views/organization/organizationManagement/productConfiguration'),
                        hidden: true,
                        meta: { title: '产品配置', icon: 'tree', breadcrumb: false }
                    },
                    {
                        path: 'add',
                        name: 'Add',
                        component: () =>
                            import ('@/views/organization/organizationManagement/productConfiguration/addOrEdit'),
                        hidden: true,
                        meta: { title: '添加产品', icon: 'tree' }
                    },
                    {
                        path: 'edit',
                        name: 'Edit',
                        component: () =>
                            import ('@/views/organization/organizationManagement/productConfiguration/addOrEdit'),
                        hidden: true,
                        meta: { title: '修改产品', icon: 'tree' }
                    },
                    {
                        path: 'detail',
                        name: 'Detail',
                        component: () =>
                            import ('@/views/organization/organizationManagement/productConfiguration/detail'),
                        hidden: true,
                        meta: { title: '查看产品', icon: 'tree' }
                    }
                ]
            }
        ]
    },
    {
        path: '/personalManagement',
        component: Layout,
        redirect: '/personalManagement/table',
        name: 'personalManagement',
        meta: { title: '人员管理', icon: 'tree' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/organization/personalManagement'),
                meta: { title: '人员管理', icon: 'tree', keepAlive: true, breadcrumb: false, }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/organization/personalManagement/addOrEdit'),
                hidden: true,
                meta: { title: '添加人员', icon: 'tree' }
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/organization/personalManagement/addOrEdit'),
                hidden: true,
                meta: { title: '修改人员', icon: 'tree' }
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/organization/personalManagement/detail'),
                hidden: true,
                meta: { title: '查看人员', icon: 'tree' }
            }
        ]
    },
    {
        path: '/opractionLog',
        component: Layout,
        redirect: '/opractionLog/table',
        name: 'opractionLog',
        meta: { title: '操作日志', icon: 'el-icon-s-help' },
        children: [{
            path: 'table',
            name: 'Table',
            component: () =>
                import ('@/views/common/opractionLog'),
            meta: {
                title: '操作日志',
                icon: 'tree',
                breadcrumb: false
            }
        }]
    },
    {
        path: '/loginLog',
        component: Layout,
        redirect: '/loginLog/table',
        name: 'loginLog',
        meta: { title: '登录日志', icon: 'el-icon-s-help' },
        children: [{
            path: 'table',
            name: 'Table',
            component: () =>
                import ('@/views/common/loginLog'),
            meta: {
                title: '登录日志',
                icon: 'tree',
                breadcrumb: false
            }
        }]
    },
    {
        path: '/recycleBin',
        component: Layout,
        redirect: '/recycleBin/table',
        name: 'recycleBin',
        meta: { title: '回收站', icon: 'el-icon-s-help' },
        children: [{
            path: 'table',
            name: 'Table',
            component: () =>
                import ('@/views/common/recycleBin'),
            meta: {
                title: '回收站',
                icon: 'tree',
                breadcrumb: false
            }
        }]
    },
    {
        path: '/personalInfo',
        component: Layout,
        redirect: '/personalInfo/table',
        name: 'personalInfo',
        meta: { title: '个人档案', icon: 'el-icon-s-help' },
        children: [{
            path: 'table',
            name: 'Table',
            component: () =>
                import ('@/views/common/userInfo'),
            meta: {
                title: '个人档案',
                icon: 'tree',
                breadcrumb: false
            }
        }, ]
    },
    {
        path: '/parameter',
        component: Layout,
        redirect: '/parameter/table',
        name: 'parameter',
        meta: { title: '参数配置', icon: 'el-icon-s-help' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/common/parameter'),
                meta: {
                    title: '参数配置',
                    icon: 'tree',
                    breadcrumb: false
                }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/common/parameter/addOrEdit'),
                meta: {
                    title: '添加参数',
                    icon: 'tree'
                }
            },
            {
                path: 'edit',
                name: 'Edit',
                component: () =>
                    import ('@/views/common/parameter/addOrEdit'),
                meta: {
                    title: '修改参数',
                    icon: 'tree'
                }
            },
            {
                path: 'detail',
                name: 'Detail',
                component: () =>
                    import ('@/views/common/parameter/detail'),
                meta: {
                    title: '参数详情',
                    icon: 'tree'
                }
            },
        ]
    },
    {
        path: '/messageCentre',
        component: Layout,
        redirect: '/messageCentre/table',
        name: 'messageCentre',
        meta: { title: '消息中心', icon: 'el-icon-s-help' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/common/messageCentre'),
                meta: {
                    title: '消息中心',
                    icon: 'tree',
                    breadcrumb: false
                }
            },
            {
                path: 'detail',
                name: 'detail',
                component: () =>
                    import ('@/views/common/messageCentre/components/detail.vue'),
                meta: {
                    title: '消息详情',
                    icon: 'tree'
                }
            }
        ]
    },
    {
        path: '/myProduce',
        component: Layout,
        redirect: '/myProduce/table',
        name: 'myProduce',
        meta: {
            title: '我的产品',
            icon: 'el-icon-s-help',
            breadcrumb: true
        },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/common/myProduct'),
                meta: {
                    title: '我的产品',
                    icon: 'tree',
                    breadcrumb: false
                }
            },
            {
                path: 'detail',
                name: 'myProduceDetail',
                component: () =>
                    import ('@/views/common/myProduct/components/detail.vue'),
                meta: {
                    title: '查看产品详情',
                    icon: 'tree'
                }
            },
            {
                path: 'setting',
                name: 'myProduceSetting',
                component: () =>
                    import ('@/views/common/myProduct/components/setting.vue'),
                meta: {
                    title: '个性化设置',
                    icon: 'tree'
                }
            }
        ]
    },
    {
        path: '/organization',
        name: 'organization',
        redirect: '/organization/table',
        component: Layout,
        meta: { title: '岗位管理', icon: 'tree', keepAlive: true },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/organization/postManagement'),
                meta: {
                    title: '岗位管理',
                    icon: 'tree',
                    keepAlive: true,
                    breadcrumb: false,
                }
            },
            {
                path: 'addPost',
                name: 'addPost',
                component: () =>
                    import ('@/views/organization/postManagement/addPost'),
                meta: {
                    title: '添加岗位',
                    icon: 'tree',
                    //   keepAlive: true
                }
            },
            {
                path: 'editPost',
                name: 'editPost',
                component: () =>
                    import ('@/views/organization/postManagement/addPost'),
                meta: {
                    title: '修改岗位',
                    icon: 'tree',
                    //   keepAlive: true
                }
            },
            {
                path: 'postDetail',
                name: 'postDetail',
                component: () =>
                    import ('@/views/organization/postManagement/components/postDetail.vue'),
                meta: {
                    title: '查看岗位详情',
                    icon: 'tree',
                    source: 'post'
                },
                children: [{
                    path: 'userDetail',
                    name: 'userDetail',
                    component: () =>
                        import ('@/views/organization/components/personDetail.vue'),
                    meta: {
                        title: '查看人员详情',
                        icon: 'tree',
                    }
                }]
            }
        ]
    },
    {
        path: '/departmentManagement',
        name: 'departmentManagement',
        redirect: '/departmentManagement/table',
        component: Layout,
        meta: { title: '部门管理', icon: 'tree' },
        children: [{
                path: 'table',
                component: () =>
                    import ('@/views/organization/departmentManagement'),
                meta: {
                    title: '部门管理',
                    icon: 'tree',
                    breadcrumb: false
                }
            },
            {
                path: 'detail',
                component: () =>
                    import ('@/views/organization/departmentManagement/detail'),
                meta: {
                    title: '查看部门详情',
                    icon: 'tree'
                },
                children: [{
                    path: 'userDetail',
                    name: 'userDetail',
                    component: () =>
                        import ('@/views/organization/components/personDetail.vue'),
                    meta: {
                        title: '查看人员详情',
                        icon: 'tree'
                    }
                }]
            },
            {
                path: 'addDepartment',
                component: () =>
                    import ('@/views/organization/departmentManagement/addDepartment'),
                meta: {
                    title: '添加部门',
                    icon: 'tree'
                }
            },
            {
                path: 'editDepartment',
                component: () =>
                    import ('@/views/organization/departmentManagement/addDepartment'),
                meta: {
                    title: '修改部门',
                    icon: 'tree'
                }
            },
        ]
    },
    {
        path: '/dataDictionary',
        name: 'dataDictionary',
        redirect: '/dataDictionary/table',
        component: Layout,
        meta: {
            title: '数据字典',
            icon: 'tree',
        },
        children: [{
                path: 'table',
                component: () =>
                    import ('@/views/dataDictionary'),
                meta: {
                    title: '数据字典',
                    icon: 'tree',
                    breadcrumb: false,
                }
            },
            {
                path: 'add',
                component: () =>
                    import ('@/views/dataDictionary/components/add'),
                meta: {
                    title: '添加字典',
                    icon: 'tree'
                }
            },
            {
                path: 'edit',
                component: () =>
                    import ('@/views/dataDictionary/components/add'),
                meta: {
                    title: '修改字典',
                    icon: 'tree'
                }
            },
            {
                path: 'detail',
                component: () =>
                    import ('@/views/dataDictionary/components/detail'),
                meta: {
                    title: '数据字典详情',
                    icon: 'tree'
                }
            },
        ]
    },
    {
        path: '/innerMessage',
        name: 'innerMessage',
        redirect: '/innerMessage/table',
        component: Layout,
        meta: {
            title: '站内信',
        },
        children: [{
                path: 'table',
                component: () =>
                    import ('@/views/common/innerMessage'),
                meta: {
                    title: '站内信',
                    breadcrumb: false,

                }
            },
            {
                path: 'add',
                component: () =>
                    import ('@/views/common/innerMessage/AddEdit'),
                meta: {
                    title: '添加站内信',
                }
            },
            {
                path: 'edit',
                component: () =>
                    import ('@/views/common/innerMessage/AddEdit'),
                meta: {
                    title: '编辑站内信',
                }
            },
            {
                path: 'reply',
                component: () =>
                    import ('@/views/common/innerMessage/Reply'),
                meta: {
                    title: '回复站内信',
                }
            },
            {
                path: 'detail',
                component: () =>
                    import ('@/views/common/innerMessage/Detail'),
                meta: {
                    title: '站内信详情',
                }
            },
        ]
    },
    {
        path: '/templateManagement',
        name: 'templateManagement',
        redirect: '/templateManagement/table',
        component: Layout,
        meta: {
            title: '模板管理',
        },
        children: [{
                path: 'table',
                component: () =>
                    import ('@/views/common/templateManagement'),
                meta: {
                    title: '模板管理',
                    breadcrumb: false,
                }
            },
            {
                path: 'add',
                name: 'Add',
                component: () =>
                    import ('@/views/common/templateManagement/addEdit'),
                meta: {
                    title: '添加模板',
                }
            },
            {
                path: 'edit',
                name: 'Adit',
                component: () =>
                    import ('@/views/common/templateManagement/addEdit'),
                meta: {
                    title: '编辑模板',
                }
            },
            {
                path: 'detail',
                component: () =>
                    import ('@/views/common/templateManagement/detail'),
                meta: {
                    title: '模板详情',
                }
            },
        ]
    },
    {
        path: '/noticeManagement',
        name: 'noticeManagement',
        redirect: '/noticeManagement/table',
        component: Layout,
        meta: {
            title: '公告管理',
        },
        children: [{
                path: 'table',
                component: () =>
                    import ('@/views/common/noticeManagement'),
                meta: {
                    title: '公告管理',
                    breadcrumb: false
                }
            },
            {
                path: 'add',
                component: () =>
                    import ('@/views/common/noticeManagement/components/add'),
                meta: {
                    title: '添加公告',
                }
            },
            {
                path: 'edit',
                component: () =>
                    import ('@/views/common/noticeManagement/components/add'),
                meta: {
                    title: '编辑公告',
                }
            },
            {
                path: 'detail',
                component: () =>
                    import ('@/views/common/noticeManagement/components/detail'),
                meta: {
                    title: '公告详情',
                }
            },
        ]
    },
    {
        path: '/sendRecord',
        name: 'sendRecord',
        redirect: '/sendRecord/table',
        component: Layout,
        meta: {
            title: '发送记录',
        },
        children: [{
                path: 'table',
                component: () =>
                    import ('@/views/common/sendRecord'),
                meta: {
                    title: '发送记录',
                    breadcrumb: false
                }
            },
            {
                path: 'detail',
                component: () =>
                    import ('@/views/common/sendRecord/detail'),
                meta: {
                    title: '发送详情',
                }
            },
        ]
    },
    {
        path: '/supportProSetting',
        name: 'supportProSetting',
        redirect: '/supportProSetting/table',
        component: Layout,
        meta: {
            title: '微服务在线配置',
        },
        children: [{
            path: 'table',
            component: () =>
                import ('@/views/supportProSetting'),
            meta: {
                title: '支持项配置',
                breadcrumb: false
            }
        }, ]
    },
    {
        path: '/onlineConfiguration',
        name: 'onlineConfiguration',
        redirect: '/onlineConfiguration/table',
        component: Layout,
        meta: {
            title: '微服务在线配置',
        },
        children: [{
            path: '/onlineConfiguration/table',
            component: () =>
                import ('@/views/common/onlineConfiguration'),
            meta: {
                title: '微服务在线配置',
            }
        }]
    },
    // {
    //   path: '/nomenu',
    //   name: 'nomenu',
    //   redirect: '/nomenu/table',
    //   component: Layout,
    //   children: [
    //     {
    //       path: '/nomenu/table',
    //       component: () => import('@/views/common/onlineConfiguration'),
    //       meta: {
    //         title: '微服务在线配置',
    //       }
    //     }
    //   ]
    // },

]

const createRouter = () =>
    new Router({
        mode: 'hash',
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes.concat(asyncRoutes)
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
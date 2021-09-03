/*
 * @Author: your name
 * @Date: 2021-04-19 17:50:01
 * @LastEditTime: 2021-04-30 17:14:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-iot-project\src\components\SettingDrawer\settingConfig.js
 */
import { Message } from 'element-ui'
// import defaultSettings from '../defaultSettings';
import { changeThemeColor } from './themeColor.js'

const colorList = [{
        key: '薄暮',
        color: '#F5222D'
    },
    {
        key: '火山',
        color: '#FA541C'
    },
    {
        key: '日暮',
        color: '#FAAD14'
    },
    {
        key: '明青',
        color: '#13C2C2'
    },
    {
        key: '极光绿',
        color: '#52C41A'
    },
    {
        key: '拂晓蓝（默认）',
        color: '#1890FF'
    },
    {
        key: '酱紫',
        color: '#722ED1'
    }
]
const themeList = [
    {
      title: '默认皮肤',
      value: 'default'
    },
    {
      title: '皮肤一',
      value: 'htsy'
    },
    {
      title: '皮肤二',
      value: 'yyzc'
    },
  ]
  
const updateTheme = newPrimaryColor => {
    // const hideMessage = Message('正在切换主题！', 0)
    // changeThemeColor(newPrimaryColor).finally(() => {
    //     setTimeout(() => {
    //         // hideMessage()
    //     }, 10)
    // })
    changeThemeColor(newPrimaryColor).then(()=>{
        Message('111')
    })
}

const updateColorWeak = colorWeak => {
    // document.body.className = colorWeak ? 'colorWeak' : '';
    const app = document.body.querySelector('#app')
    colorWeak ? app.classList.add('colorWeak') : app.classList.remove('colorWeak')
}

export { colorList, themeList, updateTheme, updateColorWeak }
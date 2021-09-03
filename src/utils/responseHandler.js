
import { Message as $message } from 'element-ui'
export const responseHandler = (code, data, message) => {
    return new Promise((resolve, reject) => {
        if (code == '200') {
            $message.success(message)
            resolve(code, data, message)
        } else {
            // $message.error(message)
            reject(code, data, message)
        }
    })
}
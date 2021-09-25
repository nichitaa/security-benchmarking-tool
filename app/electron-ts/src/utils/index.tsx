import {message} from "antd";

export const objectClone = obj => {
    return JSON.parse(JSON.stringify(obj))
};

export const showMessage = (type, msg, duration) => {
    message[type]({
        content: msg,
        duration: duration,
        style: {marginTop: '80vh'}
    })
}
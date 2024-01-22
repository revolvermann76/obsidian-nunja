// get the current timestamp in the format YYYYMMDDHHmmSS
export function getCurrentTimestamp(unix = false) {
    if(unix){
        return ""+ Math.floor(Date.now() / 1000);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    return year + month + day + hours + minutes + seconds;
}
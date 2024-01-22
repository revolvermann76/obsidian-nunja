// get the current time in the format HH:mm
export function getCurrentTime(full = false) {
    const now = new Date();

    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    return hours + ":" + minutes + (full ? (":" + seconds) : "");
}
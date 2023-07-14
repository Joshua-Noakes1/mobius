const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function cardTime(intDate: string = '') {
    // get date 
    var date = intDate !== '' && intDate !== undefined ? new Date(intDate) : new Date();

    // check if date is valid
    if (isNaN(date.getTime())) {
        console.log(`Error "${intDate}" is not a valid date`);
        return {
            "success": false,
            "message": "Invalid date"
        };
    }

    // add ordinal
    switch (date.getDate()) {
        case 1:
        case 21:
        case 31:
            var ordinal = 'st';
            break;
        case 2:
        case 22:
            var ordinal = 'nd';
            break;
        case 3:
        case 23:
            var ordinal = 'rd';
            break;
        default:
            var ordinal = 'th';
    }

    // workout relative time eg. 1 hour ago, 6 years ago
    var relativeTime = (new Date().getTime() - date.getTime()) / 1000;
    var time = '';
    // if relative time is positive
    if (relativeTime > 0) {
        if (relativeTime < 60) {
            time = `${Math.floor(relativeTime)} seconds ago`;
        } else if (relativeTime < 3600) {
            time = `${Math.floor(relativeTime / 60)} minutes ago`;
        } else if (relativeTime < 86400) {
            time = `${Math.floor(relativeTime / 3600)} hours ago`;
        } else if (relativeTime < 604800) {
            time = `${Math.floor(relativeTime / 86400)} days ago`;
        } else if (relativeTime < 2628000) {
            time = `${Math.floor(relativeTime / 604800)} weeks ago`;
        } else if (relativeTime < 31536000) {
            time = `${Math.floor(relativeTime / 2628000)} months ago`;
        } else {
            time = `${Math.floor(relativeTime / 31536000)} years ago`;
        }
    } else {
        if (relativeTime > -60) {
            time = `in ${Math.floor(relativeTime).toString().replace("-", "")} seconds`;
        } else if (relativeTime > -3600) {
            time = `in ${Math.floor(relativeTime / 60).toString().replace("-", "")} minutes`;
        } else if (relativeTime > -86400) {
            time = `in ${Math.floor(relativeTime / 3600).toString().replace("-", "")} hours`;
        } else if (relativeTime > -604800) {
            time = `in ${Math.floor(relativeTime / 86400).toString().replace("-", "")} days`;
        } else if (relativeTime > -2628000) {
            time = `in ${Math.floor(relativeTime / 604800).toString().replace("-", "")} weeks`;
        } else if (relativeTime > -31536000) {
            time = `in ${Math.floor(relativeTime / 2628000).toString().replace("-", "")} months`;
        } else {
            time = `in ${Math.floor(relativeTime / 31536000).toString().replace("-", "")} years`;
        }
    }
        

    // return date data
    return {
        "success": true,
        "date": `${date.getDate()}`,
        "dateName": `${dayNames[date.getDay()]}`,
        "month": `${Math.floor(date.getMonth() + 1)}`,
        "monthName": `${monthNames[date.getMonth()]}`,
        "year": `${date.getFullYear()}`,
        "ordinal": `${ordinal}`,
        "time": {
            "type": `${(date.getHours() >= 12) ? 'PM' : 'AM'}`,
            "hour": `${(date.getHours() >= 10) ? `${date.getHours()}` : `0${date.getHours()}`}`,
            "minutes": `${(date.getMinutes() >= 10) ? `${date.getMinutes()}` : `0${date.getMinutes()}`}`,
            "seconds": `${(date.getSeconds() >= 10) ? `${date.getSeconds()}` : `0${date.getSeconds()}`}`,
        },
        "relativeTime": `${time}`,
        "originalDate": `${date}`,
        "dateBowser": `${date.getTime()}`,
    }
}
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
        "originalDate": `${date}`,
        "dateBowser": `${date.getTime()}`,
    }
}
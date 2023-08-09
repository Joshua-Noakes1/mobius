export default function getDurationMillis(millis: number = 0) {
    // workout the "real" time from the duration in mills (eg 4:30; 4 minutes 30 seconds or 1:32:45; 1 hour 32 minutes 45 seconds)
    var hours = Math.floor(millis / 3600000);
    var minutes = Math.floor((millis % 3600000) / 60000);
    var seconds = Math.floor(((millis % 3600000) % 60000) / 1000);

    // Create an array to hold the time components
    var timeComponents = [];

    // Add hours, minutes, and seconds to the array if they are not zero
    if (hours > 0) {
        timeComponents.push(`${hours}`);
    }

    // Check if minutes are greater than 0, or if it's just seconds
    if (minutes > 0 || (hours === 0 && minutes === 0)) {
        timeComponents.push(`${minutes}`);
    } else {
        timeComponents.push('0'); // Add '0' if it's just seconds
    }

    timeComponents.push(`${seconds.toString().padStart(2, '0')}`);

    // Join the time components with ':' to create the duration string
    var durationString = timeComponents.join(':');

    // Return the formatted duration
    return {
        "success": true,
        "duration": durationString
    }
}

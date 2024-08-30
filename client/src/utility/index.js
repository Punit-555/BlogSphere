export function convertDate(dateString) {
    try {
        // Parse the date string into a Date object
        const date = new Date(dateString);
        const now = new Date();

        // Check for invalid date
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        // Get the time zone offset in minutes
        const timeZoneOffset = now.getTimezoneOffset(); // in minutes

        // Adjust date to local time
        const localDate = new Date(date.getTime() - timeZoneOffset * 60000);

        // Calculate differences
        const diffInMs = now.getTime() - localDate.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            // Less than 24 hours ago
            if (diffInHours < 1) {
                // Less than 1 hour
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
            }
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        }

        if (diffInDays === 1) {
            // Yesterday
            return `Yesterday at ${localDate.toLocaleTimeString()}`;
        }

        if (diffInDays < 7) {
            // Days ago
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        }

        // Older dates
        return localDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        console.error("Error parsing date:", error);
        return "Invalid date";
    }
}

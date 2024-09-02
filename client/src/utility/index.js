export function convertDate(dateString) {
    try {
        // Parse the date string into a Date object
        const date = new Date(dateString);
        const now = new Date();

        // Check for invalid date
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        // Calculate differences in local time directly
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return `just now`;
        }

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        }

        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        }

        if (diffInDays === 1) {
            return `Yesterday at ${date.toLocaleTimeString()}`;
        }

        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        }

        // Older dates
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        console.error("Error parsing date:", error);
        return "Invalid date";
    }
}

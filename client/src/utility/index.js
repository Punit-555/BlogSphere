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


export const options = [
    { label: "Select", value: "" },
    { label: "Title", value: "title" },
    { label: "Category", value: "category" },
    { label: "Created At", value: "createdAt" },


];

export const categoryOptions = [
    { label: "Select a category", value: "" },
    { label: "Technology", value: "Technology" },
    { label: "Health & Wellness", value: "Health & Wellness" },
    { label: "Finance", value: "Finance" },
    { label: "Food & Recipes", value: "Food & Recipes" },
    { label: "Lifestyle", value: "Lifestyle" },
    { label: "Education", value: "Education" },
    { label: "Entertainment", value: "Entertainment" },
];

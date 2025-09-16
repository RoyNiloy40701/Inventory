export function formatDateTime(value: string | number | Date): string {
	const date = new Date(value);
	if (isNaN(date.getTime())) return "Invalid date";

	const datePart = date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const timePart = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return `${datePart}\n${timePart}`;
}

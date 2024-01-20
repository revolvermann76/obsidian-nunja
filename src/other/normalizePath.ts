// switches windows backslashes to linux slashes and removes a slash at the end (if it exists)
export function normalizePath(path: string): string {
	path = path.replaceAll("\\", "/");
	if (path.endsWith("/")) {
		return path.slice(0, -1);
	}
	return path;
}

import { SQL } from "./sql";

// const DESIRED_PROPS = "og:title og:image og:description".split(" ");
const store = {};
// const cachedAdventures = {};
// const cachedUsers = {};

export async function processDB(file: File) {
	const buf = await file.arrayBuffer();
	const db = new SQL.Database(new Uint8Array(buf));
	const query = db.exec(
		"SELECT * FROM 'moz_places' WHERE url LIKE 'https://mspfa.com%'"
	);

	query[0].values.forEach(entry => {
		let [
			_,
			url,
			title,
			_2,
			_3,
			_4,
			_5,
			_6,
			visitTimestamp,
			_7,
			_8,
			_9,
			description,
			thumbnail,
			_10,
			_11,
		] = entry;

		// STFU Typescript
		visitTimestamp = parseInt(visitTimestamp.toString());
		visitTimestamp /= 1000;

		let storyId = parseInt(new URL(url.toString()).searchParams.get("s"));

		if (isNaN(storyId)) return;

		store[storyId] ??= { timestamp: visitTimestamp };
		if (visitTimestamp >= store[storyId].timestamp) {
			if (
				description !== null &&
				description !== "Hello, welcome to the bath house"
			)
				store[storyId].description = description;
			if (
				title !== null &&
				title !== "MS Paint Fan Adventures"
			)
				store[storyId].title = title;
			if (
				thumbnail !== null &&
				thumbnail !== "https://mspfa.com/images/ico.png"
			)
				store[storyId].thumbnail = thumbnail;
		}
	});

	return transformStore(store);
}

// const parser = new DOMParser();
// export async function processCacheFolder(dir: FileSystemDirectoryEntry) {
// 	const reader = dir.createReader();
// 	reader.readEntries((entries: FileSystemEntry[]) => {
// 		entries.forEach((entry: FileSystemEntry) => {
// 			if (!(entry instanceof FileSystemFileEntry)) return;
// 			entry.file(async (file: File) => {
// 				let text = await file.text();
// 				let html = parser.parseFromString(text, "text/html");
// 			})
// 		})
// 	});
// }

function transformStore(store) {
	let out = "Firefox\n";
	for (const id in store) {
		out += `Adventure #${id}: ${JSON.stringify(store[id])}\n`;
	}

	return out;
}
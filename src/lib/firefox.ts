import { getSQL } from "./sql";

const MAINTENANCE_START = 1675433420000;
const USER_QUERY_START = 1656216000000;
const STORY_QUERY_START = 1660190400000;

// const DESIRED_PROPS = "og:title og:image og:description".split(" ");
const store = {};
const userStore = {};
// const cachedAdventures = {};
// const cachedUsers = {};

export async function processDB(file: File) {
	const SQL = await getSQL();
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

		if (visitTimestamp > MAINTENANCE_START) return;

		let storyId = parseInt(new URL(url.toString()).searchParams.get("s"));
		if (!isNaN(storyId) && visitTimestamp > STORY_QUERY_START)
			addStory(storyId, visitTimestamp, description, title, thumbnail);

		let userId = parseInt(new URL(url.toString()).searchParams.get("u"));
		if (!isNaN(userId) && visitTimestamp > USER_QUERY_START)
			addUser(userId, visitTimestamp, description, title, thumbnail);
	});

	return transformStore();
}

function addUser(userId, visitTimestamp, description, title, thumbnail) {
	userStore[userId] ??= { timestamp: visitTimestamp };
	if (visitTimestamp >= userStore[userId].timestamp) {
		if (
			description !== null &&
			description !== "N/A"
		)
			userStore[userId].description = description;
		if (title !== null && title !== "MS Paint Fan Adventures")
			userStore[userId].title = title;
		if (
			thumbnail !== null &&
			thumbnail !== "https://mspfa.com/images/wat.njs"
		)
			userStore[userId].thumbnail = thumbnail;
	}
}

function addStory(storyId, visitTimestamp, description, title, thumbnail) {
	store[storyId] ??= { timestamp: visitTimestamp };
	if (visitTimestamp >= store[storyId].timestamp) {
		if (
			description !== null &&
			description !== "Hello, welcome to the bath house"
		)
			store[storyId].description = description;
		if (title !== null && title !== "MS Paint Fan Adventures")
			store[storyId].title = title;
		if (
			thumbnail !== null &&
			thumbnail !== "https://mspfa.com/images/ico.png"
		)
			store[storyId].thumbnail = thumbnail;
	}
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

function transformStore() {
	let out = "Firefox\n";
	for (const id in store) {
		out += `Adventure #${id}: ${JSON.stringify(store[id])}\n`;
	}

	for (const id in userStore) {
		out += `User #${id}: ${JSON.stringify(userStore[id])}\n`;
	}

	return out;
}

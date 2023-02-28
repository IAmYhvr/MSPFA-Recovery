import { getSQL } from "./sql";
// import {
// 	acquireFruitsOfYourLabor,
// 	readCacheFile,
// 	setCacheReadFn,
// } from "./readCacheFile";

const store = {};
const userStore = {};
const MAINTENANCE_START = 1675433420000;
const USER_QUERY_START = 1656216000000;
const STORY_QUERY_START = 1660190400000;

export async function processDB(file: File) {
	const SQL = await getSQL();
	const buf = await file.arrayBuffer();
	const db = new SQL.Database(new Uint8Array(buf));
	const query = db.exec(
		"SELECT url, title, last_visit_time FROM 'urls' WHERE url LIKE 'https://mspfa.com/%'"
	);

	query[0].values.forEach(entry => {
		let [url, title, visitTimestamp] = entry;

		// STFU Typescript
		visitTimestamp = parseInt(visitTimestamp.toString());
		if (visitTimestamp !== 0) {
			visitTimestamp /= 1000;
			// Chrome timestamps start in the year 1601. Why?
			visitTimestamp -= 11644473600000;
		}
		if (visitTimestamp > MAINTENANCE_START) return;

		let storyId = parseInt(new URL(url.toString()).searchParams.get("s"));
		if (!isNaN(storyId) && visitTimestamp > STORY_QUERY_START)
			addStory(storyId, visitTimestamp, title);

		let userId = parseInt(new URL(url.toString()).searchParams.get("u"));
		if (!isNaN(userId) && visitTimestamp > USER_QUERY_START)
			addUser(userId, visitTimestamp, title);
	});

	// return 1;
	return transformStore();
}

function addUser(userId, visitTimestamp, title) {
	userStore[userId] ??= { timestamp: visitTimestamp };
	if (visitTimestamp >= userStore[userId].timestamp) {
		if (title !== null && title !== "MS Paint Fan Adventures")
			userStore[userId].title = title;
	}
}

function addStory(storyId, visitTimestamp, title) {
	store[storyId] ??= { timestamp: visitTimestamp };
	if (visitTimestamp >= store[storyId].timestamp) {
		if (title !== null && title !== "MS Paint Fan Adventures")
			store[storyId].title = title;
	}
}

function transformStore() {
	let out = "Chrome\n";
	// const { adventures, users, css, js } = acquireFruitsOfYourLabor();
	// for (const id in adventures) {
	// 	out += `Adventure #${id}: ${JSON.stringify(adventures[id])}\n`;
	// }

	for (const id in store) {
		out += `Adventure #${id}: ${JSON.stringify(store[id])}\n`;
	}

	for (const id in userStore) {
		out += `User #${id}: ${JSON.stringify(userStore[id])}\n`;
	}

	// for (const id in css) {
	// 	out += `Style #${id}: ${JSON.stringify(css[id])}\n`;
	// }

	// for (const id in js) {
	// 	out += `Script #${id}: ${JSON.stringify(js[id])}\n`;
	// }

	// for (const id in users) {
	// 	out += `User #${id}: ${JSON.stringify(users[id])}\n`;
	// }

	return out;
}

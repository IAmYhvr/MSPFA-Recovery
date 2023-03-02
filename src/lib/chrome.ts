import { getSQL } from "./sql";
import { addEntryByURL } from './store';
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

export const processDB = (file: File) => new Promise<void>(async resolve => {
	const SQL = await getSQL();
	const buf = await file.arrayBuffer();
	const db = new SQL.Database(new Uint8Array(buf));

	db.each(
		"SELECT url, title, last_visit_time FROM 'urls' WHERE url LIKE 'https://mspfa.com/%'",
		row => {
			let { url, title: name, last_visit_time: visitTimestamp } = row;

			// STFU Typescript
			visitTimestamp = parseInt(visitTimestamp.toString());
			if (visitTimestamp !== 0) {
				visitTimestamp /= 1000;
				// Chrome timestamps start in the year 1601. Why?
				visitTimestamp -= 11644473600000;
			}
			// if (visitTimestamp > MAINTENANCE_START) return;

			// let storyId = +new URL(url as string).searchParams.get("s");
			// if (!isNaN(storyId) && visitTimestamp > STORY_QUERY_START)
			// 	addEntry(storyId, visitTimestamp, { title });

			// let userId = +new URL(url as string).searchParams.get("u");
			// if (!isNaN(userId) && visitTimestamp > USER_QUERY_START)
			addEntryByURL(url.toString(), visitTimestamp, { name });
		},
		() => {
			resolve();
		}
	);
});
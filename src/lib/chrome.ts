import { getSQL } from "./sql";
import {
	acquireFruitsOfYourLabor,
	readCacheFile,
	setCacheReadFn,
} from "./readCacheFile";

const store = {};
const MAINTENANCE_START = 1675433420000;

export async function processDB(file: File) {
	const SQL = await getSQL();
	const buf = await file.arrayBuffer();
	const db = new SQL.Database(new Uint8Array(buf));
	const query = db.exec(
		"SELECT * FROM 'urls' WHERE url LIKE 'https://mspfa.com%'"
	);

	query[0].values.forEach(entry => {
		let [_, url, title, _2, _3, visitTimestamp] = entry;

		// STFU Typescript
		visitTimestamp = parseInt(visitTimestamp.toString());
		if (visitTimestamp !== 0) {
			visitTimestamp /= 1000;
			// Chrome timestamps start in the year 1601. Why?
			visitTimestamp -= 11644473600000;
		}
		if (visitTimestamp > MAINTENANCE_START) return;

		let storyId = parseInt(new URL(url.toString()).searchParams.get("s"));

		if (isNaN(storyId)) return;

		store[storyId] ??= { timestamp: visitTimestamp };
		if (visitTimestamp >= store[storyId].timestamp) {
			if (title !== null && title !== "MS Paint Fan Adventures")
				store[storyId].title = title;
		}
	});

	// return 1;
	return transformStore(store);
}

let theRes;
let cacheGoal = 0;
let cacheDone = 0;
let queue: FileSystemFileEntry[] = [];
const cacheRead = () => {
	cacheDone++;
	// @ts-expect-error
	window.progressUpdate(cacheDone, cacheGoal);
	if (cacheGoal === cacheDone) return allDone();
	// setTimeout(tickQueue, 100);
	tickQueue();
};
setCacheReadFn(cacheRead);
function tickQueue() {
	let entry = queue[0];
	queue.shift();
	entry.file(readCacheFile);
}
function allDone() {
	theRes(transformStore(store));
}
function recurseReader(
	reader: FileSystemDirectoryReader,
	entries: FileSystemEntry[] = []
) {
	reader.readEntries(newEntries => {
		if (newEntries.length > 0)
			recurseReader(reader, entries.concat(newEntries));
		else {
			console.log(entries.length);
			entries.forEach(entry => {
				if (!entry.isFile) return;
				cacheGoal++;
				// @ts-expect-error
				queue.push(entry);
			});

			cacheRead();
		}
	});
}

export function traverseFuckingTree(Cache: FileSystemDirectoryEntry) {
	// Weird folder names to match the folder names on disk
	// It just works for me, sorry lol
	Cache.getDirectory(
		"Cache_Data",
		{},
		(Cache_Data: FileSystemDirectoryEntry) => {
			recurseReader(Cache_Data.createReader());
		}
	);

	return new Promise(res => {
		theRes = res;
	});
}

function transformStore(store) {
	let out = "Chrome\n";
	const { adventures, users, css, js } = acquireFruitsOfYourLabor();
	for (const id in adventures) {
		out += `Adventure #${id}: ${JSON.stringify(adventures[id])}\n`;
	}

	for (const id in store) {
		if (!(id in adventures))
			out += `Adventure #${id}: ${JSON.stringify(store[id])}\n`;
	}

	for (const id in css) {
		out += `Style #${id}: ${JSON.stringify(css[id])}\n`;
	}

	for (const id in js) {
		out += `Script #${id}: ${JSON.stringify(js[id])}\n`;
	}

	for (const id in users) {
		out += `User #${id}: ${JSON.stringify(users[id])}\n`;
	}

	return out;
}

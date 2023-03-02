import { getSQL } from "./sql";
import { addEntryByURL } from './store';

const MAINTENANCE_START = 1675433420000;
const USER_QUERY_START = 1656216000000;
const STORY_QUERY_START = 1660190400000;

// const DESIRED_PROPS = "og:title og:image og:description".split(" ");
const store = {};
const userStore = {};
// const cachedAdventures = {};
// const cachedUsers = {};

export const processDB = (file: File) => new Promise<void>(async resolve => {
	const SQL = await getSQL();
	const buf = await file.arrayBuffer();
	const db = new SQL.Database(new Uint8Array(buf));
	db.each(
		"SELECT url, title, last_visit_date, description, preview_image_url FROM 'moz_places' WHERE url LIKE 'https://mspfa.com/%'",
		row => {
			let {
				url,
				title: name,
				last_visit_date: dateNumber,
				description,
				preview_image_url: icon
			} = row;

			dateNumber = +dateNumber / 1000; ''

			if (dateNumber > MAINTENANCE_START) return;

			// let storyId = +new URL(url as string).searchParams.get("s");
			// if (storyId && dateNumber > STORY_QUERY_START)
			// 	addEntry(storyId, dateNumber, { title, description, thumbnail });

			// let userId = +new URL(url.toString()).searchParams.get("u");
			// if (!isNaN(userId) && dateNumber > USER_QUERY_START)
			addEntryByURL(url.toString(), dateNumber, { name, description, icon });
		},
		() => {
			resolve();
		}
	);
});

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

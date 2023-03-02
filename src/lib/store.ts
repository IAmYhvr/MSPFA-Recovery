const STORY_PATHNAMES = ['/', '/log/', '/search/', '/preview/', '/readers/'];
const USER_PATHNAMES = ['/user/', '/achievements/', '/favs/'];

export const MIN_DATE_NUMBER = +new Date('2022-06-26');
export const MIN_STORY_DATE_NUMBER = +new Date('2022-08-11');
export const MAX_DATE_NUMBER = +new Date('2023-02-04');

const data = {
	stories: {},
	users: {}
};

type Entry = Partial<{
	name: any,
	description: any,
	icon: any,
	author: any,
	css: any,
	js: any
}>;

export function addEntry(
	type: 'stories' | 'users',
	id: any,
	dateNumber: any,
	entry: Entry
) {
	if (
		dateNumber > MAX_DATE_NUMBER
		|| dateNumber < MIN_DATE_NUMBER
		|| !id
		|| (type === 'stories' && dateNumber < MIN_STORY_DATE_NUMBER)
	) {
		return;
	}

	if (type === "stories") {
		const idNumber = +id;

		if (!idNumber || idNumber < 1 || idNumber > 50052) {
			return;
		}
	} else if (!/^\d{21}$/.test(id)) {
		return;
	}

	const target = data[type];

	for (const [key, value] of Object.entries(entry)) {
		if (
			!value
			|| (key === 'name' && value === 'mspfa.com | 521: Web server is down')
			|| (key === 'description' && (value === 'N/A' || value === 'Hello, welcome to the bath house'))
			|| (key === 'icon' && value === 'https://mspfa.com/images/wat.njs')
		) {
			continue;
		}

		if (!target[id]) {
			target[id] = {};
		}

		const item = target[id];

		if (!item[key]) {
			item[key] = {};
		}

		if (!item[key][value]) {
			item[key][value] = [];
		}

		if (!item[key][value].includes(dateNumber)) {
			item[key][value].push(dateNumber);
		}
	}
}

export function addEntryByURL(
	urlString: string,
	dateNumber: number,
	entry: Entry
) {
	if (dateNumber > MAX_DATE_NUMBER || dateNumber < MIN_DATE_NUMBER) {
		return;
	}

	const url = new URL(urlString);

	if (url.hostname !== 'mspfa.com') {
		return;
	}

	const type = (
		STORY_PATHNAMES.includes(url.pathname)
			? "stories"
			: USER_PATHNAMES.includes(url.pathname)
				? "users"
				: undefined
	)

	if (!type) {
		return;
	}

	const id = url.searchParams.get(type === "stories" ? 's' : 'u');

	addEntry(type, id, dateNumber, entry);
}

// export function addUser(userId, { timestamp, name, description, icon }: Entry) {
// 	users[userId] ??= { timestamp: timestamp };
// 	if (timestamp >= users[userId].timestamp) {
// 		if (
// 			description !== null &&
// 			description !== "N/A"
// 		)
// 			users[userId].description = description;
// 		if (name !== null && name !== "MS Paint Fan Adventures")
// 			users[userId].name = name;
// 		if (
// 			icon !== null &&
// 			icon !== "https://mspfa.com/images/wat.njs"
// 		)
// 			users[userId].icon = icon;
// 	}
// }

// export function addStory(storyId, { timestamp, name, description, icon}: Entry) {
// 	stories[storyId] ??= { timestamp: timestamp };
// 	if (timestamp >= stories[storyId].timestamp) {
// 		if (
// 			!!description &&
// 			description !== "Hello, welcome to the bath house"
// 		)
// 			stories[storyId].description = description;
// 		if (!!name && name !== "MS Paint Fan Adventures")
// 			stories[storyId].name = name;
// 		if (
// 			!!icon &&
// 			icon !== "https://mspfa.com/images/ico.png"
// 		)
// 			stories[storyId].icon = icon;
// 	}
// }

export function getData() {
	return data;
}

export function formatData() {
	let out = "";

	for (const [key, value] of Object.entries(data.stories)) {
		out += `Adventure #${key}: ${JSON.stringify(value)}\n`;
	}

	for (const [key, value] of Object.entries(data.users)) {
		out += `User #${key}: ${JSON.stringify(value)}\n`;
	}

	return out.slice(0, -1);
}

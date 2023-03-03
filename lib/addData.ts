import Data, { Entry, EntryKey } from 'lib/Data';
import { MAX_DATE_NUMBER, MIN_DATE_NUMBER, MIN_STORY_DATE_NUMBER } from 'lib/dates';

const STORY_PATHNAMES = ['/', '/log/', '/search/', '/preview/', '/readers/'];
const USER_PATHNAMES = ['/user/', '/achievements/', '/favs/'];

function addData(
	data: Data,
	type: keyof Data,
	id: string | number | null | undefined,
	dateNumber: number,
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

	id = id.toString();

	if (type === 'stories') {
		const idNumber = +id;

		if (!idNumber || idNumber < 1 || idNumber > 50052) {
			return;
		}
	} else if (!/^\d{21}$/.test(id)) {
		return;
	}

	const target = data[type];

	for (const [key, value] of Object.entries(entry) as Array<[EntryKey, string]>) {
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

		const item = target[id]!;

		if (!item[key]) {
			item[key] = {};
		}

		if (!item[key]![value]) {
			item[key]![value] = [];
		}

		if (!item[key]![value]!.includes(dateNumber)) {
			item[key]![value]!.push(dateNumber);
		}
	}
}

export default addData;

export function addDataByURL(
	data: Data,
	urlString: string,
	dateNumber: number,
	entry: Entry
) {
	if (dateNumber > MAX_DATE_NUMBER || dateNumber < MIN_DATE_NUMBER) {
		return;
	}

	let url;
	try {
		url = new URL(urlString);
	} catch {
		return;
	}

	if (url.hostname !== 'mspfa.com') {
		return;
	}

	const type = (
		STORY_PATHNAMES.includes(url.pathname)
			? 'stories'
			: USER_PATHNAMES.includes(url.pathname)
				? 'users'
				: undefined
	)

	if (!type) {
		return;
	}

	const id = url.searchParams.get(type === 'stories' ? 's' : 'u');

	addData(data, type, id, dateNumber, entry);
}

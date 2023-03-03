export type DataType = 'stories' | 'users';

export const ENTRY_KEYS = ['name', 'description', 'icon', 'author', 'css', 'js'] as const;

export type EntryKey = typeof ENTRY_KEYS[number];

export type Entry = Partial<Record<EntryKey, string | undefined | null>>;

type Data = Record<
	DataType,
	Partial<Record<
		string,
		Partial<Record<
			EntryKey,
			Partial<Record<
				string,
				number[]
			>>
		>>
	>>
>;

export default Data;

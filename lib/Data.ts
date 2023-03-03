export type DataType = 'stories' | 'users';

export type EntryKey = 'name' | 'description' | 'icon' | 'author' | 'css' | 'js';

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

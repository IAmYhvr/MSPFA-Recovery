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

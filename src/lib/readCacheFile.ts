import { parseCachedFile } from "./parseChromeCache";
import { Buffer } from "buffer";

const DESIRED_PROPS = "og:title og:image og:description".split(" ");
const cachedAdventures = {};
const cachedUsers = {};

const parser = new DOMParser();
export async function readCacheFile(file: File) {

	let rawFileContents = await file.arrayBuffer();
	let cacheFile = parseCachedFile(Buffer.from(rawFileContents));
	let stringContent = cacheFile.content?.toString();
	let resourceUrl = cacheFile.url.split(" ")[2];

	if (cacheFile.headers?.["content-type"] !== "text/html") {
		cacheRead();
		return;
	};
	if (!resourceUrl.includes("https://mspfa.com/")) {
		cacheRead();
		return;
	};

	let doc = parser.parseFromString(stringContent, "text/html");

	if (resourceUrl.includes("s=")) {
		const index = new URL(resourceUrl).searchParams.get("s");

		const tags = doc.querySelectorAll("meta");
		cachedAdventures[index] ??= {
			timestamp: new Date(cacheFile.headers["date"]),
		};

		tags.forEach((el: any) => {
			const attr = el.getAttribute("property");

			if (DESIRED_PROPS.includes(attr))
				cachedAdventures[index][
					el.getAttribute("property").substring(3)
				] = el.getAttribute("content");

			if (el.getAttribute("name") === "author")
				cachedAdventures[index].author = el.getAttribute("content");
		});
	} else if (resourceUrl.includes("?u=")) {
		const index = new URL(resourceUrl).searchParams.get("u");

		const tags = doc.querySelectorAll("meta");
		cachedUsers[index] ??= {};

		tags.forEach((el: any) => {
			const attr = el.getAttribute("property");

			if (DESIRED_PROPS.includes(attr))
				cachedUsers[index][el.getAttribute("property").substring(3)] =
					el.getAttribute("content");
		});
	}

	cacheRead();
}

// FUck.
export function acquireFruitsOfYourLabor() {
	return {
		adventures: cachedAdventures,
		users: cachedUsers,
	};
}

let cacheRead = () => {};
export function setCacheReadFn(fn) {
	cacheRead = fn;
}

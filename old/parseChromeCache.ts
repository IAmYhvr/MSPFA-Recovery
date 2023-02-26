import { Buffer } from "buffer";

// Credit: https://github.com/carlosascari/chrome-cache-reader/blob/master/index.js
const extractRawHttpHeaders = buf => {
	const start = buf.indexOf(Buffer.from("HTTP/1.1"));
	for (let i = start; i < buf.length; i++) {
		if (buf[i] == 0x00 && buf[i + 1] == 0x00) {
			const buf2 = Buffer.alloc(i - start);
			buf.copy(buf2, 0, start, i);
			return buf2;
		}
	}
	return null;
};

const parseHttpReqHeaders = buf => {
	const headers = {};
	buf.split("\0").map(line => {
		if (line.indexOf(":") != -1) {
			const lineSplited = line.split(":");
			const key = lineSplited[0];
			const value = lineSplited.slice(1).join(":");
			headers[key] = value;
		}
	});
	return headers;
};

export const parseCachedFile = (buf: Buffer) => {
	const cachedFileHeadingSize = 24;
	const cachedFileHeadingNameSizeOffset = 12;
	const cachedFilenameSize = buf.readUInt32LE(
		cachedFileHeadingNameSizeOffset
	);
	const cachedFilenameBuf = Buffer.alloc(cachedFilenameSize);
	buf.copy(
		cachedFilenameBuf,
		0,
		cachedFileHeadingSize,
		cachedFileHeadingSize + cachedFilenameSize
	);
	const cachedFilename = cachedFilenameBuf.toString();
	if (buf.indexOf(Buffer.from("HTTP/1.1")) == -1) {
		return { url: cachedFilename };
	}
	const rawHttpReqHeaders = extractRawHttpHeaders(buf).toString();
	const headers = parseHttpReqHeaders(rawHttpReqHeaders);
	const contentLength =
		parseInt(headers["content-length"]) ||
		buf.indexOf(Buffer.from("HTTP/1.1")) -
			52 -
			(cachedFileHeadingSize + cachedFilenameSize);
	const contentOffset = cachedFileHeadingSize + cachedFilename.length;
	const contentBuf = Buffer.alloc(contentLength);
	buf.copy(contentBuf, 0, contentOffset, contentOffset + contentLength);
	return { url: cachedFilename, headers, content: contentBuf };
};

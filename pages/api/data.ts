import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { Readable } from 'node:stream';
import { once } from 'node:events';
import { NextApiRequest, NextApiResponse } from 'next';
import { MAX_DATE_NUMBER, MIN_DATE_NUMBER, MIN_STORY_DATE_NUMBER } from 'lib/dates';

const KEY = Buffer.from('HGdge/Nwkp8pPKY1KsHheR5n4TCyLLPh', 'base64');

const hash = (data: string) => (
	crypto.createHmac('sha256', KEY).update(data).digest().toString('base64url')
);

const USER_KEYS = new Set(['name', 'description', 'icon', 'image']);
const STORY_KEYS = new Set([...USER_KEYS, 'author', 'css', 'js']);

const isValidStoryDate = (dateNumber: unknown) => (
	typeof dateNumber === 'number'
	&& !(dateNumber < MIN_STORY_DATE_NUMBER || dateNumber > MAX_DATE_NUMBER)
);

const isValidUserDate = (dateNumber: unknown) => (
	typeof dateNumber === 'number'
	&& !(dateNumber < MIN_DATE_NUMBER || dateNumber > MAX_DATE_NUMBER)
);

const isValidStoryDates = (dates: unknown) => (
	Array.isArray(dates)
	&& dates.every(isValidStoryDate)
);

const isValidUserDates = (dates: unknown) => (
	Array.isArray(dates)
	&& dates.every(isValidUserDate)
);

const isValidStoryProperty = ([key, values]: [string, unknown]) => (
	STORY_KEYS.has(key)
	&& values instanceof Object
	&& Object.values(values).every(isValidStoryDates)
);

const isValidUserProperty = ([key, values]: [string, unknown]) => (
	USER_KEYS.has(key)
	&& values instanceof Object
	&& Object.values(values).every(isValidUserDates)
);

const isValidStoryEntry = ([id, item]: [string, unknown]) => {
	const idNumber = +id;

	return (
		idNumber
		&& !(idNumber < 1 || idNumber > 50052)
		&& item instanceof Object
		&& Object.entries(item).every(isValidStoryProperty)
	);
};

const isValidUserEntry = ([id, item]: [string, unknown]) => (
	/^\d{21}$/.test(id)
	&& item instanceof Object
	&& Object.entries(item).every(isValidUserProperty)
);

const isValidBody = (body: unknown) => (
	body instanceof Object
	&& Object.values(body).length === 2
	&& 'stories' in body
	&& 'users' in body
	&& body.stories instanceof Object
	&& body.users instanceof Object
	&& Object.entries(body.stories).every(isValidStoryEntry)
	&& Object.entries(body.users).every(isValidUserEntry)
);

const ALLOWED_ORIGINS = new Set(['https://mspfa.com', 'https://myactivity.google.com']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'OPTIONS') {
		const { origin } = req.headers;

		if (origin && ALLOWED_ORIGINS.has(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}

		res.end();
		return;
	}

	if (req.method !== 'POST') {
		res.status(405).end();
		return;
	}

	if (req.headers['content-type'] !== 'application/json') {
		res.status(415).end();
		return;
	}

	if (!isValidBody(req.body)) {
		res.status(400).end();
		return;
	}

	const date = new Date();
	const dateString = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`;

	const parentPath = path.join(process.cwd(), '..', 'data', dateString);
	await fs.promises.mkdir(parentPath, { recursive: true });

	const id = hash(String(req.headers['cf-connecting-ip']));

	const contentHash = hash(JSON.stringify(req.body));
	const filename = `${contentHash}.json.br`;
	const filePath = path.join(parentPath, filename);

	const bodyStream = Readable.from(
		JSON.stringify({ id, ...req.body })
	);
	const brotliCompress = zlib.createBrotliCompress();
	const writeStream = fs.createWriteStream(filePath);

	bodyStream.pipe(brotliCompress).pipe(writeStream);

	await once(writeStream, 'close');
	res.end();
}

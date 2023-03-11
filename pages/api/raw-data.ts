import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { once } from 'node:events';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false
	}
};

const ALLOWED_ORIGINS = new Set(['https://search.google.com']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { origin } = req.headers;

	if (origin && ALLOWED_ORIGINS.has(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
		res.setHeader('Access-Control-Allow-Methods', 'POST');
		res.setHeader('Access-Control-Allow-Headers', '*');
	}

	if (req.method === 'OPTIONS') {
		res.setHeader('Allow', 'OPTIONS, POST').end();
		return;
	}

	if (req.method !== 'POST') {
		res.status(405).end();
		return;
	}

	const parentPath = path.join(process.cwd(), '..', 'raw-data');
	// await fs.promises.mkdir(parentPath, { recursive: true });

	const id = encodeURIComponent(String(req.headers['mspfa-url'])).replace(/%/g, '_');
	const filename = `${id}.html.gz`;
	const filePath = path.join(parentPath, filename);

	const gzipCompress = zlib.createGzip();
	const writeStream = fs.createWriteStream(filePath);

	req.pipe(gzipCompress).pipe(writeStream);

	await once(writeStream, 'close');
	res.end();
}

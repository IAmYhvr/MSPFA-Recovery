import BackButtonContainer from 'components/BackButtonContainer';
import BrowserHeading from 'components/BrowserHeading';
import GoogleActivityScanner from 'components/pages/GoogleActivityScanner';
import HistoryScanner from 'components/pages/HistoryScanner';
import TheEnd from 'components/pages/TheEnd';
import addData from 'lib/addData';
import { useBrowser } from 'lib/BrowserContext';
import { Entry } from 'lib/Data';
import { useData } from 'lib/DataContext';
import { MAX_DATE_NUMBER, MIN_STORY_DATE_NUMBER } from 'lib/dates';
import { usePlatform } from 'lib/PlatformContext';
import STORY_IDS from 'lib/STORY_IDS';
import timeOut from 'lib/timeOut';
import useFunction from 'lib/useFunction';
import useLeaveConfirmation from 'lib/useLeaveConfirmation';
import useLinkTo from 'lib/useLinkTo';
import { useRef, useState } from 'react';

const CACHE_SCAN_TYPES = ['story', 'log', 'search', 'css', 'js'] as const;

type CacheScanType = typeof CACHE_SCAN_TYPES[number];

const getURLString: Record<CacheScanType, (storyID: number) => string> = {
	story: storyID => `https://mspfa.com/?s=${storyID}&p=1`,
	log: storyID => `https://mspfa.com/log/?s=${storyID}`,
	search: storyID => `https://mspfa.com/search/?s=${storyID}`,
	css: storyID => `https://mspfa.com/css/?s=${storyID}`,
	js: storyID => `https://mspfa.com/js/?s=${storyID}`
};

const TOTAL = STORY_IDS.length * CACHE_SCAN_TYPES.length;

export default function CacheScanner() {
	const [platform] = usePlatform();
	const [browser] = useBrowser();
	const data = useData();

	const [started, setStarted] = useState(false);
	const [done, setDone] = useState(0);

	useLeaveConfirmation(started);

	const storyIDIndexesRef = useRef<Record<CacheScanType, number>>({
		story: 0,
		log: 0,
		search: 0,
		css: 0,
		js: 0
	});
	const storyIDIndexes = storyIDIndexesRef.current;

	const lastTimeoutRef = useRef(Date.now());

	const cacheModeRef = useRef<'only-if-cached' | 'force-cache'>();

	const setCacheMode = useFunction(() => (
		fetch(location.href, {
			cache: 'only-if-cached',
			mode: 'same-origin'
		}).then(() => {
			cacheModeRef.current = 'only-if-cached';
		}).catch(() => {
			cacheModeRef.current = 'force-cache';
		})
	));

	const fetchNext = useFunction(async (type: CacheScanType, storyID: number) => {
		storyIDIndexes[type]++;

		const urlString = getURLString[type](storyID);

		// The occasional timeout prevents the renderer from freezing.
		let timeout;
		const now = Date.now();
		if (lastTimeoutRef.current < now - 10) {
			timeout = timeOut();
			lastTimeoutRef.current = now;
		}

		const [response] = await Promise.all([
			fetch(urlString, {
				cache: cacheModeRef.current,
				mode: 'same-origin',
				headers: {
					'MSPFA-Recover': '1'
				}
			}).catch(() => undefined),
			timeout
		]);

		setDone(done => done + 1);

		if (!response?.ok) {
			return;
		}

		const dateString = response.headers.get('Date');

		if (!dateString) {
			return;
		}

		const dateNumber = +new Date(dateString);

		if (!dateNumber || dateNumber < MIN_STORY_DATE_NUMBER || dateNumber > MAX_DATE_NUMBER) {
			return;
		}

		const text = await response.text();

		const entry: Entry = {};

		if (type === 'css' || type === 'js') {
			entry[type] = text;

			addData(data, 'stories', storyID, dateNumber, entry);
			return;
		}

		const { head } = new DOMParser().parseFromString(text, 'text/html');

		entry.name = head.getElementsByTagName('title')[0]?.textContent || '';
		entry.description = head.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content;
		entry.icon = head.querySelector<HTMLMetaElement>('meta[property="og:icon"]')?.content;
		entry.author = head.querySelector<HTMLMetaElement>('meta[name="author"]')?.content;

		addData(data, 'stories', storyID, dateNumber, entry);
	});

	const runFetchLoop = useFunction(async (type: CacheScanType) => {
		while (true) {
			const storyIDIndex = storyIDIndexes[type];

			const storyID = STORY_IDS[storyIDIndex];
			if (storyID === undefined) {
				return;
			}

			await fetchNext(type, storyID);
		}
	});

	const start = useFunction(async () => {
		setStarted(true);

		if (!cacheModeRef.current) {
			await setCacheMode();
		}

		for (let i = 0; i < 5; i++) {
			CACHE_SCAN_TYPES.forEach(runFetchLoop);
		}
	});

	const linkToNext = useLinkTo(
		platform === 'mobile' || browser === 'safari'
			? TheEnd
			: browser === 'chrome-with-google'
				? GoogleActivityScanner
				: HistoryScanner
	);

	const getContent = () => {
		if (!started) {
			return (
				<>
					<p>
						Click the button below to start scanning MSPFA's cache in your browser. This may take a while, so please be patient!
					</p>
					<button className="primary" onClick={start}>
						Start Cache Scan
					</button>
					<BackButtonContainer />
				</>
			);
		}

		if (done === TOTAL) {
			return (
				<>
					<p>
						<b>Cache scan complete!</b> You will be able to confirm uploading your data at a later step.
					</p>
					<button className="primary" onClick={linkToNext}>
						Next
					</button>
				</>
			);
		}

		const progressPercent = 100 * done / TOTAL;

		return (
			<>
				<p>
					Scanning MSPFA's cache in your browser... This may take a while, so please be patient!
				</p>
				{platform !== 'mobile' && (
					<p>
						You are free to tab out while this loads (though it may load slower while tabbed out in some cases).
					</p>
				)}
				<div className="progress-container">
					<div className="progress" style={{ width: `${progressPercent}%` }}>
						{progressPercent.toFixed(2)}%
					</div>
				</div>
			</>
		)
	};

	return (
		<main>
			<BrowserHeading />
			{getContent()}
		</main>
	);
}

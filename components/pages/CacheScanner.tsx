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
import timeout from 'lib/timeout';
import useFunction from 'lib/useFunction';
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
	const [error, setError] = useState<unknown>();
	const [done, setDone] = useState(0);

	const storyIDIndexesRef = useRef<Record<CacheScanType, number>>({
		story: 0,
		log: 0,
		search: 0,
		css: 0,
		js: 0
	});
	const storyIDIndexes = storyIDIndexesRef.current;

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

	const fetchNext = useFunction((type: CacheScanType) => {
		if (error) {
			return;
		}

		const storyIDIndex = storyIDIndexes[type];
		const storyID = STORY_IDS[storyIDIndex];
		if (storyID === undefined) {
			return;
		}

		storyIDIndexes[type]++;

		const urlString = getURLString[type](storyID);

		let tries = 0;

		const tryToFetch = async () => {
			if (error) {
				return;
			}

			tries++;

			const [response] = await Promise.all([
				fetch(urlString, {
					cache: cacheModeRef.current,
					mode: 'same-origin',
					headers: {
						'MSPFA-Recover': '1'
					}
				}).catch(() => undefined),
				timeout()
			]);

			setDone(done => done + 1);
			fetchNext(type);

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
		};

		tryToFetch();
	});

	const start = useFunction(async () => {
		setStarted(true);

		if (!cacheModeRef.current) {
			await setCacheMode();
		}

		for (let i = 0; i < 4; i++) {
			CACHE_SCAN_TYPES.forEach(fetchNext);
		}
	});

	const linkToNext = useLinkTo(
		platform === 'mobile'
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
						Click the button below to start scanning your browser cache for MSPFA data. This may take a while, so please be patient!
					</p>
					<button className="primary" onClick={start}>
						Start Cache Scan
					</button>
					<BackButtonContainer />
				</>
			);
		}

		if (error) {
			return (
				<>
					<p>
						An error occurred:
					</p>
					<pre>{error.toString()}</pre>
					<p>
						Check your network connection and try again after refreshing the page. If the issue persists after retrying, report this to Grant#2604 on Discord (or support@mspfa.com if you can't use Discord).
					</p>
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
					Scanning your browser's cache for MSPFA data... This may take a while, so please be patient!
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

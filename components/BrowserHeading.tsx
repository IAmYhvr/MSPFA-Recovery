import { Browser, useBrowser } from 'lib/BrowserContext';

const texts: Record<Browser, string> = {
	'chrome-with-google': 'Chrome',
	'chromium': 'Chrome-like Browsers',
	'firefox': 'Firefox',
	'opera': 'Opera',
	'safari': 'Safari',
	'mobile': 'Mobile/Tablet'
}

export default function BrowserHeading() {
	const [browser] = useBrowser();

	const text = texts[browser!];

	return (
		<h1>{text}</h1>
	);
}

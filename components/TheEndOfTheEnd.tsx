import Home from 'components/pages/Home';
import { useBrowser } from 'lib/BrowserContext';
import useLinkTo from 'lib/useLinkTo';

export default function TheEndOfTheEnd() {
	const [browser] = useBrowser();

	return (
		<>
			<p>
				You may now {browser === 'chrome-with-google' && 'delete the recovery bookmark and '}close this tab.
			</p>
			<p>
				<button onClick={useLinkTo(Home)}>
					Back to Start
				</button>
			</p>
		</>
	);
}

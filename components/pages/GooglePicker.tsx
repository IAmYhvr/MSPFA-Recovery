import useLinkTo from 'lib/useLinkTo';
import CacheScanner from 'components/pages/CacheScanner';
import { useBrowser } from 'lib/BrowserContext';
import BackButtonContainer from 'components/BackButtonContainer';
import useFunction from 'lib/useFunction';

export default function GooglePicker() {
	const [, setBrowser] = useBrowser();

	const linkToCacheScanner = useLinkTo(CacheScanner);

	return (
		<main>
			<h1>Chrome</h1>
			<p>
				Are you signed into Google in your browser?
			</p>
			<p>
				<button
					className="primary"
					onClick={
						useFunction(() => {
							setBrowser('chrome-with-google');

							linkToCacheScanner();
						})
					}
				>
					Yes
				</button>
				<button
					className="primary"
					onClick={
						useFunction(() => {
							setBrowser('chromium');

							linkToCacheScanner();
						})
					}
				>
					No
				</button>
			</p>
			<BackButtonContainer />
		</main>
	);
}

import BrowserButton from 'components/BrowserButton';
import useLinkTo from 'lib/useLinkTo';
import { usePlatform } from 'lib/PlatformContext';
import PlatformPicker from 'components/pages/PlatformPicker';
import GooglePicker from 'components/pages/GooglePicker';
import BackButtonContainer from 'components/BackButtonContainer';
import CacheScanner from 'components/pages/CacheScanner';

export default function BrowserPicker() {
	const [platform] = usePlatform();

	return (
		<main style={{ maxWidth: 'none' }}>
			<h1>MSPFA Recovery Tool</h1>
			<p>
				Which browser are you using?
			</p>
			<p>
				<BrowserButton value="chrome" label="Chrome" onClick={useLinkTo(GooglePicker)}>
					logos:chrome
				</BrowserButton>
				<BrowserButton value="firefox" label="Firefox" onClick={useLinkTo(CacheScanner)}>
					logos:firefox
				</BrowserButton>
				{platform === 'mac' && (
					<BrowserButton value="safari" label="Safari" onClick={useLinkTo(CacheScanner)}>
						logos:safari
					</BrowserButton>
				)}
				<BrowserButton value="opera" label="Opera" onClick={useLinkTo(CacheScanner)}>
					logos:opera
					/recover/icons/opera-gx.png
				</BrowserButton>
				<BrowserButton value="chromium" label="Other" onClick={useLinkTo(CacheScanner)}>
					logos:microsoft-edge
					logos:brave
					/recover/icons/chromium.png
					mdi:dots-horizontal
				</BrowserButton>
			</p>
			<BackButtonContainer />
		</main>
	);
}

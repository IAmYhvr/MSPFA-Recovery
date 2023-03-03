import useLinkTo from 'lib/useLinkTo';
import BrowserPicker from 'components/pages/BrowserPicker';
import CacheScanner from 'components/pages/CacheScanner';
import PlatformButton from 'components/PlatformButton';
import BackButtonContainer from 'components/BackButtonContainer';
import { useBrowser } from 'lib/BrowserContext';
import useFunction from 'lib/useFunction';

export default function PlatformPicker() {
	const [, setBrowser] = useBrowser();

	const linkToCacheScanner = useLinkTo(CacheScanner);

	const pickMobile = useFunction(() => {
		setBrowser('mobile');

		linkToCacheScanner();
	});

	return (
		<main style={{ maxWidth: '700px' }}>
			<h1>MSPFA Recovery Tool</h1>
			<p>
				You can help right here in this website without downloading anything!
			</p>
			<p>
				Your browser stores a surprising amount of data on the pages you visit. Using this data, we can retrieve some of what was lost.
			</p>
			<p>
				You can see the exact data that'll be sent before sending it, and everything is sent anonymously. This tool is also open-source; there's a link in the bottom-right corner, so feel free to confirm this yourself!
			</p>
			<p>
				Which platform are you on?
			</p>
			<div>
				<PlatformButton
					value="mobile"
					label="Mobile/Tablet"
					onClick={pickMobile}
				>
					material-symbols:phone-iphone
				</PlatformButton>
				<PlatformButton
					value="windows"
					label="Windows"
					onClick={useLinkTo(BrowserPicker)}
				>
					logos:microsoft-windows
				</PlatformButton>
				<PlatformButton
					value="mac"
					label="macOS"
					onClick={useLinkTo(BrowserPicker)}
				>
					/recover/icons/mac.png
				</PlatformButton>
				<PlatformButton
					value="linux"
					label="Linux"
					onClick={useLinkTo(BrowserPicker)}
				>
					logos:linux-tux
				</PlatformButton>
			</div>
			<BackButtonContainer />
		</main>
	);
}

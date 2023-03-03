import DataUpload from 'components/DataUpload';
import TheEndOfTheEnd from 'components/TheEndOfTheEnd';
import { useData } from 'lib/DataContext';
import { usePlatform } from 'lib/PlatformContext';

export default function TheEnd() {
	const [platform] = usePlatform();
	const data = useData();

	if (
		Object.values(data.stories).length === 0
		&& Object.values(data.users).length === 0
	) {
		return (
			<main>
				<h2>No data found!</h2>
				<p>
					Thank you so much for helping.
				</p>
				<p>
					We didn't find any useful data from your browser's cache{platform !== 'mobile' && ' or history file'}, but if you've used MSPFA on other devices, browsers, or browser profiles, you can use this tool there as well!
				</p>
				{platform === 'mobile' && (
					<p>
						<b>You're much more likely to have useful data on desktop than on mobile/tablet!</b>
					</p>
				)}
				<TheEndOfTheEnd />
			</main>
		);
	}

	return <DataUpload />;
}

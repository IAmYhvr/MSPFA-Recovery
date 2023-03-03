import { useBrowser } from 'lib/BrowserContext';
import { useData } from 'lib/DataContext';
import useFunction from 'lib/useFunction';
import { useRef, useState } from 'react';

export default function DataUpload() {
	const [browser] = useBrowser();

	const [status, setStatus] = useState<'confirm' | 'uploading' | 'done'>('confirm');
	const [error, setError] = useState<unknown>();

	const data = useData();

	const triesRef = useRef(0);

	const tryToFetch = useFunction(async () => {
		triesRef.current++;

		let response;
		try {
			response = await fetch('/recover/api/data', {
				method: 'POST',
				body: JSON.stringify(data)
			}).then(response => {
				if (!response.ok) {
					throw Error(`${response.status} ${response.statusText}\n${response.text()}`);
				}

				return response;
			});
		} catch (error) {
			if (triesRef.current < 10) {
				tryToFetch();
				return;
			}

			setError(error);
			return;
		}

		setStatus('done');
	});

	const upload = useFunction(() => {
		setStatus('uploading');
		tryToFetch();
	});

	const retry = useFunction(() => {
		triesRef.current = 0;
		setError(undefined);

		upload();
	});

	if (status === 'done') {
		return (
			<main>
				<h2>Thank you!</h2>
				<p>
					Thank you so much for helping.
				</p>
				<p>
					If you've used MSPFA on other devices, browsers, or browser profiles, you can use this tool there as well!
				</p>
				<p>
					You may now {browser === 'chrome-with-google' && 'delete the recovery bookmark and '}close this tab.
				</p>
			</main>
		);
	}

	const getContent = () => {
		if (error) {
			return (
				<>
					<p>An error occurred:</p>
					<pre>{error.toString()}</pre>
					<p>
						<button className="primary" onClick={retry}>
							Retry
						</button>
					</p>
					<p>
						Check your network connection. If the issue persists after retrying, report this to Grant#2604 on Discord (or support@mspfa.com if you can't use Discord).
					</p>
				</>
			);
		}

		if (status === 'uploading') {
			return (
				<p>Uploading...</p>
			);
		}

		let formattedData = '';

		for (const [key, value] of Object.entries(data.stories)) {
			formattedData += 'Adventure #' + key + ': ' + JSON.stringify(value) + '\n';
		}

		for (const [key, value] of Object.entries(data.users)) {
			formattedData += 'User #' + key + ': ' + JSON.stringify(value) + '\n';
		}

		return (
			<>
				<button className="big primary" onClick={upload}>
					Go!
				</button>
				<p>
					Here's the exact data that will be sent:
				</p>
				<pre>{formattedData.slice(0, -1)}</pre>
			</>
		);
	};

	return (
		<main style={{ maxWidth: '800px' }}>
			<h1>Ready to upload?</h1>
			{getContent()}
		</main>
	);
}

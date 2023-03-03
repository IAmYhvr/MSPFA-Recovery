import TheEndOfTheEnd from 'components/TheEndOfTheEnd';
import { useData } from 'lib/DataContext';
import useFunction from 'lib/useFunction';
import useLeaveConfirmation from 'lib/useLeaveConfirmation';
import { useRef, useState } from 'react';

export default function DataUpload() {
	const [status, setStatus] = useState<'confirm' | 'uploading' | 'done'>('confirm');
	const [error, setError] = useState<unknown>();

	useLeaveConfirmation(status !== 'done');

	const data = useData();

	const triesRef = useRef(0);

	const tryToFetch = useFunction(() => {
		triesRef.current++;

		fetch('/recover/api/data', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response => {
			if (!response.ok) {
				throw Error(`${response.status} ${response.statusText}\n${response.text()}`);
			}

			setStatus('done');
		}).catch((error: unknown) => {
			if (triesRef.current < 3) {
				tryToFetch();
				return;
			}

			setError(error);
		});
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
				<TheEndOfTheEnd />
			</main>
		);
	}

	const getContent = () => {
		if (error) {
			return (
				<>
					<h1>Oops!</h1>
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
				<>
					<h1>Almost done...</h1>
					<p>Uploading...</p>
				</>
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
				<h1>Ready to upload?</h1>
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
			{getContent()}
		</main>
	);
}

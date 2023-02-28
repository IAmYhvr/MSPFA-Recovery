{
	const onCorrectLocation = () => {
		const url = new URL(location.href);

		return (
			url.hostname === 'myactivity.google.com'
			&& /^(?:\/u\/\d+)?\/myactivity$/.test(location.pathname)
			&& url.searchParams.get('q') === 'mspfa.com'
			&& url.searchParams.get('product') === '6'
		);
	};

	const getLoadingMessage = () => (
		document.querySelector('[data-loadingmessage]')
	);

	const getLoading = () => {
		const loadingMessage = getLoadingMessage();

		if (!loadingMessage) {
			return false;
		}

		return loadingMessage.getAttribute('data-active') === 'true';
	};

	const getLoadingButton = () => {
		const loadingMessage = getLoadingMessage();

		if (!loadingMessage) {
			return;
		}

		return loadingMessage.parentNode.parentNode.getElementsByTagName('button')[0];
	}

	const getEmptyImage = () => (
		document.querySelector('img[src^="https://www.gstatic.com/myactivity/scene/scene_fp_empty_state"]')
	);

	let entryParent;

	const getTopEntry = () => (
		document.querySelector('c-wiz[data-date]')
	);

	const getEntryDate = entry => {
		const dateString = entry.getAttribute('data-date');
		const stringWithTime = entry.firstChild.firstChild.lastChild.firstChild.lastChild.textContent;
		const timeString = stringWithTime.slice(0, stringWithTime.indexOf('•')).trim();
		return new Date(dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6) + ' ' + timeString);
	};

	const getEntryLink = entry => (
		entry.querySelector('a[href^="https://www.google.com/url"]')
	);

	const getEntryImageURL = entry => {
		const image = entry.querySelector('img[alt=""]');

		if (!image) {
			return undefined;
		}

		return image.src;
	};

	const removeEntryAndPreviousSiblings = entry => {
		while (entry.previousSibling) {
			entry.parentNode.removeChild(entry.previousSibling);
		}

		entry.parentNode.removeChild(entry);
	};

	const minDateNumber = +new Date('2022-06-26');
	const maxDateNumber = +new Date('2023-02-04');

	const setStatus = string => {
		const oldStatus = document.getElementById('mspfa-status');
		if (oldStatus) {
			oldStatus.parentNode.removeChild(oldStatus);
		}

		const status = document.createElement('div');
		status.id = 'mspfa-status';
		status.style.textAlign = 'center';

		const lines = string.split('\n');
		for (let i = 0; i < lines.length; i++) {
			status.appendChild(document.createTextNode(lines[i]));

			if (i !== lines.length - 1) {
				status.appendChild(document.createElement('br'));
			}
		}

		const loadingButton = getLoadingButton();
		if (loadingButton) {
			loadingButton.style.display = 'none';
		}

		let statusParent;

		const loadingMessage = getLoadingMessage();
		if (loadingMessage) {
			statusParent = loadingMessage.parentNode.parentNode.parentNode;
		}

		const emptyImage = getEmptyImage();

		if (emptyImage) {
			emptyImage.parentNode.parentNode.style.display = 'none';

			statusParent = emptyImage.parentNode.parentNode.parentNode;
		}

		if (!statusParent) {
			throw new Error('No status parent found.');
		}

		statusParent.appendChild(status);

		return status;
	};

	const STORY_PATHNAMES = ['/', '/log/', '/search/', '/preview/', '/readers/'];
	const USER_PATHNAMES = ['/user/', '/achievements/', '/favs/'];

	const u = {};
	const s = {};

	const addEntryData = entry => {
		const dateNumber = +getEntryDate(entry);

		if (dateNumber > maxDateNumber) {
			return;
		}

		if (dateNumber < minDateNumber) {
			return 'done';
		}

		const link = getEntryLink(entry);

		if (!link) {
			return;
		}

		const url = new URL(new URL(link.href).searchParams.get('q'));

		if (url.hostname !== 'mspfa.com') {
			return;
		}

		const data = (
			STORY_PATHNAMES.includes(url.pathname)
				? s
				: USER_PATHNAMES.includes(url.pathname)
					? u
					: undefined
		);

		if (!data) {
			return;
		}

		const id = url.searchParams.get(data === s ? 's' : 'u');

		if (!id || (data === s && (!+id || +id < 47482)) || (data === u && id.length !== 21)) {
			return;
		}

		const name = link.textContent;
		const imageURL = getEntryImageURL(entry);

		if (!data[id]) {
			data[id] = {
				names: {},
				icons: {}
			}
		}

		const item = data[id];

		if (!item.names[name]) {
			item.names[name] = [];
		}

		if (!item.names[name].includes(dateNumber)) {
			item.names[name].push(dateNumber);
		}

		if (imageURL) {
			if (!item.icons[imageURL]) {
				item.icons[imageURL] = [];
			}

			if (!item.icons[imageURL].includes(dateNumber)) {
				item.icons[imageURL].push(dateNumber);
			}
		}
	};

	const finish = () => {
		const loadingMessage = getLoadingMessage();

		if (loadingMessage) {
			loadingMessage.parentNode.parentNode.style.display = 'none';
		}

		if (entryParent) {
			entryParent.style.display = 'none';
		}

		if (Object.values(s).length === 0 && Object.values(u).length === 0) {
			setStatus('There is no MSPFA activity under this Google account!\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.');
			return;
		}

		const data = { s, u };
		const dataString = JSON.stringify(data);

		const status = setStatus('Ready to upload?\n\n');

		const submitButton = document.createElement('button');
		submitButton.type = 'button';
		submitButton.textContent = 'Go!';
		submitButton.style = 'border-radius:8px;border:1px solid transparent;padding:0.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:green;color:#eee;cursor:pointer';

		status.appendChild(submitButton);
		status.appendChild(document.createElement('br'));
		status.appendChild(document.createElement('br'));

		submitButton.addEventListener('click', () => {
			setStatus('Uploading... Please wait!');

			fetch('https://mspfa.com/recover/gather', {
				method: 'POST',
				body: dataString
			}).then(() => {
				setStatus('Done!\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.\n\nIf you\'re sure you have no other Google accounts with MSPFA activity, you may now safely close this tab and return to the recovery site.\n\nThanks for helping us! :)');
			}).catch(() => {
				setStatus('An error occurred while uploading your MSPFA data. Please refresh the page and try activating the bookmark again.\n\nIf it still doesn\'t work, please report this issue to Grant#2604 on Discord (or contact support@mspfa.com if you can\'t use Discord).');
			});
		});

		status.appendChild(document.createTextNode('Here\'s the exact data that will be sent:'));
		status.appendChild(document.createElement('br'));

		const textArea = document.createElement('textarea');
		textArea.readOnly = true;
		textArea.style = 'width:100%;height:20em;resize:none;font-family:monospace;color-scheme:dark';
		textArea.value = JSON.stringify(data, null, '  ');

		status.appendChild(textArea);
	};

	const frame = () => {
		try {
			if (!onCorrectLocation()) {
				if (confirm('Please activate this bookmark again after you\'re redirected to the Google activity page.')) {
					window.open('https://myactivity.google.com/myactivity?q=mspfa.com&product=6');
				}

				return;
			}

			if (getEmptyImage()) {
				finish();
				return;
			}

			setStatus('Please do not close this tab.\n\n(If this stops loading for no apparent reason, refresh the page and activate the bookmark again.)');

			if (getLoading()) {
				requestAnimationFrame(frame);
				return;
			}

			while (true) {
				const entry = getTopEntry();

				if (!entry) {
					break;
				}

				entryParent = entry.parentNode;

				const result = addEntryData(entry);

				removeEntryAndPreviousSiblings(entry);

				if (result === 'done') {
					finish();
					return;
				}
			}

			getLoadingButton().click();

			requestAnimationFrame(frame);
		} catch (error) {
			alert('An error occurred! Please report this to Grant#2604 on Discord (or contact support@mspfa.com if you can\'t use Discord):\n\n' + error);
		}
	};

	const run = () => {
		if (document.getElementById('mspfa-status')) {
			return;
		}

		requestAnimationFrame(frame);
	}

	run();
}

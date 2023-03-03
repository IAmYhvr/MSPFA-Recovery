import { useBrowser } from 'lib/BrowserContext';
import { usePage } from 'lib/PageContext';
import initSqlJs from 'sql.js/dist/sql-asm';
import useFunction from 'lib/useFunction';
import { DragEvent, useState } from 'react';
import { addDataByURL } from 'lib/addData';
import TheEnd from 'components/pages/TheEnd';
import { useData } from 'lib/DataContext';

export type HistoryFileBoxProps = {
	historyFilename: string
};

export default function HistoryFileBox({ historyFilename }: HistoryFileBoxProps) {
	const data = useData();
	const [browser] = useBrowser();
	const [, setPage] = usePage();

	const [hovering, setHovering] = useState(false);
	const [loading, setLoading] = useState(false);

	const startHovering = useFunction((event: DragEvent) => {
		event.preventDefault();

		setHovering(true);
	});

	const stopHovering = useFunction(() => {
		setHovering(false);
	});

	const drop = useFunction(async (event: DragEvent) => {
		event.preventDefault();

		stopHovering();

		const file = event.dataTransfer.items[0]?.getAsFile();

		if (file?.name !== historyFilename) {
			return;
		}

		setLoading(true);

		try {
			const SQL = await initSqlJs();
			const buffer = await file.arrayBuffer();
			const db = new SQL.Database(new Uint8Array(buffer));

			const isNullOrString = (value: unknown): value is null | string => (
				value === null || typeof value === 'string'
			);

			const finish = () => {
				setPage(() => TheEnd);
			};

			if (browser === 'firefox') {
				db.each(
					'SELECT last_visit_date, url, title, description, preview_image_url FROM "moz_places" WHERE url LIKE "https://mspfa.com/%"',
					row => {
						let {
							last_visit_date: dateNumber,
							url: urlString,
							title: name,
							description,
							preview_image_url: icon
						} = row;

						if (dateNumber === null || !(
							typeof urlString === 'string'
							&& isNullOrString(name)
							&& isNullOrString(description)
							&& isNullOrString(icon)
						)) {
							return;
						}

						dateNumber = +dateNumber / 1000;

						addDataByURL(data, urlString, dateNumber, { name, description, icon });
					},
					finish
				);
			} else {
				const DATE_OFFSET = +new Date('1601-01-01T00:00:00Z');

				db.each(
					'SELECT last_visit_time, url, title FROM "urls" WHERE url LIKE "https://mspfa.com/%"',
					row => {
						let {
							last_visit_time: dateNumber,
							url: urlString,
							title: name
						} = row;

						if (dateNumber === null || !(
							typeof urlString === 'string'
							&& typeof name === 'string'
						)) {
							return;
						}

						dateNumber = +dateNumber / 1000;
						dateNumber += DATE_OFFSET;

						addDataByURL(data, urlString, dateNumber, { name });
					},
					finish
				);
			}
		} catch (error: unknown) {
			console.error(error);
			alert('That file is invalid!\n\nIf you believe this is a mistake, report this to Grant#2604 on Discord (or support@mspfa.com if you can\'t use Discord).')

			setLoading(false);
		}
	});

	return loading ? (
		<p style={{ textAlign: 'center', opacity: 0.5 }}>
			Loading...
		</p>
	) : (
		<div
			className={`file-box${hovering ? ' hovering' : ''}`}
			onDragOver={startHovering}
			onDragEnter={startHovering}
			onDragLeave={stopHovering}
			onDrop={drop}
		/>
	);
}

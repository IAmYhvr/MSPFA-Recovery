import Home from 'components/pages/Home';
import BrowserContext, { Browser } from 'lib/BrowserContext';
import Data from 'lib/Data';
import { DataContext } from 'lib/DataContext';
import PageContext, { PreviousPageContext } from 'lib/PageContex';
import PlatformContext, { Platform } from 'lib/PlatformContext';
import { useMemo, useRef, useState } from 'react';

export default function Main() {
	const dataRef = useRef<Data>({
		stories: {},
		users: {}
	});
	const data = dataRef.current;

	const [Page, setPage] = useState(() => Home);
	const pageState = useMemo(() => (
		[Page, setPage] as const
	), [Page, setPage]);

	const pageRef = useRef(Page);
	const previousPagesRef = useRef<Array<() => JSX.Element>>([]);
	const previousPages = previousPagesRef.current;

	if (Page !== pageRef.current) {
		const pageIndex = previousPages.indexOf(Page);
		if (pageIndex === -1) {
			previousPages.push(pageRef.current);
		} else {
			previousPages.length = pageIndex;
		}

		pageRef.current = Page;
	}

	const PreviousPage = previousPages[previousPages.length - 1];

	const [platform, setPlatform] = useState<Platform>();
	const platformState = useMemo(() => (
		[platform, setPlatform] as const
	), [platform, setPlatform]);

	const [browser, setBrowser] = useState<Browser>();
	const browserState = useMemo(() => (
		[browser, setBrowser] as const
	), [browser, setBrowser]);

	return (
		<DataContext.Provider value={data}>
			<PageContext.Provider value={pageState}>
				<PlatformContext.Provider value={platformState}>
					<BrowserContext.Provider value={browserState}>
						<PreviousPageContext.Provider value={PreviousPage}>
							<Page />
						</PreviousPageContext.Provider>
					</BrowserContext.Provider>
				</PlatformContext.Provider>
			</PageContext.Provider>
		</DataContext.Provider>
	);
}

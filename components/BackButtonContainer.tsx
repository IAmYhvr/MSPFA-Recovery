import { PreviousPageContext, usePage } from 'lib/PageContex';
import useFunction from 'lib/useFunction';
import { useContext } from 'react';

export default function BackButtonContainer() {
	const [, setPage] = usePage();
	const PreviousPage = useContext(PreviousPageContext);

	return (
		<p>
			<button
				onClick={
					useFunction(() => {
						setPage(() => PreviousPage);
					})
				}
			>
				Back
			</button>
		</p>
	);
}

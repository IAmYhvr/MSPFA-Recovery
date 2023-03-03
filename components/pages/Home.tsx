import FAQ from 'components/pages/FAQ';
import PlatformPicker from 'components/pages/PlatformPicker';
import useLinkTo from 'lib/useLinkTo';

export default function Home() {
	return (
		<main>
			<h1>MSPFA Recovery</h1>
			<p>
				MSPFA suffered from a minor data loss, and needs your help getting some of the data back.
			</p>
			<div>
				<button className="big" onClick={useLinkTo(FAQ)}>
					What happened?
				</button>
				<button className="big primary" onClick={useLinkTo(PlatformPicker)}>
					How can I help?
				</button>
			</div>
		</main>
	);
}

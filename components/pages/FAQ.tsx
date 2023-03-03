import BackButtonContainer from 'components/BackButtonContainer';
import PlatformPicker from 'components/pages/PlatformPicker';
import useLinkTo from 'lib/useLinkTo';

export default function FAQ() {
	return (
		<main style={{ maxWidth: '850px' }}>
			<h1>FAQ</h1>

			<h3>Are my adventures safe?</h3>
			<p>
				Yes.
			</p>

			<h3>Are you sure?</h3>
			<p>
				Yes, no page data was ever lost in the first place. In fact, all adventures' pages have been backed up in multiple different locations to be extra safe.
			</p>

			<h3>What happened, and how can I be sure it won't happen again?</h3>
			<ul>
				<li>Some recent metadata was lost (see next FAQ) due to backups not running properly during an unexpected database failure.</li>
				<li>The sysadmin whose responsibility it was to manage backups kept procrastinating fixing the backup system, despite being frequently notified of the issue as soon as it was discovered. Eventually, he stopped responding entirely. He's no longer on our team.</li>
				<li>The site's current owner will fix the backup system himself and personally ensure it's 100% working before putting the site online again.</li>
				<li>Even if you don't trust our backup system, we'll add a new option to download a copy of all your adventure's data once the site's back.</li>
			</ul>

			<h3>What data was lost?</h3>
			<ul>
				<li>NOT page data! All page data is 100% safe and sound. Same for comments.</li>
				<li>For a large percentage of adventures and users, we've already recovered more recent data from the below losses!</li>
				<li>Some adventure favorites, ownerships, titles, descriptions, icons, or tags created in the 6 months before the incident were lost (since August 11, 2022).</li>
				<li>Some usernames, profile icons, descriptions, and messages created in the 7 months before the incident were lost (since June 26, 2022).</li>
			</ul>

			<h3>Will I have to prove ownership of my adventure?</h3>
			<p>
				While some adventure ownerships might need to be proven manually, many can be proven and restored completely automatically. Sit tight for now since we dont want people to go through the likely unnecessary effort of proving anything until we've already done everything automatic that we can.
			</p>

			<h3>When will the site be back?</h3>
			<p>
				No clue, but rest assured we're working our asses off. It'll most likely be a couple weeks. Life can unfortunately be busy.
			</p>

			<p>
				<button className="big primary" onClick={useLinkTo(PlatformPicker)}>
					How can I help?
				</button>
			</p>

			<BackButtonContainer />
		</main>
	);
}

import BackButtonContainer from 'components/BackButtonContainer';
import PlatformPicker from 'components/pages/PlatformPicker';
import useLinkTo from 'lib/useLinkTo';

export default function FAQ() {
	return (
		<main id="faq" style={{ maxWidth: '850px' }}>
			<h1>FAQ</h1>

			<h2>Are my adventures safe?</h2>
			<p>
				Yes.
			</p>

			<h2>Are you sure?</h2>
			<p>
				Yes, no page data was ever lost in the first place. In fact, all adventures' pages have been backed up in multiple different locations to be extra safe.
			</p>

			<h2>What happened, and how can I be sure it won't happen again?</h2>
			<ul>
				<li>Some recent metadata was lost (see next FAQ) due to backups not running properly during an unexpected database failure on February 3.</li>
				<li>The sysadmin responsible for managing backups continually delayed fixing the backup system, despite being frequently notified of the issue as soon as it was discovered. Eventually, he stopped responding entirely. He's no longer on our team.</li>
				<li>The site's current owner will fix the backup system himself and personally ensure it's 100% working before putting the site online again.</li>
				<li>Even if you don't trust our backup system, we'll add a new option to download a copy of all your adventure's data once the site's back.</li>
			</ul>

			<h2>What data was lost?</h2>
			<ul>
				<li>For a large percentage of adventures and users, we've already recovered more recent data from the below losses!</li>
				<li>Some adventure favorites, ownerships, descriptions, icons, or tags created in the 6 months before the incident were lost (since August 11, 2022).</li>
				<li>Some usernames, profile icons, descriptions, and messages created in the 7 months before the incident were lost (since June 26, 2022).</li>
				<li>All pages and comments, as well as any data before the aforementioned dates are 100% safe and sound.</li>
			</ul>

			<h2>Will I have to prove ownership of my adventure?</h2>
			<p>
				While some adventure ownerships might need to be proven manually, many can be proven and restored completely automatically. Sit tight for now since we dont want people to go through the likely unnecessary effort of proving anything until we've already done everything automatic that we can.
			</p>

			<h2>When will the site be back?</h2>
			<p>
				No clue, but rest assured we're working our asses off. It'll most likely be a couple weeks. There's a to-do list actively updated with our progress in the <a href="https://mspfa.com/discord" target="_blank" rel="noreferrer">MSPFA Discord server</a>, pinned to the #mspfa-recovery channel.
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

export default function FAQ() {
	return (
		<main id="faq" style={{ maxWidth: '850px' }}>
			<h1>FAQ</h1>

			<h2>Are my adventures safe?</h2>
			<p>
				Yes, no page data was ever lost in the first place. Keep reading!
			</p>

			<h2>What happened, and how can I be sure it won't happen again?</h2>
			<ul>
				<li>MSPFA suffered a minor data loss due to backups not running properly during an unexpected database failure on February 3, 2023.</li>
				<li>The sysadmin responsible for managing backups continually delayed fixing the backup system, despite being frequently notified of the issue as soon as it was discovered. Eventually, he stopped responding entirely. He's no longer on our team.</li>
				<li>Our new backup system publicly reports details on each successful backup to a daily log in our <a href="https://mspfa.com/discord" target="_blank" rel="noreferrer">Discord server</a>, so from now on, you can see for yourself whether our backups are working!</li>
				<li>We also added an option to export a copy of your adventure's data at the bottom of the page editor.</li>
			</ul>

			<h2>What data was lost?</h2>
			<ul>
				<li><strong>PLEASE: Re-favorite any adventures you favorited</strong> between August 11, 2022 and February 3, 2023! Favorites were the biggest loss, and if I were an author, I'd hate to lose a bunch of those. So help an author out and re-favorite anything you can. Spread the word!</li>
				<li>Some other adventure metadata (NOT pages or comments) in that time frame was also lost, such as ownerships and changes to titles, descriptions, icons, tags, CSS, etc. We've recovered the majority of that, but <strong>you may want to double-check your adventures' info to be sure.</strong></li>
				<li>Some user metadata since June 26, 2022 was lost, such as changes to settings, profile info, and game saves, but we've recovered most profile info. <strong>Double-check your settings and profile too!</strong></li>
				<li>All pages and comments are 100% safe and sound, as well as any data before the aforementioned dates.</li>
			</ul>

			<h2>I lost ownership of my adventure! What do I do?</h2>
			<p>
				Visit the #reclaim-your-adventure channel in the <a href="https://mspfa.com/discord" target="_blank" rel="noreferrer">MSPFA Discord server</a>, and we can help you out!
			</p>
			<p>
				<strong>Even if you don't care about an adventure you lost ownership of</strong>, <em>please</em> still make a post there. We want there to be as few adventures with missing owners as possible--it helps our data management, archival, and everyone's user experience. You can also make a post there if you aren't the owner but know who is.
			</p>
			<p>
				If you aren't able to use Discord, you can also contact us via email at <a href="mailto:support@mspfa.com" target="_blank">support@mspfa.com</a>, but our response time may be slower due to the asynchronous nature of email. (Also, we're still repairing our email system, so you'll have to wait a few days before we're able to send replies.)
			</p>
		</main>
	);
}

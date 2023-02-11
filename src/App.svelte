<script lang="ts">
	import Chrome from "./lib/Chrome.svelte";
	import Firefox from "./lib/Firefox.svelte";
	import { mobileAndTabletCheck } from "./lib/isMobile";

	type Browser = "chromium" | "firefox" | "safari" | "unknown";

	let stage = 0;
	let browser: Browser = "unknown";
	let isMobile = mobileAndTabletCheck();
	let results = "";

	const { userAgent } = window.navigator;
	if (userAgent.includes("Firefox")) browser = "firefox";
	else if (userAgent.includes("Chrome")) browser = "chromium";
	else if (userAgent.includes("Safari")) browser = "safari";
	else browser = "unknown";

	console.log(window.navigator.userAgent);

	function next() {
		stage++;
	}

	function resultsFound({ detail }) {
		results = detail;
		stage = 2;
	}

	async function sendData() {
		let res = await fetch("/gather", {
			body: results,
			method: "POST",
		});
		let text = await res.text();
		if (text === "success") next();
		else stage = -1;
		// TODO api endpoint?
		// post(results);
	}
</script>

<main>
	<div>
		{#if isMobile}
			<p>
				Unfortunately, this tool can't be used to help on mobile.<br
				/>If you've used MSPFA on a computer, come back on that.
			</p>
		{:else if stage === 0}
			<h1>MSPFA Recovery Tool</h1>
			<p>
				This tool scans your browser's files for all the times you've
				been on MSPFA,<br /> to gather data that may have been lost.<br
				/>
				It immediately disregards data from every other site.<br />
				After it's done processing, it will be anonymously sent to us.<br
				/>
				You will be able to see exactly what data you're sharing before you
				actually share it.
			</p>
			{#if browser === "unknown"}
				<p>
					You baffle me. You aren't using Chromium, Firefox, or
					Safari?! There's nothing you can do to help, sorry :(
				</p>
			{:else if browser === "safari"}
				<p>
					Unfortunately, it wasn't worth the time investment for me to
					add Safari support to this.<br />Simply not enough people
					use it.<br />If you're super super big on MSPFA, and may
					have a TON of data in Safari, say so in #mspfa-recovery on
					the Discord.
				</p>
			{:else}
				<button on:click={next}>Got it</button>
			{/if}
		{:else if stage === 1}
			{#if browser === "firefox"}
				<Firefox on:data={resultsFound} />
			{:else if browser === "chromium"}
				<Chrome on:data={resultsFound} />
			{/if}
		{:else if stage === 2}
			<h2>Almost done...</h2>
			<p>
				Here's <i>exactly</i> what's you're sending, in case you want to
				check for yourself.
			</p>
			<button on:click={sendData} class="CLICKME">Send data</button>

			<pre>{results}</pre>
		{:else if stage === 3}
			<h2>Thank you!</h2>
			<p>
				Thank you so much for helping. Your submitted data has been
				stored and will be analyzed at a later time.<br />
				You may now close this tab safely.
			</p>
		{:else if stage === -1}
			<h2>Whoops.</h2>
			<p>Something went wrong with sending the data.<br />Please report this on the Discord.</p>
		{/if}
	</div>
</main>
<div id="footer">
	made for <a href="https://mspfa.com">mspfa</a> |
	<a href="https://discord.gg/K8yT2Ft4UU">discord</a>
	| <a href="TODO_PUT_SOURCE_URL">source code</a>
</div>

<style>
</style>

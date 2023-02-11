<script lang="ts">
	import BrowserCard from "./lib/BrowserCard.svelte";
	import Chrome from "./lib/Chrome.svelte";
	import Firefox from "./lib/Firefox.svelte";

	type Browser = "chromium" | "firefox" | "safari" | "unknown";

	let stage = 0;
	let browser: Browser = "unknown";
	let isMobile = false;
	let isOpera = false;
	let results = "";

	function next() {
		stage++;
	}

	function go(str: Browser, fuckOpera = false) {
		return () => {
			next();
			browser = str;
			isOpera = fuckOpera;
		};
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
				This tool scans your browser's files for data on all the times
				you've been on MSPFA.<br />
				It's anonymous, and immediately disregards data from every other
				site.<br />
				You will be able to see exactly what data you're sharing before you
				send it.
			</p>
			<button on:click={next}>Computer</button>
			<button
				on:click={() => {
					isMobile = true;
					next();
				}}>Mobile</button
			>
		{:else if stage === 1}
			<h2>Browsers</h2>
			<p>Please select the browser that you're recovering data from.</p>
			<grid id="browsers">
				<BrowserCard
					browsers={["logos:chrome"]}
					on:select={go("chromium")}
				/>
				<BrowserCard
					browsers={["logos:firefox"]}
					on:select={go("firefox")}
				/>
				<BrowserCard
					browsers={["logos:safari"]}
					on:select={go("safari")}
				/>
				<BrowserCard
					browsers={["logos:opera"]}
					on:select={go("chromium", true)}
				/>
				<BrowserCard
					browsers={[
						"logos:microsoft-edge",
						"logos:brave",
						"CHROMIUM",
						"mdi:dots-horizontal",
					]}
					on:select={go("chromium")}
				/>
			</grid>
		{:else if stage === 2}
			{#if browser === "firefox"}
				<Firefox on:data={resultsFound} />
			{:else if browser === "chromium"}
				<Chrome on:data={resultsFound} {isOpera} />
			{:else if browser === "safari"}
				<p>
					Unfortunately, it wasn't worth it for me to add Safari
					support to this.<br />Simply not enough people use it.<br
					/>If you're super super big on MSPFA, and may have a TON of
					data in Safari, say so on the Discord.
				</p>
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
			<p>
				Something went wrong with sending the data.<br />Please report
				this on the Discord.
			</p>
		{/if}
	</div>
</main>
<div id="footer">
	made for <a href="https://mspfa.com">mspfa</a> |
	<a href="https://discord.gg/K8yT2Ft4UU">discord</a>
	| <a href="https://github.com/YhvrWasTaken/MSPFA-Recovery">source code</a>
</div>

<style>
</style>

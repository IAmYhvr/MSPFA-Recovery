<script lang="ts">
	import BrowserCard from "./lib/BrowserCard.svelte";
	import Chrome from "./lib/Chrome.svelte";
	import Firefox from "./lib/Firefox.svelte";

	type Browser = "chrome" | "chromium" | "firefox" | "safari" | "unknown";

	let stage = 0;
	let browser: Browser = "unknown";
	let isMobile = false;
	let isOpera = false;
	let results = "";

	function next() {
		stage++;
	}

	function back() {
		stage--;
	}

	function go(str: Browser, fuckOpera = false) {
		return () => {
			stage = 2;
			browser = str;
			isOpera = fuckOpera;
		};
	}

	function resultsFound({ detail }) {
		results = detail;
		stage = 3;
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
				Unfortunately, this tool doesn't work on mobile.<br />
				If you use MSPFA on PC, feel free to use it there!
			</p>
			<button
				on:click={() => {
					isMobile = false;
					back();
				}}>Back</button
			>
		{:else if stage === 0}
			<h1>MSPFA Recovery Tool</h1>
			<p>
				This tool retrieves from your browser lost data we can use to
				help recover MSPFA.<br />
				It's sent anonymously, and you can see exactly what data will be
				sent before you send it.
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
					on:select={go("chrome")}
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
			<button on:click={back}>Back</button>
		{:else if stage === 2}
			{#if browser === "firefox"}
				<Firefox on:data={resultsFound} on:fuck={back} />
			{:else if browser === "chromium"}
				<Chrome on:data={resultsFound} on:fuck={back} {isOpera} />
			{:else if browser === "chrome"}
				<p>
					Are you logged in to your browser through Google?<br />
					<button
						on:click={() => {
							stage = -2;
						}}>Yes</button
					>
					<button on:click={go("chromium")}>No</button>
				</p>
			{:else if browser === "safari"}
				<p>
					Unfortunately we couldn't find the time to support Safari.
					Sorry about that.<br />
					If you are a Safari user and think your browsing history and
					cache might have a lot of useful MSPFA data in it, let us know
					in the #mspfa-recovery channel in
					<a
						href="https://discord.gg/K8yT2Ft4UU"
						target="_blank"
						rel="noreferrer">our Discord server</a
					>.
				</p>
				<button on:click={back}>Back</button>
			{/if}
		{:else if stage === 3}
			<h2>Almost done...</h2>
			<p>
				Here's <i>exactly</i> what you're sending, in case you want to check
				for yourself.
			</p>
			<button on:click={sendData} class="CLICKME">Send data</button
			><button
				on:click={() => {
					stage = 0;
				}}>Back to start</button
			>

			<pre>{results}</pre>
		{:else if stage === 4}
			<h2>Thank you!</h2>
			<p>
				Thank you so much for helping. Your submitted data has been
				stored and will be analyzed at a later time.<br />
				You're now good to close this tab.
			</p>
		{:else if stage === -1}
			<h2>Whoops.</h2>
			<p>
				Something went wrong with sending the data.<br />Please report
				this on the Discord.
			</p>
		{:else if stage === -2}
			<h2>Whoops.</h2>
			<p>
				There's another script in the works for extracting data from
				Chrome if you're logged in. Stay tuned!
			</p>
		{/if}
	</div>
</main>
<div id="footer">
	made for <a href="https://mspfa.com" target="_blank" rel="noreferrer"
		>mspfa</a
	>
	|
	<a href="https://discord.gg/K8yT2Ft4UU" target="_blank" rel="noreferrer"
		>discord</a
	>
	|
	<a
		href="https://github.com/YhvrWasTaken/MSPFA-Recovery"
		target="_blank"
		rel="noreferrer">source code</a
	>
</div>

<style>
</style>

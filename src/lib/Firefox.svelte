<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Dropbox from "./Dropbox.svelte";
	import FetchCode from "./FetchCode.svelte";

	let dispatcher = createEventDispatcher();

	let firstDone = false;
	let firstData = "";
	let secondData = "";
	let stage = 0;

	function next() {
		stage++;
	}

	function back() {
		stage--;
	}

	function dataDropped({ detail }) {
		firstDone = true;
		firstData = detail;

		next();
	}

	function dataFetched({ detail }) {
		secondData = detail;

		dispatcher("data", firstData + secondData);
	}
</script>

<div class="browser-specific">
	<h2>Firefox</h2>
	{#if stage === 0}
		<ol>
			<li>
				Open a new tab, and go to the URL <code>about:profiles</code>.
			</li>
			<li>
				Look for the profile that says "<b>
					This is the profile in use and it cannot be deleted.
				</b>" It should look like this:<br />
				<img src="history/firefox-{platform}.png" alt="" />
			</li>
			<li>
				Click the <span class="fake-btn">Open Directory</span> button
				next to
				<b>Root Directory</b>.<br /><br />
			</li>
			<li>
				Look for the file named <code>places.sqlite</code> in the folder
				that popped up. After you've found it, drag and drop it onto the
				blue rectangle below:
			</li>
		</ol>
		<!-- ({detail}) => dispatcher("data", detail) -->
		{#if firstDone}
			<b>It worked! You can go to the next step.</b><br />
			<button on:click={next}>Next</button>
		{:else}
			<Dropbox on:data={dataDropped} />
			<br />
		{/if}
		<button on:click={() => dispatcher("fuck")}>Back</button>
		<!-- {:else if stage === 4}
		<p>
			Go back to the <code>about:profiles</code> tab you opened earlier,
			and find the same profile you used before. Click the
			<span class="fake-btn">Open Directory</span> button next to
			<b>Local Directory</b>.
		</p>
		<button on:click={next}>Done</button>
	{:else if stage === 5}
		<p>
			Open the folder named <code>cache2</code> in the folder that popped
			up. After you've opened it, look for the folder named
			<code>entries</code>. Drag and drop it onto the blue rectangle
			below:
		</p>
		<Dropbox on:data={} /> -->
	{:else if stage === 1}
		<p>
			Click the button below to start scanning your browser cache. This
			may take a while.
		</p>
		<FetchCode on:data={dataFetched} on:back={back} />
	{/if}
</div>

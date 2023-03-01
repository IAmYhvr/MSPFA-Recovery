<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Dropbox from "./Dropbox.svelte";
	import FetchCode from "./FetchCode.svelte";

	export let platform: string;

	const buttonText = {
		windows: "Open Folder",
		mac: "Show in Finder",
		linux: "Open Directory"
	}

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

		dispatcher("data", firstData + secondData);
	}
	
	function dataFetched({ detail }) {
		secondData = detail;
		
		next();
	}
</script>

<div class="browser-specific">
	<h2>Firefox</h2>
	{#if stage === 1}
		<ol>
			<li>
				Open a new tab, and go to the URL <code>about:profiles</code>.
			</li>
			<li>
				Find the box that says "<b>This is the profile in use and it cannot be deleted.</b>" It looks like this:<br />
				<!-- Wow! That's stupid. -->
				<img class="screenshot" src="history/firefox-{platform}.png" alt="" style="margin-left: {platform === "mac" ? "-102px" : "-90px"}" />
			</li>
			<li>
				Next to <b>Root Directory</b>, click the
				<span class="fake-btn">{buttonText[platform]}</span> button, outlined in red above.<br />
				<br />
			</li>
			<li>
				In the folder that opened, find the file named <code>places.sqlite</code>,
				and drag and drop it into the box below:
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
		<!-- <button on:click={() => dispatcher("fuck")}>Back</button> -->
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
	{:else if stage === 0}
		<p>
			Click the button below to start scanning your browser cache. This
			may take a while.
		</p>
		<FetchCode on:data={dataFetched} on:back={() => dispatcher("fuck")} />
	{/if}
</div>

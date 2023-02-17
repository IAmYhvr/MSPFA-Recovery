<script lang="ts">
	import Icon from "@iconify/svelte";
	import { createEventDispatcher } from "svelte";
	import Dropbox from "./Dropbox.svelte";
	import FetchCode from "./FetchCode.svelte";

	let dispatcher = createEventDispatcher();

	export let isOpera: boolean;
	export let isLoggedIn: boolean;

	let firstDone = false;
	let firstData = "";
	let secondData = "";
	let stage = isLoggedIn ? -1 : 0;

	function next() {
		stage++;
	}

	function back() {
		stage--;
	}

	function dataDropped({ detail }) {
		firstDone = true;
		firstData = detail;
	}

	function dataFetched({ detail }) {
		secondData = detail;

		dispatcher("data", firstData + secondData);
	}
</script>

<div class="browser-specific">
	<h2>Chrome-like browsers</h2>
	{#if stage === 0}
		<ol>
			<li>
				{#if isOpera}
					Open a new tab, and go to the URL
					<code>chrome://about</code>. Once it's open, look for the
					text that says "<b>Profile:</b>".
				{:else}
					Open a new tab, and go to the URL
					<code>chrome://version</code>. Once it's open, look for the
					text that says "<b>Profile Path:</b>" It should look like
					this:
					<img src="chrome-step2.png" width="460" alt="" />
				{/if}
			</li>
			<li>
				Open your file manager up to the directory listed as <b>
					Profile{isOpera ? "" : " Path"}</b
				>.<br /><br />
				On Windows, you can copy the path, press
				<kbd
					><Icon
						icon="mdi:microsoft-windows"
						height={16}
						inline
					/>Windows</kbd
				>
				+ <kbd>R</kbd>, and paste it in the box that pops up.<br /><br
				/>
				On macOS, you can copy the path, open Finder, press
				<kbd
					><Icon
						icon="material-symbols:keyboard-command-key"
						height={16}
						inline
					/>Command</kbd
				>
				+ <kbd>Shift</kbd> + <kbd>G</kbd>, and paste it in the box that
				pops up.
			</li>
			<li>
				Look for the file named <code>History</code> in the folder that popped
				up. After you've found it, drag and drop it onto the blue rectangle
				below:
			</li>
		</ol>
		{#if firstDone}
			<b>It worked! You can go to the next step.</b><br />
			<button on:click={next}>Next</button>
		{:else}
			<Dropbox on:data={dataDropped} />
		{/if}

		<button on:click={() => dispatcher("fuck")}>Back</button>
	{:else if stage === 1}
		<p>
			Click the button below to start scanning your browser cache. This
			may take a while.
		</p>
		<FetchCode on:data={dataFetched} />

		<!-- <p>
			Next, find the folder named <code>Cache</code> in the same folder.
			Drag and drop that in the rectangle again:<br /><br />
			<details>
				<summary>Not on Windows?</summary>
				If you're on macOS, the folder will be located at
				<code>~/Library/Caches/INSERT-BROWSER-NAME/Default/</code>.<br
				/>If you don't know how to get to this folder, you can open
				Finder, press <code>Command Shift G</code>, paste in
				<code>~/Library/Caches/</code>, and look for the name of your
				browser. You may need to open a few folders to find the one
				named <code>Cache</code> inside that.
				<br /><br />
				If you're on Linux, the folder will be located at
				<code>~/.cache/INSERT-BROWSER-NAME/Default/</code>.
			</details>
		</p>
		<Dropbox on:data={({ detail }) => dispatcher("data", detail)} />
		<progress value={progressValue} max={maxProgress} />
		<button on:click={back}>Back</button> -->
	{:else if stage === -1}
		<p>TODO: Finish activity scraper? Link it here though.</p>
		<button on:click={() => (stage = 1)}>Next</button>
	{/if}
</div>

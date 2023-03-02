<script lang="ts">
	import Icon from "@iconify/svelte";
	import { createEventDispatcher } from "svelte";
	import Dropbox from "./Dropbox.svelte";
	import FetchCache from "./FetchCache.svelte";

	let dispatcher = createEventDispatcher();

	export let isOpera: boolean;
	export let isLoggedIn: boolean;
	export let platform: string;

	let histDone = false;
	let cacheDone = false;
	let stage = 0;

	function next() {
		stage++;
	}

	function back() {
		stage--;
	}

	function dataDropped() {
		histDone = true;

		dispatcher("data");
	}

	function dataFetched() {
		cacheDone = true;

		if (isLoggedIn) dispatcher("data");
	}

	function fuck() {
		dispatcher("fuck");
	}
</script>

<div class="browser-specific">
	<h2>{#if isOpera}Opera{:else}Chrome-like browsers{/if}</h2>
	{#if stage === 1}
		<ol>
			{#if isOpera}
				<li>
					Open a new tab, and go to the URL <code>opera://about</code>.
				</li>
				<li>
					Scroll down to find the text "<b>Profile:</b>". It looks like this:<br />
					<img class="screenshot" src="history/opera-{platform}.png" alt="" />
				</li>
			{:else}
				<li>
					Open a new tab, and go to the URL <code>chrome://version</code>.
				</li>
				<li>
					Find the text "<b>Profile Path:</b>". It looks like this:<br />
					<img class="screenshot" src="history/chrome-{platform}.png" style="margin-left: -90px;" alt="" />
				</li>
			{/if}
			<li>
				Copy the text next to <b>
					Profile{isOpera ? "" : " Path"}</b
				>, outlined in red above.<br /><br />
				{#if platform === "windows"}
					Press
					<kbd
						><Icon
							icon="mdi:microsoft-windows"
							height={16}
							inline
						/>Windows</kbd
					>
					+ <kbd>R</kbd>, paste it into the box that appears, and press <kbd>Enter</kbd>.<br />
				{:else if platform === "mac"}
					Open Finder, press
					<kbd
						><Icon
							icon="material-symbols:keyboard-command-key"
							height={16}
							inline
						/>Command</kbd
					>
					+ <kbd>Shift</kbd> + <kbd>G</kbd>, paste it into the box that appears, and press <kbd>Enter</kbd>.<br />
				{:else}
					If you need help accessing the folder, open a new terminal window,
					and type in <code>xdg-open</code>, followed by a space, and then
					use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> to paste the
					path in, and then finally press enter.
				{/if}
			</li>
			<li>
				In the folder that opened, find the file named <code>History</code>,
				and drag and drop it onto the box below:
			</li>
		</ol>
		<Dropbox on:data={dataDropped} />
		<br />
		{:else if stage === 0}
		{#if cacheDone}
			<p>
				<b>Scan complete!</b> You will be able to confirm uploading your data at a later step.
			</p>
			<button on:click={next}>Next</button>
		{:else}
			<p>
				Click the button below to start scanning your browser cache. This
				will take a while, so please be patient!
			</p>
			<FetchCache on:data={dataFetched} on:back={fuck} />
		{/if}

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
	<!-- {:else if stage === -1}
		<p>TODO: Finish activity scraper? Link it here though.</p>
		<button on:click={() => (stage = 1)}>Next</button> -->
	{/if}
</div>

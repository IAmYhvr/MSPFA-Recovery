<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Dropbox from "./Dropbox.svelte";

	let dispatcher = createEventDispatcher();

	let isOpera = navigator.userAgent.includes("OPR");

	let stage = 0;

	function next() {
		stage++;
	}
</script>

<div class="browser-specific">
	<h2>Chrome (and its variants)</h2>
	{#if stage === 0}
		{#if isOpera}
			<p>
				Open a new tab, and go to the URL <code>chrome://about</code>.
			</p>
		{:else}
			<p>
				Open a new tab, and go to the URL <code>chrome://version</code>.
			</p>
		{/if}
		<button on:click={next}>Done</button>
	{:else if stage === 1}
		<p>
			Look for the text that says "<b>Profile{isOpera ? "" : " Path"}:</b
			>" It should look like this:
		</p>
		<img src="chrome-step2.png" width="500" alt="" />
		<button on:click={next}>Found it</button>
	{:else if stage === 2}
		<p>
			Open your file manager up to the directory listed as <b>
				Profile Path
			</b>.<br /><br />
			On Windows, you can copy the path, press <code>Windows R</code>, and
			paste it in the box that pops up.
		</p>
		<button on:click={next}>Done</button>
	{:else if stage === 3}
		<p>
			Look for the file named <code>History</code> in the folder that popped
			up. After you've found it, drag and drop it onto the blue rectangle below:
		</p>
		<Dropbox on:data={next} />
	{:else if stage === 4}
		<p>
			Next, find the folder named <code>Cache</code> in the same folder.
			Drag and drop that in the rectangle again:<br />
			<i
				>If you're on Linux, the folder will be located at <code
					>~/.cache/INSERT-BROWSER-NAME/Default/</code
				>.</i
			>
		</p>
		<Dropbox on:data={({ detail }) => dispatcher("data", detail)} />
	{/if}
</div>

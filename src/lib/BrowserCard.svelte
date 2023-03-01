<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Icon from "@iconify/svelte";

	export let browsers: string[];
	export let name: string = "";
	let size = 90;
	if (browsers.length > 1) size = 50;

	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch("select")} class="browser">
	{#each browsers as browser}
		{#if browser === "CHROMIUM"}
			<img src="chromium.png" height={size} alt="Chromium">
		{:else if browser === "MACOS"}
			<img src="FinderBigSur.png" height={size} alt="macOS">
		{:else if browser === "GX"}
			<img src="OperaGX.png" height={size} alt="Opera GX" style="margin: 0 0 0 5px">
		{:else}
			<Icon icon={browser} width={size} height={size} inline />
		{/if}
	{/each}
	<p class="browname">{name}</p>
</button>

<style>
	.browser {
		width: 150px;
		height: 170px;
	}

	.browname {
		margin-top: 15px;
		margin-bottom: 0;
	}
</style>

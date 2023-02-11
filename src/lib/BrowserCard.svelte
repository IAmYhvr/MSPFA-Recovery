<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Icon from "@iconify/svelte";

	export let browsers: string[];
	let size = 90;
	if (browsers.length > 1) size = 50;

	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch("select")} class="browser">
	{#each browsers as browser}
		{#if browser === "CHROMIUM"}
			<img src="chromium.png" height={size} alt="Chromium">
		{:else}
			<Icon icon={browser} width={size} height={size} inline />
		{/if}
	{/each}
</button>

<style>
	.browser {
		width: 150px;
		height: 150px;
	}
</style>

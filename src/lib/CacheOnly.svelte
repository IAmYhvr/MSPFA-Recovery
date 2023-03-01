<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Dropbox from "./Dropbox.svelte";
	import FetchCode from "./FetchCode.svelte";

	let dispatcher = createEventDispatcher();

	export let name = "Generic Histless";

	function dataFetched({ detail }) {
		dispatcher("data", "CacheOnly\n" + detail);
	}
</script>

<div class="browser-specific">
	<h2>{name}</h2>
	<p>
		Click the button below to start scanning your browser cache. This will
		take a while, so please be patient!
		{#if platform !== 'mobile'}
			<br /><br />
			You are free to tab out while this loads (though it may load slower while tabbed out).
		{/if}
	</p>
	<FetchCode on:data={dataFetched} on:back={() => dispatcher("fuck")} />
</div>

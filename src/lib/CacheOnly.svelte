<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import FetchCache from "./FetchCache.svelte";

	let dispatcher = createEventDispatcher();

	export let platform: string;
	export let name = "Generic Histless";

	function dataFetched() {
		dispatcher("data");
	}
</script>

<div class="browser-specific">
	<h2>{name}</h2>
	<p>
		Click the button below to start scanning your browser cache. This will
		take a while, so please be patient!
	</p>
	<FetchCache on:data={dataFetched} on:back={() => dispatcher("fuck")} showTabout={platform !== "mobile"} />
</div>

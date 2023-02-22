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
		Click the button below to start scanning your browser cache. This may
		take a while.
	</p>
	<FetchCode on:data={dataFetched} />
	<button on:click={() => dispatcher("fuck")}>Back</button>
</div>

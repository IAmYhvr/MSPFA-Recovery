<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import * as Chrome from "./chrome";
	import * as Firefox from "./firefox";

	let dispatcher = createEventDispatcher();

	let background = "#115";

	function fileHover(e: DragEvent) {
		background = "#337";
		e.preventDefault();
	}

	function fileUnhover() {
		background = "#115";
	}

	async function fileSubmit(e: DragEvent) {
		e.preventDefault();
		fileUnhover();
		console.log(e);

		let firstItem = e.dataTransfer.items[0];
		// console.log(firstItem);
		let firstFile = firstItem.getAsFile();
		if (firstFile.name === "places.sqlite") {
			let string = await Firefox.processDB(firstFile);
			dispatcher("data", string);
		// } else if (
		// 	firstItem.webkitGetAsEntry().isDirectory &&
		// 	firstFile.name === "entries"
		// ) {
		// 	let string = await Firefox.processCacheFolder(firstItem.webkitGetAsEntry() as FileSystemDirectoryEntry);
		// 	dispatcher("data", string);
		} else if (firstFile.name === "History") {
			let string = await Chrome.processDB(firstFile);
			dispatcher("data", string);
		} else if (
			firstItem.webkitGetAsEntry().isDirectory &&
			firstFile.name === "Cache"
		) {
			// let string = await Chrome.traverseFuckingTree(
			// 	firstItem.webkitGetAsEntry() as FileSystemDirectoryEntry
			// );
			// dispatcher("data", string);
		}
	}
</script>

<div
	id="drop-it-here"
	style={`background: ${background}`}
	on:dragover={fileHover}
	on:dragenter={fileHover}
	on:dragleave={fileUnhover}
	on:drop={fileSubmit}
/>

<style>
	#drop-it-here {
		transition: background 0.5s;
		width: 500px;
		height: 250px;
		border: #aae dashed thin;
	}
</style>

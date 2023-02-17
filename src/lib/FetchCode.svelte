<script lang="ts">
	import { createEventDispatcher } from "svelte";

	// I give up on modularity. I'm doing everything in the <script>
	const MAINTENANCE_START = 1675433420000;
	const SCAN_START = 1;
	let SCAN_END = 50052;
	let SCAN_TOTAL = SCAN_END * 2;
	let scanStarted = false;
	let scanComplete = false;
	let adventures: number[] = [];

	let progressParts = [0, 0];
	let progress = 0;

	const saved = [];

	let dispatcher = createEventDispatcher();

	async function beginScan() {
		scanStarted = true;

		let advRes = await fetch("adventures.json");
		adventures = await advRes.json();

		SCAN_END = adventures.length;
		SCAN_TOTAL = SCAN_END * 2;

		for (let i = 0; i < 10; i++) tickScan();
		for (let i = 0; i < 10; i++) tickScan(1);
	}

	// 0. CSS
	// 1. JS
	async function tickScan(part: 0 | 1 = 0) {
		if (progress >= SCAN_TOTAL) {
			if (scanComplete) return;
			scanComplete = true;
			dispatcher("data", transformSaved());
			return;
		}

		let capturedProgress = ++progressParts[part];
		progress++;
		let erred = false;
		let res = await fetch(
			`https://mspfa.com/${part ? "js" : "css"}/?s=${capturedProgress}`,
			{
				cache: "force-cache",
			}
		).catch(e => {
			erred = true;
		});
		if (erred || !(res instanceof Response) || !res.ok) return tickScan(part);
		let timestamp = new Date(res.headers.get("Date")).getTime();
		if (timestamp > MAINTENANCE_START) return tickScan(part);
		let code = await res.text();
		if (code === "") return tickScan(part);

		saved.push({ type: part ? "js" : "css", timestamp, code, story: capturedProgress });
		console.log("Hit!");

		tickScan(part);
	}

	function transformSaved(): string {
		let out = "Cached Code\n";

		saved.forEach(entry => {
			out += JSON.stringify(entry) + "\n";
		});

		return out;
	}
</script>

<div>
	{#if !scanStarted}
		<button id="scan" on:click={beginScan}>Begin Scan</button>
	{:else if !scanComplete}
		<div class="progress-wrapper">
			<div
				class="progress"
				style={`width: ${
					((SCAN_TOTAL - (SCAN_TOTAL - progress)) / SCAN_TOTAL) * 500
				}px`}
			/>
		</div>
	{:else}
		<p>Scan complete!</p>
	{/if}
</div>

<style>
	.progress-wrapper {
		width: 500px;
		height: 50px;
		background: #555;
	}

	.progress {
		height: 50px;
		animation: infinite 3s fancy;
	}

	@keyframes fancy {
		0% {
			background: #595;
		}

		50% {
			background: #7b7;
		}

		100% {
			background: #595;
		}
	}
</style>

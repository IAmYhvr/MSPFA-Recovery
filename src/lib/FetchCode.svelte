<script lang="ts">
	import { createEventDispatcher } from "svelte";
	type ThisIsStupid = 0 | 1 | 2 | 3 | 4;

	// I give up on modularity. I'm doing everything in the <script>
	const MAINTENANCE_START = 1675433420000;
	const SCANS = ["css", "js", "html", "html", "html"];
	const DESIRED_PROPS = "og:title og:image og:description".split(" ");
	const parser = new DOMParser();
	let SCAN_END = 50052;
	let SCAN_TOTAL = SCAN_END * 5;
	let scanStarted = false;
	let scanComplete = false;
	let adventures: number[] = [];

	let progressParts = [0, 0, 0, 0, 0];
	let progress = 0;

	const saved = [];

	let dispatcher = createEventDispatcher();

	async function beginScan() {
		scanStarted = true;

		let advRes = await fetch("adventures.json");
		adventures = await advRes.json();

		SCAN_END = adventures.length;
		SCAN_TOTAL = SCAN_END * 5;

		for (let i = 0; i < 5; i++) tickScan();
		for (let i = 0; i < 5; i++) tickScan(1);
		for (let i = 0; i < 5; i++) tickScan(2);
		for (let i = 0; i < 5; i++) tickScan(3);
		for (let i = 0; i < 5; i++) tickScan(4);
	}

	// 0. CSS
	// 1. JS
	async function tickScan(part: ThisIsStupid = 0) {
		if (progress >= SCAN_TOTAL) {
			if (scanComplete) return;
			scanComplete = true;
			dispatcher("data", transformSaved());
			return;
		}

		let capturedProgress = ++progressParts[part];
		progress++;
		let erred = false;
		// I really don't like this. I could simplify this.
		let URL = `https://mspfa.com/${
			part ? "js" : "css"
		}/?s=${capturedProgress}`;
		if (part === 2) URL = `https://mspfa.com/?s=${capturedProgress}&p=1`;
		if (part === 3) URL = `https://mspfa.com/log/?s=${capturedProgress}`;
		if (part === 4) URL = `https://mspfa.com/search/?s=${capturedProgress}`;
		let res = await fetch(URL, {
			cache: "force-cache",
			headers: {
				"MSPFA-Recover": "1"
			}
		}).catch(() => {
			erred = true;
		});
		if (erred || !(res instanceof Response) || !res.ok)
			return tickScan(part);
		let timestamp = new Date(res.headers.get("date")).getTime();
		if (timestamp < MAINTENANCE_START) return tickScan(part);
		let code = await res.text();
		if (code === "") return tickScan(part);

		saved.push({
			type: SCANS[part],
			timestamp,
			code,
			story: capturedProgress,
		});

		tickScan(part);
	}

	function transformSaved(): string {
		let out = "Cached Code\n";

		saved.forEach(entry => {
			if (entry.type === "html") return;
			out += JSON.stringify(entry) + "\n";
		});

		out += "Cached Pages\n";
		saved
			.filter(({ type }) => type === "html")
			.forEach(entry => {
				let toAdd: any = {
					timestamp: entry.timestamp,
					story: entry.story,
				};

				let doc = parser.parseFromString(entry.code, "text/html");

				const tags = doc.querySelectorAll("meta");

				tags.forEach((el: any) => {
					const attr = el.getAttribute("property");

					if (DESIRED_PROPS.includes(attr))
						toAdd[el.getAttribute("property").substring(3)] =
							el.getAttribute("content");

					if (el.getAttribute("name") === "author")
						toAdd.author = el.getAttribute("content");
				});
				if (Object.keys(toAdd).length !== 2)
					out += JSON.stringify(toAdd) + "\n";
			});

		return out;
	}

	function fuck() {
		dispatcher("back");
	}
</script>

{#if !scanStarted}
	<button id="scan" on:click={beginScan}>Begin Scan</button>
	<button on:click={fuck}>Back</button>
{:else if !scanComplete}
	<div class="progress-wrapper">
		<div
			class="progress"
			style={`width: ${
				((SCAN_TOTAL - (SCAN_TOTAL - progress)) / SCAN_TOTAL) * 500
			}px`}
		>
			{((progress / SCAN_TOTAL) * 100).toFixed(2)}%
		</div>
	</div>
{:else}
	<p>Scan complete!</p>
{/if}

<style>
	.progress-wrapper {
		width: 500px;
		height: 50px;
		background: #555;
		margin-bottom: 10px;
	}

	.progress {
		height: 50px;
		line-height: 50px;
		animation: infinite 3s fancy;
		color: white;
		text-align: center;
	}

	@keyframes fancy {
		0% {
			background: #373;
		}

		50% {
			background: #595;
		}

		100% {
			background: #373;
		}
	}
</style>

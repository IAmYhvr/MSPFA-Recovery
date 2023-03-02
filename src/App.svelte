<script lang="ts">
	import BrowserCard from "./lib/BrowserCard.svelte";
	import CacheOnly from "./lib/CacheOnly.svelte";
	import Chrome from "./lib/Chrome.svelte";
	import Firefox from "./lib/Firefox.svelte";
	import Icon from '@iconify/svelte';
    import { getData, formatData } from './lib/store';

	// This is minified from https://mspfa.com/restore/myactivity.js using https://jscompress.com/.
	const BOOKMARKLET_URL = String.raw`javascript:{const a=()=>{const a=new URL(location.href);return"myactivity.google.com"===a.hostname&&/^(?:\/u\/\d+)?\/myactivity$/.test(location.pathname)&&"mspfa.com"===a.searchParams.get("q")&&"6"===a.searchParams.get("product")},b=()=>document.querySelector("[data-loadingmessage]"),c=()=>{const a=b();return!!a&&"true"===a.getAttribute("data-active")},d=()=>{const a=b();return a?a.parentNode.parentNode.getElementsByTagName("button")[0]:void 0},e=()=>document.querySelector("img[src^=\"https://www.gstatic.com/myactivity/scene/scene_fp_empty_state\"]");let f;const g=()=>document.querySelector("c-wiz[data-date]"),h=a=>{const b=a.getAttribute("data-date"),c=a.firstChild.firstChild.lastChild.firstChild.lastChild.textContent,d=c.slice(0,c.indexOf("\u2022")).trim();return new Date(b.slice(0,4)+"-"+b.slice(4,6)+"-"+b.slice(6)+" "+d)},i=a=>a.querySelector("a[href^=\"https://www.google.com/url\"]"),j=a=>{const b=a.querySelector("img[alt=\"\"]");return b?b.src:void 0},k=a=>{for(;a.previousSibling;)a.parentNode.removeChild(a.previousSibling);a.parentNode.removeChild(a)},l=+new Date("2022-06-26"),m=+new Date("2022-08-11"),n=+new Date("2023-02-04"),o=a=>{const c=document.getElementById("mspfa-status");c&&c.parentNode.removeChild(c);const f=document.createElement("div");f.id="mspfa-status",f.style.textAlign="center";const g=a.split("\n");for(let b=0;b<g.length;b++)f.appendChild(document.createTextNode(g[b])),b!=g.length-1&&f.appendChild(document.createElement("br"));const h=d();h&&(h.style.display="none");let i;const j=b();j&&(i=j.parentNode.parentNode.parentNode);const k=e();if(k&&(k.parentNode.parentNode.style.display="none",i=k.parentNode.parentNode.parentNode),!i)throw new Error("No status element found.");return i.appendChild(f),f},p=["/","/log/","/search/","/preview/","/readers/"],q=["/user/","/achievements/","/favs/"],r={},s={},t=a=>{const b=+h(a);if(b>n)return;if(b<l)return"done";const c=i(a);if(!c)return;const d=new URL(new URL(c.href).searchParams.get("q"));if("mspfa.com"!==d.hostname)return;const e=p.includes(d.pathname)?s:q.includes(d.pathname)?r:void 0;if(!e||e===s&&b<m)return;const f=d.searchParams.get(e===s?"s":"u");if(!f)return;if(e===s){const a=+f;if(!a||1>a||50052<a)return}else if(!/^\d{21}$/.test(f))return;const g=c.textContent,k=j(a);for(const[c,d]of Object.entries({name:g,image:k})){if(!d||"name"===c&&"mspfa.com | 521: Web server is down"===d||"image"===c&&"https://mspfa.com/images/wat.njs"===d)continue;e[f]||(e[f]={});const a=e[f];a[c]||(a[c]={}),a[c][d]||(a[c][d]=[]),a[c][d].includes(b)||a[c][d].push(b)}},u=()=>{const a=b();if(a&&(a.parentNode.parentNode.style.display="none"),f&&(f.style.display="none"),0===Object.values(s).length&&0===Object.values(r).length)return void o("There is no MSPFA activity under this Google account!\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.");const c=o("Ready to upload?\n\n"),d=document.createElement("button");d.type="button",d.textContent="Go!",d.style="border-radius:8px;border:1px solid transparent;padding:0.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:green;color:#eee;cursor:pointer",c.appendChild(d),c.appendChild(document.createElement("br")),c.appendChild(document.createElement("br")),d.addEventListener("click",()=>{o("Uploading... Please wait!"),fetch("https://mspfa.com/recover/gather",{method:"POST",body:JSON.stringify({stories:s,users:r})}).then(()=>{o("Done!\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.\n\nIf you're sure you have no other Google accounts with MSPFA activity, you may now safely close this tab and return to the recovery tool.\n\nThanks for helping us! :)")}).catch(()=>{o("An error occurred while uploading your MSPFA data. Please refresh the page and try activating the bookmark again.\n\nIf it still doesn't work, please report this issue to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord).")})}),c.appendChild(document.createTextNode("Here's the exact data that will be sent:")),c.appendChild(document.createElement("br"));let e="";for(const[a,b]of Object.entries(s))e+="Adventure #"+a+": "+JSON.stringify(b)+"\n";for(const[a,b]of Object.entries(r))e+="User #"+a+": "+JSON.stringify(b)+"\n";const g=document.createElement("textarea");g.readOnly=!0,g.style="width:100%;height:20em;resize:none;font-family:monospace;color-scheme:dark",g.value=e.slice(0,-1),c.appendChild(g)},v=()=>{try{if(!a())return void(confirm("Please activate this bookmark again after you're redirected to the Google activity page.")&&window.open("https://myactivity.google.com/myactivity?q=mspfa.com&product=6"));if(e())return void u();if(o("Please do not leave this tab.\n\n(If this stops loading for no apparent reason, refresh the page and activate the bookmark again.)"),c())return void requestAnimationFrame(v);for(;;){const a=g();if(!a)break;f=a.parentNode;const b=t(a);if(k(a),"done"===b)return void u()}d().click(),requestAnimationFrame(v)}catch(a){alert("An error occurred! Please try again.\n\nIf the error persists after trying again, report this to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord):\n\n"+a)}};(()=>{document.getElementById("mspfa-status")||requestAnimationFrame(v)})()}`;
	// const FUCKED_UP_DID_THEY_GET_ANYTHING_REGEX = /^[^\n]+\nCached Code\nCached Pages$/;

	type Browser = "chrome" | "chromium" | "firefox" | "cache" | "unknown";
	type Platform = "mobile" | "windows" | "mac" | "linux" | "unknown";

	let stage = -1
	let browser: Browser = "unknown";
	let platform: Platform = "unknown";
	let extra = "";
	let isMobile = false;
	let isOpera = false;
	let isLoggedIn = false;
	let didTheyGetAnything = false;
	let results: any = {};
	let formattedResults = "";

	function help() {
		stage = 0;
	}

	function faq() {
		stage = -1.5;
	}

	function home() {
		stage = -1;
	}

	function next() {
		stage++;
	}

	function back() {
		stage--;
	}

	function maybeMobileBack() {
		stage--;
		// Conditionally go back 2 stages if the user is on mobile
		// Because clicking "mobile" skips the browser selection.
		// If this line isn't here, and you go back from mobile, it'll
		// Send you to the computer browser selection. Yikes!
		if (isMobile) stage--;
	}

	function go(
		str: Browser,
		fuckOpera = false,
		bonusName = "Generic Histless"
	) {
		return () => {
			stage = 2;
			browser = str;
			isOpera = fuckOpera;
			extra = bonusName;
		};
	}

	function goplat(plat: Platform) {
		return () => {
			stage = 1;
			platform = plat;
			isMobile = plat === "mobile";
			if (isMobile) go("cache", false, "Mobile")()
		};
	}

	function resultsFound() {
		results = getData()
		formattedResults = formatData();
		didTheyGetAnything = true;
		// didTheyGetAnything = FUCKED_UP_DID_THEY_GET_ANYTHING_REGEX.test(detail);
		if (didTheyGetAnything) stage = 3;
		else stage = 4;
	}

	async function sendData() {
		if (didTheyGetAnything) {
			let res = await fetch("/recover/gather", {
				body: JSON.stringify(results),
				method: "POST",
			});
			let text = await res.text();
			if (text === "success") {
				if (isLoggedIn && browser === "chromium") {
					stage += 0.5;
				} else next();
			}
			else stage = -2;
		} else if (isLoggedIn && browser === "chromium") {
			stage += 0.5
		} else {
			next()
		}
	}

	function cancel(e: MouseEvent) {
		e.preventDefault();
	}
</script>

<main>
	<div>
		{#if stage === -1}
			<h1>MSPFA Recovery</h1>
			<p>MSPFA suffered from a minor data loss, and needs your help getting some of the data back.</p>
			<button class="big" on:click={faq}>What happened?</button>
			<button class="big CLICKME" on:click={help}>How can I help?</button>
		{:else if stage === -1.5}
			<h1>FAQ</h1>
			<div style="max-width: 700px">
				<h3>Are my adventures safe?</h3>
				<p>
					Yes.
				</p>
				<h3>Are you sure?</h3>
				<p>
					Yes, no page data was ever lost in the first place. In fact, all adventures' pages have been backed up in multiple different locations to be extra safe.
				</p>
				<h3>What happened, and how can I be sure it won't happen again?</h3>
				<ul>
					<li>Some recent metadata was lost (see next FAQ) due to backups not running properly during an unexpected database failure.</li>
					<li>The sysadmin whose responsibility it was to manage backups kept procrastinating fixing the backup system, despite being frequently notified of the issue as soon as it was discovered. Eventually, he stopped responding entirely. He's no longer on our team.</li>
					<li>The site's current owner will fix the backup system himself and personally ensure it's 100% working before putting the site online again.</li>
					<li>Even if you don't trust our backup system, we'll add a new option to download a copy of all your adventure's data once the site's back.</li>
				</ul>
				<h3>What data was lost?</h3>
				<ul>
					<li>NOT page data! All page data is 100% safe and sound. Same for comments.</li>
					<li>For a large percentage of adventures and users, we've already recovered more recent data from the below losses!</li>
					<li>Some adventure favorites, ownerships, titles, descriptions, icons, or tags created in the 6 months before the incident were lost (since August 11, 2022).</li>
					<li>Some usernames, profile icons, descriptions, and messages created in the 7 months before the incident were lost (since June 26, 2022).</li>
				</ul>
				<h3>Will I have to prove ownership of my adventure?</h3>
				<p>
					While some adventure ownerships might need to be proven manually, many can be proven and restored completely automatically. Sit tight for now since we dont want people to go through the likely unnecessary effort of proving anything until we've already done everything automatic that we can.
				</p>
				<h3>When will the site be back?</h3>
				<p>
					No clue, but rest assured we're working our asses off. It'll most likely be a number of weeks. Life can unfortunately be busy.
				</p>
				<button class="big CLICKME" on:click={help}>How can I help?</button>
				<button class="big" on:click={home}>Back</button>
			</div>
		{:else if stage === 0}
			<h1>MSPFA Recovery Tool</h1>
			<p style="max-width: 700px">
				You can help right here in this website without downloading anything!<br /><br />
				Your browser stores a surprising amount of data on the pages you visit.
				Using this data, we can retrieve some of what was lost.<br /><br />
				You can see the exact data that will be sent before sending it, and everything is sent anonymously. This tool is also open-source; there's a link in the bottom-right corner, so feel free to confirm this yourself!<br /><br />
				Which platform are you on?
				<button on:click={() => stage = 3.5}>skip to 3.5</button>
			</p>
			<BrowserCard
				browsers={["logos:microsoft-windows"]}
				name="Windows"
				on:select={goplat("windows")}
			/>
			<BrowserCard
				browsers={["MACOS"]}
				name="macOS"
				on:select={goplat("mac")}
			/>
			<BrowserCard
				browsers={["logos:linux-tux"]}
				name="Linux"
				on:select={goplat("linux")}
			/>
			<BrowserCard
				browsers={["material-symbols:phone-iphone"]}
				name="Mobile/Tablet"
				on:select={goplat("mobile")}
			/>
			<br />
			<br />
			<button on:click={home}>Back</button>
			<!-- <button class="big" on:click={goplat()}>Computer</button>
			<button class="big" on:click={goplat()}
				>Phone/Tablet</button
			> -->
		{:else if stage === 1}
			<h2>Browsers</h2>
			<p>Please select the browser you're recovering data from.</p>
			<grid id="browsers" class:mac={platform === "mac"}>
				<BrowserCard
					browsers={["logos:chrome"]}
					name="Chrome"
					on:select={go("chrome")}
				/>
				<BrowserCard
					browsers={["logos:firefox"]}
					name="Firefox"
					on:select={go("firefox")}
				/>
				{#if platform === "mac"}
					<BrowserCard
						browsers={["logos:safari"]}
						name="Safari"
						on:select={go("cache", false, "Safari")}
					/>
				{/if}
				<BrowserCard
					browsers={platform === "linux" ? ["logos:opera"] : ["logos:opera", "GX"]}
					name="Opera"
					on:select={go("chromium", true)}
				/>
				<BrowserCard
					browsers={[
						"logos:microsoft-edge",
						"logos:brave",
						"CHROMIUM",
						"mdi:dots-horizontal",
					]}
					name="Other"
					on:select={go("chromium")}
				/>
			</grid>
			<button on:click={back}>Back</button>
		{:else if stage === 2}
			{#if browser === "firefox"}
				<Firefox on:data={resultsFound} on:fuck={back} {platform} />
			{:else if browser === "chromium"}
				<Chrome
					on:data={resultsFound}
					on:fuck={back}
					{isOpera}
					{platform}
					{isLoggedIn}
				/>
			{:else if browser === "chrome"}
				<p>
					Are you logged into Google in your browser?
					<br /><br />
					<button
						on:click={() => {
							isLoggedIn = true;
							go("chromium")();
						}}>Yes</button
					>
					<button
						on:click={() => {
							isLoggedIn = false;
							go("chromium")();
						}}>No
					</button>
					<button on:click={back}>Back</button>
				</p>
			{:else if browser === "cache"}
				<CacheOnly on:data={resultsFound} on:fuck={maybeMobileBack} name={extra} {platform} />
			{/if}
		{:else if stage === 3}
			{#if browser === "chromium" && isLoggedIn}
				<h2>Uploading Cache Data</h2>
			{:else}
				<h2>Almost done...</h2>
			{/if}

			{#if didTheyGetAnything}
				<p>
					Here's <i>exactly</i> what you're sending, in case you want to check
					for yourself.
				</p>
				<button on:click={sendData} class="CLICKME">Send data</button>
				<!-- <button
					on:click={() => {
						stage = 0;
					}}>Back to start</button
				> -->
				<pre>{ formattedResults }</pre>
			{:else}
				We unfortunately weren't able to get any data from that.
				<button on:click={sendData}>Proceed</button>
			{/if}
		{:else if stage === 3.5}
			<div style="max-width: 500px">
				Finally, here's a bookmark that takes you to your Google activity page and allows you to recover any lost MSPFA data your Google account might have saved.<br />
				<br />
				To use it, drag and drop the below button into your bookmarks bar, then click it and follow what it says.<br />
				<br />
				<div class="center">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href={BOOKMARKLET_URL} id="bookmarklet" on:click={cancel}>MSPFA Activity Recovery</a>
				</div>
				<br />
				If you can't see your bookmarks bar, you can enable it by pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Windows or <kbd><Icon icon="material-symbols:keyboard-command-key" height={16} inline/>Command</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Mac.
				<br />
				<br />
				<!-- Why? -->
				<button on:click={() => stage += 0.5}>I'm done using the bookmark. Proceed!</button>
			</div>
		{:else if stage === 4}
			{#if didTheyGetAnything}
				<h2>Thank you!</h2>
				<p>
					Thank you so much for helping.<br />
					If you've used MSPFA on other devices or browsers, you can use this tool there as well!<br />
					You may now close this tab.
				</p>
			{:else}
				<h2>No data found!</h2>
				<p>
					Thank you so much for helping.<br />
					We didn't find any useful data from your browser's cache{#if !(browser === "cache" || (browser === "chromium" && isLoggedIn))} or history file{/if}, but if you've used MSPFA on other devices or browsers, you can use this tool there as well!<br />
					You may now close this tab.
				</p>
			{/if}
		{:else if stage === -2}
			<h2>Whoops.</h2>
			<p>
				Something went wrong with sending the data.<br />
				Please report this to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord).
			</p>
		{/if}
	</div>
</main>
<div id="footer">
	<a href="https://mspfa.com" target="_blank" rel="noreferrer">MSPFA</a>
	|
	<a href="https://mspfa.com/discord" target="_blank" rel="noreferrer">Discord</a>
	|
	<a href="https://github.com/YhvrWasTaken/MSPFA-Recovery" target="_blank" rel="noreferrer">Source Code</a>
</div>

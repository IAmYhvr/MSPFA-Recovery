<script lang="ts">
	import BrowserCard from "./lib/BrowserCard.svelte";
	import CacheOnly from "./lib/CacheOnly.svelte";
	import Chrome from "./lib/Chrome.svelte";
	import Firefox from "./lib/Firefox.svelte";
	import Icon from '@iconify/svelte';

	// This is minified from https://mspfa.com/restore/myactivity.js using https://jscompress.com/.
	const BOOKMARKLET_URL = String.raw`javascript:{const onCorrectLocation=()=>{const a=new URL(location.href);return"myactivity.google.com"===a.hostname&&/^(?:\/u\/\d+)?\/myactivity$/.test(location.pathname)&&"mspfa.com"===a.searchParams.get("q")&&"6"===a.searchParams.get("product")},getLoadingMessage=()=>document.querySelector("[data-loadingmessage]"),getLoading=()=>{const a=getLoadingMessage();return!!a&&"true"===a.getAttribute("data-active")},getLoadingButton=()=>{const a=getLoadingMessage();return a?a.parentNode.parentNode.getElementsByTagName("button")[0]:void 0},getEmptyImage=()=>document.querySelector("img[src^=\"https://www.gstatic.com/myactivity/scene/scene_fp_empty_state\"]");let entryParent;const getTopEntry=()=>document.querySelector("c-wiz[data-date]"),getEntryDate=a=>{const b=a.getAttribute("data-date"),c=a.firstChild.firstChild.lastChild.firstChild.lastChild.textContent,d=c.slice(0,c.indexOf("\u2022")).trim();return new Date(b.slice(0,4)+"-"+b.slice(4,6)+"-"+b.slice(6)+" "+d)},getEntryLink=a=>a.querySelector("a[href^=\"https://www.google.com/url\"]"),getEntryImageURL=a=>{const b=a.querySelector("img[alt=\"\"]");return b?b.src:void 0},removeEntryAndPreviousSiblings=a=>{for(;a.previousSibling;)a.parentNode.removeChild(a.previousSibling);a.parentNode.removeChild(a)},minDateNumber=+new Date("2022-06-26"),maxDateNumber=+new Date("2023-02-04"),setStatus=a=>{const b=document.getElementById("mspfa-status");b&&b.parentNode.removeChild(b);const c=document.createElement("div");c.id="mspfa-status",c.style.textAlign="center";const d=a.split("\n");for(let b=0;b<d.length;b++)c.appendChild(document.createTextNode(d[b])),b!=d.length-1&&c.appendChild(document.createElement("br"));const e=getLoadingButton();e&&(e.style.display="none");let f;const g=getLoadingMessage();g&&(f=g.parentNode.parentNode.parentNode);const h=getEmptyImage();if(h&&(h.parentNode.parentNode.style.display="none",f=h.parentNode.parentNode.parentNode),!f)throw new Error("No status parent found.");return f.appendChild(c),c},STORY_PATHNAMES=["/","/log/","/search/","/preview/","/readers/"],USER_PATHNAMES=["/user/","/achievements/","/favs/"],u={},s={},addEntryData=a=>{const b=+getEntryDate(a);if(b>maxDateNumber)return;if(b<minDateNumber)return"done";const c=getEntryLink(a);if(!c)return;const d=new URL(new URL(c.href).searchParams.get("q"));if("mspfa.com"!==d.hostname)return;const e=STORY_PATHNAMES.includes(d.pathname)?s:USER_PATHNAMES.includes(d.pathname)?u:void 0;if(!e)return;const f=d.searchParams.get(e===s?"s":"u");if(!f||e===s&&(!+f||47482>+f)||e===u&&21!==f.length)return;const g=c.textContent,h=getEntryImageURL(a);e[f]||(e[f]={names:{},icons:{}});const i=e[f];i.names[g]||(i.names[g]=[]),i.names[g].includes(b)||i.names[g].push(b),h&&(!i.icons[h]&&(i.icons[h]=[]),!i.icons[h].includes(b)&&i.icons[h].push(b))},finish=()=>{const a=getLoadingMessage();if(a&&(a.parentNode.parentNode.style.display="none"),entryParent&&(entryParent.style.display="none"),0===Object.values(s).length&&0===Object.values(u).length)return void setStatus("There is no MSPFA activity under this Google account!\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.");const b={s,u},c=JSON.stringify(b),d=setStatus("Ready to upload?\n\n"),e=document.createElement("button");e.type="button",e.textContent="Go!",e.style="border-radius:8px;border:1px solid transparent;padding:0.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:green;color:#eee;cursor:pointer",d.appendChild(e),d.appendChild(document.createElement("br")),d.appendChild(document.createElement("br")),e.addEventListener("click",()=>{setStatus("Uploading... Please wait!"),fetch("https://mspfa.com/recover/gather",{method:"POST",body:c}).then(()=>{setStatus("Done!\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.\n\nIf you're sure you have no other Google accounts with MSPFA activity, you may now safely close this tab.\n\nThanks for helping us! :)")}).catch(()=>{setStatus("An error occurred while uploading your MSPFA data. Please refresh the page and try activating the bookmark again.\n\nIf it still doesn't work, please report this issue to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord).")})}),d.appendChild(document.createTextNode("Here's the exact data that will be sent:")),d.appendChild(document.createElement("br"));const f=document.createElement("textarea");f.readOnly=!0,f.style="width:100%;height:20em;resize:none;font-family:monospace;color-scheme:dark",f.value=JSON.stringify(b,null,"  "),d.appendChild(f)},frame=()=>{try{if(!onCorrectLocation())return void(confirm("Please activate this bookmark again after you're redirected to the Google activity page.")&&window.open("https://myactivity.google.com/myactivity?q=mspfa.com&product=6"));if(getEmptyImage())return void finish();if(setStatus("Please do not close this tab.\n\n(If this stops loading for no apparent reason, refresh the page and activate the bookmark again.)"),getLoading())return void requestAnimationFrame(frame);for(;;){const a=getTopEntry();if(!a)break;entryParent=a.parentNode;const b=addEntryData(a);if(removeEntryAndPreviousSiblings(a),"done"===b)return void finish()}getLoadingButton().click(),requestAnimationFrame(frame)}catch(a){alert("An error occurred! Please report this to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord):\n\n"+a)}},run=()=>{document.getElementById("mspfa-status")||requestAnimationFrame(frame)};run();}`;

	type Browser = "chrome" | "chromium" | "firefox" | "cache" | "unknown";
	type Platform = "mobile" | "windows" | "mac" | "linux" | "unknown";

	let stage = 0;
	let browser: Browser = "unknown";
	let platform: Platform = "unknown";
	let extra = "";
	let isMobile = false;
	let isOpera = false;
	let isLoggedIn = false;
	let results = "";

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

	function resultsFound({ detail }) {
		results = detail;
		stage = 3;
	}

	async function sendData() {
		let res = await fetch("/recover/gather", {
			body: results,
			method: "POST",
		});
		let text = await res.text();
		if (text === "success") {
			if (isLoggedIn && browser === "chromium") {
				stage += 0.5;
			} else next();
		}
		else stage = -1;
		// TODO api endpoint?
		// post(results);
	}

	function cancel(e: MouseEvent) {
		e.preventDefault();
	}
</script>

<main>
	<div>
		{#if stage === 0}
			<h1>MSPFA Recovery Tool</h1>
			<p>
				This tool retrieves lost data from your browser that we can use
				to help recover MSPFA.<br />
				It's sent anonymously, and you can see exactly what data will be
				sent before you send it.<br /><br />
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
			<!-- <button class="big" on:click={goplat()}>Computer</button>
			<button class="big" on:click={goplat()}
				>Phone/Tablet</button
			> -->
		{:else if stage === 1}
			<h2>Browsers</h2>
			<p>Please select the browser that you're recovering data from.</p>
			<grid id="browsers">
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
				<BrowserCard
					browsers={["logos:safari"]}
					name="Safari"
					on:select={go("cache", false, "Safari")}
				/>
				<BrowserCard
					browsers={["logos:opera"]}
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
				<Firefox on:data={resultsFound} on:fuck={back} />
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
				<CacheOnly on:data={resultsFound} on:fuck={maybeMobileBack} name={extra} />
			{/if}
		{:else if stage === 3}
			{#if browser === "chromium" && isLoggedIn}
				<h2>Uploading Cache Data</h2>
			{:else}
				<h2>Almost done...</h2>
			{/if}
			<p>
				Here's <i>exactly</i> what you're sending, in case you want to check
				for yourself.
			</p>
			<button on:click={sendData} class="CLICKME">Send data</button
			><button
				on:click={() => {
					stage = 0;
				}}>Back to start</button
			>

			<pre>{results}</pre>
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
			</div>
		{:else if stage === 4}
			<h2>Thank you!</h2>
			<p>
				Thank you so much for helping. Your submitted data has been
				stored and will be analyzed at a later time.<br />
				If you've used MSPFA on any other browsers, feel free to come back
				and use this tool on them.<br />
				It's now safe to close this tab.
			</p>
		{:else if stage === -1}
			<h2>Whoops.</h2>
			<p>
				Something went wrong with sending the data.<br />Please report
				this on the Discord.
			</p>
		{/if}
	</div>
</main>
<div id="footer">
	<a href="https://mspfa.com" target="_blank" rel="noreferrer"
		>mspfa</a
	>
	|
	<a href="https://mspfa.com/discord" target="_blank" rel="noreferrer"
		>discord</a
	>
	|
	<a
		href="https://github.com/YhvrWasTaken/MSPFA-Recovery"
		target="_blank"
		rel="noreferrer">source code</a
	>
</div>

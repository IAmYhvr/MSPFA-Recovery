import HistoryScanner from 'components/pages/HistoryScanner';
import useFunction from 'lib/useFunction';
import useLinkTo from 'lib/useLinkTo';
import { MouseEvent } from 'react';
import { Icon } from '@iconify/react';
import useLeaveConfirmation from 'lib/useLeaveConfirmation';

// This is minified from https://mspfa.com/recover/myactivity.js using https://jscompress.com/.
const BOOKMARKLET_CODE = String.raw`{const a=()=>{const a=new URL(location.href);return"myactivity.google.com"===a.hostname&&/^(?:\/u\/\d+)?\/myactivity$/.test(location.pathname)&&"mspfa.com"===a.searchParams.get("q")&&"6"===a.searchParams.get("product")},b=()=>document.querySelector("[data-loadingmessage]"),c=()=>{const a=b();return!!a&&"true"===a.getAttribute("data-active")},d=()=>{const a=b();return a?a.parentNode.parentNode.getElementsByTagName("button")[0]:void 0},e=()=>document.querySelector("img[src^=\"https://www.gstatic.com/myactivity/scene/scene_fp_empty_state\"]");let f;const g=()=>document.querySelector("c-wiz[data-date]"),h=a=>{const b=a.getAttribute("data-date"),c=a.firstChild.firstChild.lastChild.firstChild.lastChild.textContent,d=b.slice(0,4)+"-"+b.slice(4,6)+"-"+b.slice(6),e=c.slice(0,c.indexOf("\u2022")).trim().replace(/\./g,":");let f=+new Date(d+" "+e);return f||(f=+new Date(d)),f},i=a=>a.querySelector("a[href^=\"https://www.google.com/url\"]"),j=a=>{const b=a.querySelector("img[alt=\"\"]");return b?b.src:void 0},k=a=>{for(;a.previousSibling;)a.parentNode.removeChild(a.previousSibling);a.parentNode.removeChild(a)},l=+new Date("2022-06-26T00:00:00Z"),m=+new Date("2022-08-11T00:00:00Z"),n=+new Date("2023-02-04T00:00:00Z"),o=a=>{const c=document.getElementById("mspfa-status");c&&c.parentNode.removeChild(c);const f=document.createElement("div");f.id="mspfa-status",f.style.textAlign="center";const g=a.split("\n");for(let b=0;b<g.length;b++)f.appendChild(document.createTextNode(g[b])),b!=g.length-1&&f.appendChild(document.createElement("br"));const h=d();h&&(h.style.display="none");let i;const j=b();j&&(i=j.parentNode.parentNode.parentNode);const k=e();if(k&&(k.parentNode.parentNode.style.display="none",i=k.parentNode.parentNode.parentNode),!i)throw new Error("No status element found.");return i.appendChild(f),f},p=["/","/log/","/search/","/preview/","/readers/"],q=["/user/","/achievements/","/favs/"],r={},s={},t=a=>{const b=h(a);if(b>n)return;if(b<l)return"done";const c=i(a);if(!c)return;const d=new URL(new URL(c.href).searchParams.get("q"));if("mspfa.com"!==d.hostname)return;const e=p.includes(d.pathname)?s:q.includes(d.pathname)?r:void 0;if(!e||e===s&&b<m)return;const f=d.searchParams.get(e===s?"s":"u");if(!f)return;if(e===s){const a=+f;if(!a||1>a||50052<a)return}else if(!/^\d{21}$/.test(f))return;const g=c.textContent,k=j(a);for(const[c,d]of Object.entries({name:g,image:k})){if(!d||"name"===c&&"mspfa.com | 521: Web server is down"===d||"image"===c&&"https://mspfa.com/images/wat.njs"===d)continue;e[f]||(e[f]={});const a=e[f];a[c]||(a[c]={}),a[c][d]||(a[c][d]=[]),a[c][d].includes(b)||a[c][d].push(b)}},u="\n\nIf you have any other Google accounts that might have MSPFA activity, click your profile icon in the top-right and select another account. After switching accounts, activate the bookmark again.\n\nIf you're sure you have no other Google accounts with MSPFA activity, you may now safely close this tab and return to the recovery page. Thanks for helping us! :)",v=()=>{const a=b();if(a&&(a.parentNode.parentNode.style.display="none"),f&&(f.style.display="none"),0===Object.values(s).length&&0===Object.values(r).length)return void o("There is no MSPFA activity under this Google account!"+u);const c=o("Ready to upload?\n\n"),d=document.createElement("button");d.type="button",d.textContent="Go!",d.style="border-radius:8px;border:1px solid transparent;padding:0.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:green;color:#eee;cursor:pointer",c.appendChild(d),c.appendChild(document.createElement("br")),c.appendChild(document.createElement("br")),d.addEventListener("click",()=>{o("Uploading... Please wait!"),fetch("https://mspfa.com/recover/api/data",{method:"POST",body:JSON.stringify({stories:s,users:r}),headers:{"Content-Type":"application/json"}}).then(a=>{if(!a.ok)throw new Error;o("Done!"+u)}).catch(()=>{o("An error occurred while uploading your MSPFA data. Please refresh the page and try activating the bookmark again.\n\nIf it still doesn't work, please report this issue to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord).")})}),c.appendChild(document.createTextNode("Here's the exact data that will be sent:")),c.appendChild(document.createElement("br"));let e="";for(const[a,b]of Object.entries(s))e+="Adventure #"+a+": "+JSON.stringify(b)+"\n";for(const[a,b]of Object.entries(r))e+="User #"+a+": "+JSON.stringify(b)+"\n";const g=document.createElement("textarea");g.readOnly=!0,g.style="width:100%;height:20em;resize:none;font-family:monospace;color-scheme:dark",g.value=e.slice(0,-1),c.appendChild(g)},w=()=>{try{if(!a())return alert("Please activate this bookmark again after you are redirected to the Google activity page.\n\nIf your browser blocks the pop-up, please set it to be allowed and try again."),void window.open("https://myactivity.google.com/myactivity?q=mspfa.com&product=6");if(e())return void v();if(o("This tab must be visible, or the loading will pause. Please be patient.\n\n(If this stops loading for no apparent reason, refresh the page and activate the bookmark again.)"),c())return void requestAnimationFrame(w);for(;;){const a=g();if(!a)break;f=a.parentNode;const b=t(a);if(k(a),"done"===b)return void v()}d().click(),requestAnimationFrame(w)}catch(a){alert("An error occurred! Please try again.\n\nIf the error persists after trying again, report this to Grant#2604 on Discord (or contact support@mspfa.com if you can't use Discord):\n\n"+a)}};(()=>{document.getElementById("mspfa-status")||requestAnimationFrame(w)})()}`;

export default function GoogleActivityScanner() {
	useLeaveConfirmation();

	const preventDefault = useFunction((event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
	});

	return (
		<main>
			<h1>Chrome (Step 2 of 3)</h1>
			<p>
				Here's a bookmark that takes you to your Google activity page and allows you to recover any lost MSPFA data your Google account might have saved.
			</p>
			<p>
				To use it, drag and drop the below button into your bookmarks bar, then click it and follow what it says.
			</p>
			<div style={{ textAlign: 'center' }}>
				<a
					className="bookmarklet"
					href={`javascript:${BOOKMARKLET_CODE}`}
					onClick={preventDefault}
					onContextMenu={preventDefault}
				>
					<span>Click Me</span>
				</a>
			</div>
			<p>
				If you can't see your bookmarks bar, you can enable it by pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Windows or <kbd><Icon icon="material-symbols:keyboard-command-key" height={16} inline />Command</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Mac.
			</p>
			<p>
				<button onClick={useLinkTo(HistoryScanner)}>
					I finished scanning my activity using the bookmark, and the bookmark told me to return here. Proceed!
				</button>
			</p>
		</main>
	)
}

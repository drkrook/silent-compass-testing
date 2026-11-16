# GridDown Atlas v1.4 — Google Chrome setup

## Why Chrome did not open the downloaded app properly
Opening `index.html` from a ZIP, Android Downloads, or a `content://` address is **not** a supported installation method for an offline Progressive Web App. Chrome needs the app served over HTTPS (or localhost on the same device). This is a browser security requirement.

## Windows / macOS / Linux Chrome
1. Extract the ZIP. Open a terminal in the `griddown_atlas` folder.
2. Run `python -m http.server 8000` (Python 3 required).
3. In Chrome on **that computer**, open `http://localhost:8000/`.
4. Use Chrome's Install app action in the address bar or menu if offered.
5. While connected, download maps, roads and resource layers. Test in airplane mode.

## Android Chrome
1. Upload the **contents** of the `griddown_atlas` folder to a trusted HTTPS static host, such as GitHub Pages or Netlify. Use a private or access-controlled deployment if sensitive locations are involved. A normal public static host makes the app code public; saved private locations remain in the browser unless you export them.
2. Visit the HTTPS URL in Chrome on Android, **not** `content://` and not a local file.
3. Open Chrome menu (three dots) and choose **Install app** or **Add to Home screen** if offered. Availability varies by device and Chrome version.
4. Download your intended offline map region and resources, then verify operation with airplane mode enabled.

## Important
- `http://localhost:8000` on a computer is **not** the same as localhost on your phone. To install on a phone, use HTTPS hosting.
- Offline maps and resource databases are device/browser-specific; transfer via app exports when supported.
- GPS, map tiles and downloads depend on permissions, connection and prior data downloads. No new live resource information is available offline.
- A Chrome installation does not by itself guarantee offline routing or emergency reliability. Keep paper backups.
- Do not clear Chrome site data or uninstall without exporting important private waypoints.

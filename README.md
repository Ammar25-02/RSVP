# Wedding RSVP with QR codes (free hosting)

A static wedding invitation and RSVP site. It runs free on **GitHub Pages**, and replies go into a free **Google Sheet**.

```
index.html                 Invitation and RSVP form (guests scan the QR and land here)
qr.html                    Host tool: makes a QR code for each guest, then print or download PNGs
config.js                  Your names, date, venue, and Google Script URL
styles.css                 Styling
google-apps-script/Code.gs Backend that saves replies to Google Sheets
```

## How it works

1. Each guest gets a QR code that links to the invitation, for example
   `https://you.github.io/wedding-rsvp/?to=Siti%20Nur&seats=2`
2. When they scan it, they see "Dear Siti Nur," with their name already filled in. They can pick at most 2 guests.
3. They submit the form. A new row appears in your Google Sheet.

---

## Step 1: Edit your details

Open `config.js` and change the names, date, venue, map link, and RSVP deadline.

## Step 2: Connect a Google Sheet to collect replies (free)

1. Go to <https://sheets.new> to create a blank Google Sheet. Name it something like "Wedding RSVP".
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste in everything from `google-apps-script/Code.gs`, and click **Save**.
4. Click **Deploy → New deployment**, open the gear icon, and choose **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and allow the permissions Google asks for. If you see "Google hasn't verified this app", click **Advanced → Go to project**. This is safe because the script is your own.
6. Copy the **Web app URL** (it ends in `/exec`) and paste it into `config.js`:
   ```js
   scriptUrl: "https://script.google.com/macros/s/AKfy..../exec"
   ```

To check it, open the `/exec` URL in a browser. It should show `{"ok":true,"message":"RSVP endpoint is live"}`.

> If you change `Code.gs` later, go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. If you skip this, the old code keeps running.

Until `scriptUrl` is set, the site runs in **demo mode**: replies are saved only in that visitor's browser.

## Step 3: Publish on GitHub Pages (free)

1. Create a new **public** repository on GitHub, for example `wedding-rsvp`.
2. Upload all the files: **Add file → Upload files**, then drag in the whole folder. Or use git:
   ```powershell
   git init
   git add .
   git commit -m "Wedding RSVP site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/wedding-rsvp.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**, and click **Save**.
4. After about a minute, your site is live at `https://YOUR-USERNAME.github.io/wedding-rsvp/`.

## Step 4: Make the QR codes

1. Open `https://YOUR-USERNAME.github.io/wedding-rsvp/qr.html`. The invitation URL is filled in for you.
2. Paste your guest list with one guest per line, in the form `Name, seats`:
   ```
   Uncle Rahman & Family, 4
   Siti Nur, 2
   ```
   Leave the list empty if you want **one general QR code** for a poster or for all printed cards.
3. Choose what you need:
   - **Print / Save as PDF**: prints cards in a 3-column grid, ready to cut out.
   - **Download PNG**: saves one QR code image, for example to put on your own invitation design.
   - **Download links (CSV)**: saves the personal links, so you can send them on WhatsApp instead.

## Tips

- **Custom domain:** in **Settings → Pages → Custom domain** you can use your own domain, such as `aisyah-adam.com`.
- **Head count:** in the Sheet, `=SUMIF(C:C,"Yes",D:D)` gives the total number of guests attending.
- **Duplicates:** if a guest submits twice, both rows are kept. Use the latest timestamp.
- **Email on each reply (optional):** in `Code.gs`, add `MailApp.sendEmail("you@example.com", "New RSVP: " + name, attending + " (" + guests + ")");` right before `return json({ ok: true });`, then deploy a new version.
- **Privacy:** anyone with the link can open `qr.html`, but it only builds links. Replies stay in your Google Sheet, which only you can see.

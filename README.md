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

1. All guests get the same QR code, which links to the invitation.
2. They scan it, read the invitation, and fill in the RSVP form. Each reply covers at most 2 people: the guest, plus their spouse.
3. They submit the form. A new row appears in your Google Sheet.

The floral frame around the names is `assets/floral-frame.png`. To change the design, replace that file.

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

## Step 4: Make the QR code

1. Open `https://YOUR-USERNAME.github.io/wedding-rsvp/qr.html`. The invitation URL is filled in for you.
2. Choose what you need:
   - **Download PNG**: saves the QR code image, to put on your printed invitation card.
   - **Print / Save as PDF**: prints copies in a 3-column grid, 9 per A4 page, ready to cut out.

## Tips

- **Custom domain:** in **Settings → Pages → Custom domain** you can use your own domain, such as `aisyah-adam.com`.
- **Head count:** in the Sheet, `=SUMIF(C:C,"Yes",D:D)` gives the total number of guests attending.
- **Duplicates:** if a guest submits twice, both rows are kept. Use the latest timestamp.
- **Email on each reply (optional):** in `Code.gs`, add `MailApp.sendEmail("you@example.com", "New RSVP: " + name, attending + " (" + guests + ")");` right before `return json({ ok: true });`, then deploy a new version.
- **Privacy:** anyone with the link can open `qr.html`, but it only builds links. Replies stay in your Google Sheet, which only you can see.

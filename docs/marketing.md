# Marketing guide — duhamedia.com

**How to use this doc:** check the Quick reference table first for everyday tasks; for anything else, find the page in the table of contents and read what you can change there and exactly where to click.

This guide is written for someone who is not a developer. Everything you can edit lives in the **admin** — the website's back office at `duhamedia.com/admin`. A few words you will see:

- **Block** — one section of a page (for example a hero banner, a testimonial row or a sign-up form). Pages are built by stacking blocks; you can edit what each block says and shows.
- **Draft / Publish** — changes are saved as a draft first. Visitors only see a change after it is **published**. Publishing is always done by a person, never automatically.
- **Slug** — the last part of a page's web address (in `duhamedia.com/about`, the slug is `about`).

Sections are added here as each part of the site is finished and approved.

## Quick reference

| I want to… | How |
|---|---|
| Edit scarcity numbers | **Admin → Globals → Capacity & scarcity** → change the four counts and/or the **Statements** → **Save**. Live straight away (no Publish). See [Capacity & scarcity](#capacity--scarcity). |
| Add a redirect | [fill in once built] |
| Edit page copy or images | [fill in once built] |
| Find form submissions and failed deliveries | **Admin → Form submissions** → apply the **Failed deliveries** saved filter (the shared saved view at the top of the list). See [Forms and form submissions](#forms-and-form-submissions). Public forms and the re-send button are not live yet. |
| Change the booking link | **Admin → Globals → Site settings → Booking tab → Booking page address** → paste the full `https://` address → **Save**. Live straight away. See [Site settings](#site-settings). |
| Send a newsletter broadcast (Resend dashboard steps) | [fill in once built] |
| Change the social-share (OG) image | **Admin → Globals → SEO defaults → Default social share image** → choose or upload an image (at least 1200 × 630 pixels) → **Save**. Live straight away. This is the fallback for every page; individual pages will be able to override it once the SEO tab is added to Pages (a later release). See [SEO defaults](#seo-defaults). |
| Upload an image | **Admin → Collections → Media → Create New** → choose the file → write the **Alt** text (required) → **Save**. See [Media library](#media-library-images). |
| Upload a lead-magnet file (PDF, CSV, Excel, ZIP) | **Admin → Collections → Downloads → Create New** → choose the file → give it a **Title** → **Save**. See [Downloads](#downloads-lead-magnet-files). |
| Add a client logo to the logo strip | **Admin → Collections → Clients → Create New** (or open the client) → **Name**, **Logo** → tick **Show In Logo Strip** → set **Sort Order** → **Publish**. See [Clients](#clients-logo-strips). |
| Add a testimonial or Google review | **Admin → Collections → Testimonials → Create New** → **Quote**, **Author Name** → pick **Source** (Google needs its link and the "word for word" tick) → **Publish**. See [Testimonials and reviews](#testimonials-and-reviews). |
| Add an FAQ | **Admin → Collections → FAQs → Create New** → **Question**, **Answer**, **Category** → set **Sort Order** → **Publish**. See [FAQs](#faqs). |
| Publish a case study | **Admin → Collections → Case studies → (study)** → tick **Client approved the figures** (right-hand sidebar) → **Publish changes**. Only once the client has signed off every number. See [Case studies](#case-studies-the-collection). |
| Create a lead magnet (free download page) | Upload the file first: **Admin → Collections → Downloads → Create New**. Then **Admin → Collections → Lead magnets → Create New** → fill the **Capture**, **What's inside**, **Asset & email** and **Delivered state** tabs → **Publish changes**. See [Lead magnets](#lead-magnets-the-collection). |
| Review and publish a pipeline draft (article) | **Admin → Collections → Posts** → filter **Status: Draft** → open the draft → check the copy, set **Author** and **Hero image** → **Publish changes**. See [Posts](#posts-articles-and-newsletter-issues). |
| Create a page, or change its header/footer | **Admin → Collections → Pages → Create New** (or open the page) → set **Header** and **Footer** in the right-hand sidebar → **Publish changes**. See [Pages](#pages-site-pages). |
| Someone is locked out after wrong passwords | Wait 10 minutes, or ask an Admin to open **Admin → Collections → Users → (person) → Force Unlock**. See [Users and roles](#users-and-roles). |

## Table of contents

- [Admin basics (site-wide)](#admin-basics-site-wide)
  - [Users and roles](#users-and-roles)
  - [Media library (images)](#media-library-images)
  - [Downloads (lead-magnet files)](#downloads-lead-magnet-files)
- [Content libraries (site-wide)](#content-libraries-site-wide)
  - [Clients (logo strips)](#clients-logo-strips)
  - [Team members](#team-members)
  - [Testimonials and reviews](#testimonials-and-reviews)
  - [FAQs](#faqs)
  - [Pages (site pages)](#pages-site-pages)
- [Forms & leads (site-wide)](#forms--leads-site-wide)
  - [Forms and form submissions](#forms-and-form-submissions)
1. [Homepage](#1-homepage)
2. [Case Study template](#2-case-study-template)
   - [Case studies (the collection)](#case-studies-the-collection)
3. [Work hub](#3-work-hub)
4. [Services Hub](#4-services-hub)
5. [Shopify Theme Development](#5-shopify-theme-development)
6. [Marketing](#6-marketing)
7. [Testimonials](#7-testimonials)
8. [About](#8-about)
9. [Book a Call](#9-book-a-call)
10. [Thank You](#10-thank-you)
11. [FAQ](#11-faq)
12. [Contact](#12-contact)
13. [DEV-SEO template](#13-dev-seo-template)
    - [Posts (articles and newsletter issues)](#posts-articles-and-newsletter-issues)
14. [MKT-SEO template](#14-mkt-seo-template)
15. [Campaign LP template](#15-campaign-lp-template)
16. [Newsletter](#16-newsletter)
17. [Link-in-Bio](#17-link-in-bio)
18. [Lead Magnet template](#18-lead-magnet-template)
    - [Lead magnets (the collection)](#lead-magnets-the-collection)
19. [Review Hub](#19-review-hub)
20. [Legal template](#20-legal-template)
21. [404](#21-404)
- [Site-wide settings (header, footers, contact details)](#site-wide-settings)
  - [Site settings](#site-settings)
  - [Capacity & scarcity](#capacity--scarcity)
  - [Navigation (header menu and footers)](#navigation-header-menu-and-footers)
  - [SEO defaults](#seo-defaults)

Each entry below covers: **SEO** (what is set, and where to change it) · **Editable by marketing** (what you can change, including adding, removing and reordering items) · **Forms & leads** (where submissions go, what gets announced, what "failed" means and how to re-send) · **Social share** · **Other**.

---

## Admin basics (site-wide)

These parts of the admin are not tied to one page. They are the accounts people log in with, and the libraries of images and files the pages use. A **collection** is one list of things in the admin (for example all users, or all images). Collections are listed in the left-hand menu under **Collections**.

### Users and roles

**SEO:** n/a.

**Editable by marketing**
- Every account has a **role**, which decides what that person (or program) can do:
  - **Admin**: can do everything, including creating users and changing roles.
  - **Marketing**: edits website content. Can only see and edit **their own** account (name, email, password). Cannot see other users, cannot create or delete users, and cannot change anyone's role, including their own.
  - **Pipeline (API key only)**: not a person. It is the automated article writer (the "content pipeline"). It cannot log in to the admin at all. It connects with an **API key** (a long secret code that acts as its password) and can only create **drafts** of articles. It can never publish. A person always reviews and publishes.
- **Edit your own account:** **Admin → Collections → Users → (your account)**, change your name, email or password, then **Save**.
- **Only an Admin can create, remove or change users.** If you need a new colleague added, or someone's role changed, ask an Admin.

**Forms & leads:** n/a.

**Social share:** n/a.

**Other**
- **Lockout:** after **5 wrong passwords in a row**, the account is locked for **10 minutes**. Either wait 10 minutes and try again, or ask an Admin to open **Admin → Collections → Users → (the locked person) → Force Unlock**.
- **For Admins: giving the pipeline its key.**
  1. **Admin → Collections → Users → Create New**.
  2. Fill in an email and password (the password is never used, because a Pipeline user cannot log in), and set **Role** (in the right-hand sidebar) to **Pipeline (API key only)**.
  3. **Save first.** The API key option does not appear until the user has been saved as Pipeline.
  4. Back in that user's page, tick **Enable API Key**, click **Generate new API key**, then **Save**.
  5. Copy the key straight away and hand it over securely. Treat it like a password: never paste it into an email, chat or document.
- **Changing a Pipeline user to any other role cancels its key immediately.** Only Pipeline users can have a key; the admin refuses one on an Admin or Marketing account.

### Media library (images)

**SEO**
- Every image has **Alt text** ("alternative text"): a short description of what the image shows. Screen readers read it aloud to blind visitors, and search engines use it to understand the image. It is **required**, and the admin rejects an empty one or one that looks like a file name (for example `IMG_0042.JPG`).
- Good: "Founder at a whiteboard mapping a store launch". Bad: "image", "photo1.png".
- Edit it at **Admin → Collections → Media → (image) → Alt**, then **Save**. The change applies everywhere that image is used.

**Editable by marketing**
- **Add an image:** **Admin → Collections → Media → Create New** → choose or drag in the file → write the **Alt** text → optionally a **Caption** → **Save**.
- Accepted types: JPG, PNG, WebP, GIF and SVG.
- **Caption** (optional): a default caption shown under the image when it is used as a figure inside an article.
- **Focal point:** after choosing the file, you can click the part of the image that matters most (a face, a product). When the site crops the image to fit a card or banner, it keeps that point in frame. The focal-point tool only appears on desktop-width screens, not on a phone.
- **Replace or remove:** open the image in **Admin → Collections → Media**, then edit or delete it. Before deleting, check the image is not still used on a page, or that spot will lose its picture.
- Sizes are made automatically when you upload: a small admin thumbnail, card, wide and full-width versions, and a **1200 × 630** version used when a page is shared on social media. You never resize images yourself.

**Forms & leads:** n/a.

**Social share:** the 1200 × 630 share size is generated from every uploaded image. Where you choose the default share image is covered under [SEO defaults](#seo-defaults).

**Other**
- Images have no draft stage: once saved, the file is live at a public web address. Only upload images that are fine for anyone to see.
- PDFs and other files do not go here; they go in [Downloads](#downloads-lead-magnet-files).

### Downloads (lead-magnet files)

A **lead magnet** is a free resource (a guide, checklist or worksheet) that visitors get in exchange for their email address. The files themselves live here.

**SEO:** n/a.

**Editable by marketing**
- **Add a file:** **Admin → Collections → Downloads → Create New** → choose the file → give it a **Title** (required) → **Save**.
- The **Title** is what you see in the admin and is used as the link text in the email that delivers the file.
- Accepted types: PDF, CSV, Excel (`.xlsx` only, not the older `.xls`) and ZIP.
- **Replace or remove:** open the file in **Admin → Collections → Downloads**, then edit or delete it.

**Forms & leads:** n/a here. The capture form that sends this file is covered under [Lead Magnet template](#18-lead-magnet-template) once that part is built.

**Social share:** n/a.

**Other**
- Each file gets a **public web link**: anyone with the link can download it. Never upload anything confidential.

## Content libraries (site-wide)

These four collections hold reusable content: client brands, team members, testimonials and reviews, and FAQs. You write each item once here, and the page sections that show it (logo strips, testimonial rows, FAQ lists) pull it in automatically. Those page sections are built later and are described under each page as they land.

Case studies are a library too, but because each one is a full page of its own, their editing guide lives under [2. Case Study template → Case studies (the collection)](#case-studies-the-collection). The same goes for articles and newsletter issues, whose guide is under [13. DEV-SEO template → Posts](#posts-articles-and-newsletter-issues), and for free downloads (lead magnets), whose guide is under [18. Lead Magnet template → Lead magnets](#lead-magnets-the-collection).

**How drafts work in these four libraries** (the same for all of them):
- **Save draft** stores your work at any time, even when required fields (marked with a red asterisk) are still empty. Visitors never see drafts.
- **Publish** checks that every required field is filled, then makes the item live on the site. Only published items ever appear to visitors. Publishing is always done by a person.
- **Autosave:** as soon as you click **Create New**, the admin saves a blank draft for you and keeps saving as you type. If you start an item and abandon it, delete that blank draft so the list stays tidy.
- **Internal links:** wherever an answer or story has a link button (FAQ answers, case-study stories, articles), choose **Internal link** to pick a page, case study, article or lead magnet from a list instead of typing its address. A link to something not yet published is simply not shown to visitors. **External link** is for other websites.
- **Sort Order** (right-hand sidebar): a number that sets the display order. Lower numbers come first. To reorder items, change their numbers (tip: use 10, 20, 30… so you can slot a new one in between later, e.g. 15).
- Some fields are only required in certain cases (for example a link to a Google review). Those show **no red asterisk**; their grey help text under the field says when they are needed, and **Publish** tells you if one is missing.

### Clients (logo strips)

**SEO:** n/a here. A client's logo uses the **Alt** text you wrote for that image in the [Media library](#media-library-images).

**Editable by marketing**
- **Add a client:** **Admin → Collections → Clients → Create New** → fill in the fields below → **Publish**.
  - **Name** (required): the brand name. If there is no logo, the name is shown as text in the logo strip instead.
  - **Logo** (optional): pick or upload an image from Media. Use a **monochrome** logo (one colour on a transparent background).
  - **Website** (optional): the full address, starting with `https://`.
  - **Show In Logo Strip** (right-hand sidebar): **off by default**. Tick it to show this client in the logo strips (Homepage, About, campaign pages).
  - **Sort Order** (sidebar): position in the logo strip; lower numbers first.
- **Remove a client from the logo strip** without deleting it: untick **Show In Logo Strip** and **Publish**.
- **Reorder the strip:** change each client's **Sort Order** and **Publish**.
- **Delete a client:** open it and delete it. Any testimonial linked to that client simply loses its brand pairing.

**Forms & leads:** n/a.

**Social share:** n/a.

**Other**
- Testimonials (and later case studies) can be linked to a client, so add the client here first.

### Team members

**SEO:** n/a here. The portrait uses the **Alt** text of the image in the [Media library](#media-library-images).

**Editable by marketing**
- **Add a person:** **Admin → Collections → Team members → Create New** → fill in the fields below → **Publish**.
  - **Name** (required): full name, as it should appear on the site and as an article author.
  - **Role** (required): a short title line, for example "Founder · Chicago".
  - **Bio** (optional): one or two sentences, written by the person themselves. Maximum 400 characters.
  - **Photo** (optional): a portrait from Media.
  - **Social links:** click **Add Social link**, choose the **Platform** (LinkedIn, X (Twitter), GitHub, Instagram, YouTube or Facebook) and paste the full `https://` profile address in **URL**. Each row is labelled with its platform. **Drag** rows by their handle to reorder the icons; use the row's menu to remove one.
- **Edit or remove:** open the person in **Admin → Collections → Team members**, change and **Publish**, or delete.

**Forms & leads:** n/a.

**Social share:** n/a.

**Other**
- Never write invented facts about the founder or team. The bio stays a placeholder until the person writes it.

### Testimonials and reviews

Every client quote, video testimonial and public review (Google, LinkedIn) lives in this one list.

**SEO:** n/a here. A video's poster image uses the **Alt** text of that image in the [Media library](#media-library-images).

**Editable by marketing**
- **Add a testimonial or review:** **Admin → Collections → Testimonials → Create New** → fill in the fields below → **Publish**.
  - **Quote** (required): the words of the testimonial or review.
  - **Author Name** (required), for example "J. Alvarez", and **Author Role** (optional), for example "3-location retailer, Chicago".
  - **Client** (optional): link it to a brand from [Clients](#clients-logo-strips). Its logo shows on video cards.
  - **Source** (sidebar, required): **Direct (client quote)**, **Google review** or **LinkedIn**. This sets the source label shown on the card.
    - For **Google review** or **LinkedIn**, a **Source URL** field appears: paste the public link where a visitor can check the review. Required to publish.
    - For **Google review**, a **Copied word for word from Google** box also appears. You must tick it to publish.
  - **Rating** (sidebar, optional): stars, a whole number from 1 to 5. Leave it empty and no stars are shown (it never defaults to 5).
  - **Format** (sidebar): **Text** or **Video**. Choosing **Video** shows the **Video** fields:
    - **YouTube URL**: the link to the video, uploaded to YouTube as **unlisted** (only people with the link can find it). Required to publish.
    - **Poster**: a still image from Media, shown before the video plays. Required to publish.
    - **Duration Label** (optional), for example "1:42".
  - **Metric** (optional): a headline result shown on the card, as a **Value** (for example "+212%") and a **Label** (for example "Revenue, 12 mo"). A result, never a price.
  - **Case Study** (optional): pick the case study about this client. Once that study is **published**, the testimonial shows a "Read the full case study" link to it. While the study is still a draft, no link appears. See [Case studies](#case-studies-the-collection).
  - **Review Date** (sidebar, optional): when the review or quote was given.
  - **Sort Order** (sidebar): position in the testimonial feed and review wall; lower numbers first.
- **Reorder:** change **Sort Order** and **Publish**.
- **Remove from the site:** delete it (or unpublish it, if you want to keep it for later).

**Forms & leads:** n/a.

**Social share:** n/a.

**Other**
- **Never invent a review, and never change a real review's words.** Google reviews are copied exactly as written on Google; that is what the "word for word" tick confirms.
- Until real testimonials exist, the site shows clearly labelled placeholders.

### FAQs

**SEO:** n/a here. How the FAQ page presents these questions to search engines is covered under [FAQ](#11-faq) once that page is built.

**Editable by marketing**
- **Add a question:** **Admin → Collections → FAQs → Create New** → fill in the fields below → **Publish**.
  - **Question** (required).
  - **Answer** (required): keep it direct. You can use paragraphs, **bold**, *italic*, bulleted and numbered lists, and links (for example to `/book-a-call` or `/contact`). Select text to see the formatting toolbar.
  - **Category** (sidebar, required): **Pricing & Contracts**, **Builds**, **Marketing** or **Process & Trust**. This is the group the question sits in on the FAQ page.
  - **List on the FAQ page** (sidebar): **on by default**. Untick it for questions that should only appear in the small FAQ sections on the service pages (Services Hub, Shopify Theme Development, Marketing), not on the main FAQ page.
  - **Sort Order** (sidebar): order within its category on the FAQ page; lower numbers first. The first **Pricing & Contracts** question opens by default, so it should be the direct pricing answer.
- **Reorder within a category:** change **Sort Order** and **Publish**.
- **Choosing which FAQs appear on a service page** is done on that page's FAQ section, not here. That section is built later and will be described under the page.

**Forms & leads:** n/a.

**Social share:** n/a.

**Other**
- The FAQs at the bottom of articles are not stored here; they are written inside each article. That is covered under the article templates once they are built.

### Pages (site pages)

Every ordinary page of the site is a **Page**: Homepage, About, Services pages, FAQ, Contact, Book a Call, Thank You, the legal pages, the 404 ("page not found") page, campaign landing pages, Link-in-Bio and so on. Case studies, articles and newsletter issues, and lead magnets are **not** Pages; they have their own collections ([case studies](#case-studies-the-collection), [posts](#posts-articles-and-newsletter-issues), [lead magnets](#lead-magnets-the-collection)).

**Sections are not available yet.** A page's content is made of **blocks** (sections such as a hero or a testimonial row). Those arrive as each block is built, and each is described under its page. For now a Page is just a title plus the settings below.

**SEO**
- **Title** doubles as the default browser-tab title. Search-engine title, description and share image are not set here yet; they arrive with the SEO unit.
- **Hide from search engines** (right-hand sidebar): tick it to keep the page out of Google and out of the sitemap. Used for Thank You, campaign landing pages, Link-in-Bio and 404.

**Editable by marketing**
- **Create a page:** **Admin → Collections → Pages → Create New** → **Title** → **Save draft** or **Publish**. The list shows title, web address, footer, status (Draft / Published) and last update.
- **Web address (slug):** made automatically from the title and kept unique. To type your own, click **Unlock**, edit, then **Lock**. Use `/` between parts, e.g. `services/marketing`.
  - `home` is the homepage (`/`). `404` is the "page not found" page.
  - Some addresses are reserved and refused: `admin`, `api`, anything starting with `_`, and anything starting with `work/`, `insights/`, `newsletter/` or `resources/` (those belong to case studies, articles, newsletter issues and lead magnets). A refused address shows an error under the Slug field and the page stays a draft until you fix it.
  - **Changing the address of a published page changes its link**, so old links stop working; add a redirect (see the Quick reference once that feature is built).
- **Header** (sidebar): **Standard**, **Logo only** (campaign landing pages) or **None** (Link-in-Bio).
- **Footer** (sidebar): **Standard**, **Reduced navigation** (Book a Call, Thank You) or **Legal only** (campaign pages, Link-in-Bio).
- **Zero leakage** (sidebar tick, for campaign landing pages): forces the Logo-only header and Legal-only footer (you cannot choose otherwise while it is on). Once sections exist it also blocks the newsletter band, so visitors can only take the page's offer.
- **Reading progress bar** (sidebar tick): a thin progress bar for long pages (About, FAQ).
- **Published** (date): set automatically the first time you publish.
- Adding, removing and reordering sections: described here once blocks exist (they will be drag-to-reorder).

*Saving and publishing*
- The admin autosaves your draft as you type. Clicking **Create New** saves a blank draft straight away, so delete any you abandon.
- Edits to a published page only reach visitors after you click **Publish changes** again. Publishing is always done by a person.

*Removing a page*
- **Marketing can delete drafts only.** To take a published page off the site, open it, use the **⋯ (three dots) menu → Unpublish**; it returns to being a draft, which you can then delete. Or ask an Admin.

**Forms & leads:** n/a here (forms are sections, covered with their blocks).

**Social share:** not set here yet; arrives with the SEO unit.

**Other**
- Changes appear on the site as soon as they are published; no developer is needed.

## Forms & leads (site-wide)

Every form on the website (Contact, the pre-call homework, newsletter sign-ups, lead-magnet downloads) is set up and stored in two places in the admin, described below. A **lead** is a person who has filled in one of these forms.

**Not live yet:** the public forms on the website are not switched on. They arrive with the form sections (blocks) and spam protection, which are built later. Until then nothing on the public site creates a submission, and nothing is sent to anyone. This entry explains the admin screens so you know where to look once they are live.

### Forms and form submissions

**SEO:** n/a.

**Editable by marketing**

*Forms* (**Admin → Forms**)
- **Marketing can view forms but not change them.** Only an **Admin** can create, edit or delete a form. The reason: each form's field names are the contract with the lead notifications. Renaming a field by accident would break what the notification says. If a form needs a new question or different wording, ask an Admin.
- What an Admin sets on each form, so you recognise the labels (in the right-hand sidebar):
  - **Form key**: a short, fixed code name for the form, e.g. `contact` or `precall-homework`. It is how the system tells forms apart. Never renamed once the form is live.
  - **Event type**: what kind of lead notification a submission produces: **None**, **Contact**, **Newsletter** or **Lead magnet**.
  - **Send event**: when ticked, each submission is announced (sent as an "event") to the business's assistant system, which tells the human. When unticked, submissions are still saved here but nothing is announced. The pre-call homework form starts with this off.
  - **Newsletter sync**: when ticked, the person is also added to the newsletter list in Resend (the email service). For lead-magnet forms an **Opt-in field name** appears, naming the tick box the visitor must tick; leave it empty to add everyone who submits (the newsletter form).
- The kinds of question a form can ask: short text, email address, long text, dropdown (select), tick box, number, date, and a plain message (text shown to the visitor, with no answer). There is no file upload, payment or country/state picker.

*Form submissions* (**Admin → Form submissions**)
- **Where leads land:** every submission is saved in **Admin → Form submissions**, before anything else happens. This list is the permanent record of every lead, even if a notification fails.
- **Columns in the list:** **Form** (which form it came from), **Delivery status**, **Delivery attempts** and **Created** (when it was submitted). Open a row to see the person's answers.
- **Marketing can read submissions but not edit or delete them.** Only an Admin can. This keeps the lead record trustworthy.
- **Delivery status** says whether the lead was announced to the human:
  - **Pending**: saved, announcement not yet confirmed.
  - **Delivered**: announced successfully.
  - **Failed**: the announcement could not be completed. The lead is **not lost**, it is saved here; only the announcement failed.
  - **Empty**: the form sends no announcement (for example the pre-call homework form at launch).
- The delivery fields (**Event ID**, **Delivery status**, **Delivery note**, **Delivery attempts**, **Last attempt**) are filled in automatically and are read-only. **Delivery note** holds the last response or error. A newsletter form also shows a **Newsletter sync** group tracking the email-list sign-up separately from the announcement.
- **Find failed deliveries:** **Admin → Form submissions** → apply the **Failed deliveries** saved filter. A saved filter (called a **preset**) is a shared saved view of a list. The Failed deliveries preset is created by an Admin or the setup process; if you do not see it, ask an Admin.
- **Make your own saved filter:** open **Admin → Form submissions**, set the filter you want (for example Form is `contact`), then save it as a preset using the saved-views control at the top of the list and choose who can use it (just you, or shared with everyone). Saved filters are personal conveniences and never change any data.
- **Re-send button: coming with the lead-notification release (not built yet).** Today there is no way to re-send an announcement from the admin. When it arrives, it will resend a failed lead without creating a duplicate announcement. This entry will be updated then.

**Forms & leads:** see above. What gets announced to the human, and what "failed" means in practice, will be confirmed here when the lead-notification release is live (nothing is announced today).

**Social share:** n/a.

**Other**
- **Where forms are connected:** a lead magnet's **Capture form** (**Admin → Collections → Lead magnets → (lead magnet) → Capture tab**) chooses which form collects the email for that download. The one **Newsletter form** used by every newsletter box and the footer is chosen at **Admin → Globals → Site settings → Newsletter & closers tab → Newsletter form**.
- **Blank drafts:** opening a **Create New** screen on a collection with drafts (Pages, Case studies, Lead magnets and so on) saves a blank draft automatically. If you back out without writing anything, delete that blank draft from the list so it does not clutter it.
- Never copy real leads' details into notes, chat or documents. Refer to a submission by its ID.

## 1. Homepage

*Not built yet.* The Homepage is a Page with the web address `home`; see [Pages (site pages)](#pages-site-pages).

## 2. Case Study template

Each case study is its own long-form page on the site, at `duhamedia.com/work/(web address)`. You write a study once in the admin, and the site uses it in two ways: as its full page, and as a card (headline metric, short summary, image) wherever studies are pulled in (Homepage, Work, the service pages, About, campaign pages, Link-in-Bio, Review Hub). The page design that displays a study is built later; this entry covers where the content is written.

### Case studies (the collection)

**The launch rule:** every case study stays a **draft** at launch. No study is visible to visitors until a person publishes it. Wherever studies would appear, the site shows a designed alternative (for example a testimonial or metric strip) instead, so nothing looks empty or "coming soon". You can write and save studies freely in the meantime; visitors never see drafts.

**SEO:** not here yet. Search-result title, description and share image fields for case studies arrive with the SEO unit and will be added to this entry then. The images a study uses take their **Alt** text from the [Media library](#media-library-images).

**Editable by marketing**

Open **Admin → Collections → Case studies** and click **Create New**, or open an existing study. The list shows each study's title, client, track, whether the figures are approved, and its status (Draft / Published). Published studies are listed first, newest first, then drafts.

The edit screen has four **tabs** (the headings across the top of the form: Summary, Story, Results, Client voice & closing) plus a right-hand **sidebar**. Fields marked with a red asterisk must be filled before you can publish; you can save a draft with them empty.

*Summary tab*
- **Title** (required): the study's headline, shown largest at the top of the page, e.g. "The demand was already there. The store was leaking it."
- **Accent phrase** (optional): a word or phrase to show in the accent colour. It must be copied from the title exactly as it appears there (capital letters do not matter); anything not found in the title is rejected.
- **Client** (required): pick the brand from [Clients](#clients-logo-strips). Add the client there first if it is missing.
- **Track** (required): the kind of engagement, which decides which service pages show this study as proof: **Build**, **Growth engine**, **Build + engine** or **Handover complete**.
- **Study number** (optional): a whole number, shown as "Study 01" / "№ 01".
- **Engagement line** (optional), e.g. "Build + engine, 12 months · Hardgoods retail, 3 locations".
- **Headline metric**: the oversized result shown on the study and on every study card.
  - **Value** (required), e.g. "+212%". Always a result or a count, **never a price**.
  - **Label** (required): what the number measures, e.g. "Revenue, 12 months".
  - **Sub-line** (optional): a quiet line under the metric.
  - **Accent colour** (tick box): show the number in the accent colour.
- **Card summary** (required): one or two lines for study cards and the Work list. Maximum 160 characters.
- **In short** (required): the "In short" box under the headline.
- **Hero media** (required): the main image, shown inside a browser-style frame (for example a screenshot of the store). Pick or upload it from Media.

*Story tab*
- Three numbered sections, always in this order: **01 — The before**, **02 — The strategy**, **03 — The results**. Each has a **Heading** (required) and **Text** (required).
- The text editor supports paragraphs, **bold**, *italic*, bulleted and numbered lists, quotes, links and images. Use the toolbar at the top of the editor, select text for the formatting bar, or type `/` to insert something.
- **Add an image to the story:** type `/` (or use the toolbar), choose the upload option, and pick or upload an image from Media.
- **Give a story image a caption:** click the image's **pencil (Edit Relationship)** button and fill in **Caption**, e.g. "Fig. 1 — Checkout before the rebuild". This caption belongs to this spot in this study only. It is separate from the image's own **Caption** in the Media library, which stays unchanged.

*Results tab*
- **Eyebrow** (optional): the small label above the table, e.g. "Results — 12 months, client-reported".
- **Column headings** (optional): the table's four header labels, **Measure**, **Baseline**, **After** and **Change**, e.g. "Measure", "Before", "After 12 mo", "Change".
- **Results** (required, at least one): one row per measured result.
  - **Add a row:** click **Add Result**. Each row needs **Measure** (e.g. "Online revenue") and **After**; **Baseline** and **Change** (e.g. "+212%") are optional.
  - **Reorder:** drag a row by its handle. Each collapsed row is labelled with its measure and change, so you can tell them apart.
  - **Remove:** use the row's menu.
- **How it was measured** (optional): how the numbers were measured and who reported them.

*Client voice & closing tab*
- **Testimonial** (optional): pick the client's testimonial from [Testimonials and reviews](#testimonials-and-reviews). A video testimonial plays first; a text one shows as a quote.
- **What we'd do differently** (optional): a short aside, with paragraphs, bold, italic, lists and links.
- **How this maps to our phases** (optional).
- **Link** (optional): a link under this section, e.g. "See the two tracks".
  - **Link type**: **Page on this site** (then pick it under **Page**; for now only case studies can be picked, more page types are added as they are built) or **Custom address** (then type the **Address**: `https://…`, `mailto:…`, or a site path like `/book-a-call`).
  - **Link text**: the words shown.
  - **Open in a new tab** (tick box).
  - Leave the whole link empty for no link. Once you fill in any part, both the link text and the destination are needed to publish.
- **Closing → Newsletter heading** and **Final CTA heading** (optional): headings for the newsletter sign-up and the final "book a call" section at the end of this study. Leave empty to use the site-wide defaults.

*Sidebar*
- **Slug** (the study's web address, `/work/(slug)`): made automatically from the title. While the study is a draft it follows the title as you edit; once it is published it no longer changes by itself. The box is locked by default. To change it by hand, click **Unlock**, then type a new one (or click **Generate** to rebuild it from the title), then **Lock**. **Changing the slug of a published study changes its web address**, so old links to it stop working; add a redirect from the old address when that feature lands.
- **Featured** (tick box): show this study in the "featured" spots on the Homepage, Services and Review Hub.
- **Client approved the figures** (tick box): **required to publish.** Tick it only once the client has signed off every number in the study (headline metric, results table and anything quoted in the story).
- **Read time** (minutes, optional): leave it empty and it is worked out from the length of the story when you publish. To have it recalculated after editing the story, clear it and publish again.
- **Published** (date): set automatically the first time the study is published. It orders the Work page and the "Next study" link. You can set it yourself; a date you enter is never overwritten.

*Saving and publishing*
- The admin saves your draft automatically as you type (**autosave**). As with the libraries, clicking **Create New** creates a blank draft straight away, so delete any you abandon.
- **Publish changes** checks everything at once: if anything is missing or invalid (including an unticked **Client approved the figures**), nothing is published and every problem is highlighted together, so you can fix them all in one pass.
- Publishing is always done by a person. Edits to a published study are only visible to visitors after you click **Publish changes** again.

*Removing a study*
- **Marketing can delete drafts only.** To take a published study off the site, open it, use the **⋯ (three dots) menu** at the top right of the document and choose **Unpublish**; it returns to being a draft, which you can then delete if you wish. Or ask an Admin.

**Forms & leads:** n/a. (The newsletter sign-up and final call-to-action at the end of each study are covered under their own blocks once built.)

**Social share:** not set here yet. The share image and text for a study arrive with the SEO unit. Every image uploaded to Media already gets a 1200 × 630 share-size version automatically.

**Other**
- **Never invent figures or present a demonstration study as a real result.** Placeholder studies stay drafts.
- A testimonial can point back to a study through its **Case Study** field; that "Read the full case study" link only appears once the study is published.
- Changes appear on the site as soon as they are published; no rebuild or developer is needed.
- The reading-progress bar on the study page will be part of the page design (built later); there is no field for it.

## 3. Work hub

*Not built yet.*

## 4. Services Hub

*Not built yet.*

## 5. Shopify Theme Development

*Not built yet.*

## 6. Marketing

*Not built yet.*

## 7. Testimonials

*Not built yet.*

## 8. About

*Not built yet.*

## 9. Book a Call

*Not built yet.*

## 10. Thank You

*Not built yet.*

## 11. FAQ

*Not built yet.*

## 12. Contact

*Not built yet.*

## 13. DEV-SEO template

Long-form articles aimed at search, at `duhamedia.com/insights/(web address)`. The page design that displays an article is built later; this entry covers where the content is written. Articles, MKT-SEO articles ([14](#14-mkt-seo-template)) and newsletter issues ([16](#16-newsletter)) all live in one list called **Posts**.

### Posts (articles and newsletter issues)

**Pick the Track first.** Every post has a **Track** (right-hand sidebar, required) that decides what it is and which tabs appear:
- **DEV-SEO article**: published at `/insights/(web address)`.
- **MKT-SEO article**: published at `/insights/(web address)`.
- **Newsletter issue**: published at `/newsletter/(web address)`.

The **Sections** and **FAQ** tabs only appear for the two article tracks; newsletter issues hide both. If you cannot see a tab, check the Track.

**The content pipeline writes drafts here.** The "content pipeline" is the automated article writer (see [Users and roles](#users-and-roles)). It can create and edit **drafts** only. It cannot publish, delete, set the **Author**, pick the hero image, or change a post that is already live. **Publishing is always a person:** review the draft (fix the copy, set the **Author** and **Hero image**), then **Publish changes**.

**SEO:** not here yet. Search-result title, description and share image fields for posts arrive with the SEO unit and will be added to this entry then. The **Target keyword** (sidebar) is recorded for that purpose. Images take their **Alt** text from the [Media library](#media-library-images).

**Editable by marketing**

Open **Admin → Collections → Posts** and click **Create New**, or open an existing post. The list shows title, track, status (Draft / Published), published date and last update; published posts come first, newest first, then drafts. To find pipeline drafts, filter the list by **Status: Draft**.

*Sidebar*
- **Track** (required): see above.
- **Web address (slug)**: made automatically from the title and kept unique (`-2`, `-3` … is added if the address is taken). Click **Unlock** to type your own, then **Lock**. **Changing the web address of a published post changes its link**, so old links stop working; add a redirect (see the Quick reference once that feature is built).
- **Target keyword**: the search phrase the article is written for, e.g. "Shopify development Chicago".
- **Author**: pick a person from [Team members](#team-members). Shown as "By …, Duha Media". Set by a person during review; the pipeline cannot set it.
- **Read time** (minutes): leave empty and it is worked out from the body when you publish.
- **Published** (date): set automatically the first time you publish. You can set it yourself.
- **Updated (shown)**: optional "Updated …" date shown on the article.

*Article tab* (all tracks)
- **Title** (required): the headline, e.g. "Shopify development in Chicago, scoped and priced in writing."
- **Newsletter issues only**: **Issue number** (required to publish, shown as "ISSUE 011"), **Sent on** (date) and **Issue metric** (the number shown on the issue's row).
- **Eyebrow**: the small line above the headline.
- **Standfirst** (required, maximum 300 characters): the paragraph under the headline. It is also the short excerpt on newsletter cards.
- **Hero image**: optional, from Media. Set by a person.
- **Body** (required): the article. It supports **H2** and **H3** headings (H2s are numbered 01, 02 … on the site), bold, italic, bulleted and numbered lists, quotes, links and images. Use the toolbar at the top, select text for the formatting bar, or type `/` to insert an image from Media. **Give an image a caption:** click its **pencil (Edit Relationship)** button and fill in **Caption**; this caption belongs to that spot only and does not change the image's own caption in the Media library.
- **Pricing note** (optional, maximum 80 characters): a small inline note about price. Prices go only here, never in headings or metrics.

*Sections tab* (DEV-SEO and MKT-SEO only)
- **DIY vs done-for-you**: **Eyebrow**, **Heading**, **Accent phrase** (a word or phrase copied from the heading, shown in the accent colour; anything not found in the heading is rejected), **Body**, and up to **3 Facts** (a value and a label each, e.g. "4–6" / "Weeks"; never a price). **Add a fact:** click the add button; **reorder:** drag by the handle; **remove:** the row's menu.
- **How we do it**: **Eyebrow**, **Body** and an optional **Link** (link type, link text, new-tab tick box; leave empty for no link).
- **Educational block** (DEV-SEO only): **Eyebrow**, **Heading**, **Body**.
- **Proof**: which case studies back the article up. **Source**: **Featured studies**, **Studies of this track** or **Pick studies** (then choose them, in display order). Only **published** studies show. While none is published, a designed fallback shows instead: choose **Fallback** as **Testimonials** (then pick them) or **Metric strip** (then add metrics, drag to reorder), plus an optional **Fallback note**. Leave **Fallback** empty to use the default (DEV-SEO: testimonials, MKT-SEO: metric strip). Set by a person; the pipeline cannot fill this in.

*FAQ tab* (DEV-SEO and MKT-SEO only)
- **FAQ heading**, e.g. "On consolidating your marketing", then up to **8 Questions**. Click **Add Question**; each row needs a **Question** and an **Answer** (paragraphs, bold, italic, lists, links). Rows are labelled with their question; **drag** by the handle to reorder; use the row's menu to remove one.
- These FAQs belong to this article only. They are separate from the [FAQs](#faqs) library and do not appear on the FAQ page. They are also offered to search engines as FAQ results.

*Closing tab* (all tracks)
- **Newsletter heading** and **Final CTA heading** (call to action; the "book a call" section at the end): optional. Empty means the site-wide defaults.

*Saving and publishing*
- The admin saves your draft automatically as you type (**autosave**). Clicking **Create New** creates a blank draft straight away, so delete any you abandon.
- **Publish changes** checks everything at once. If anything required is missing, nothing is published and every problem is listed together. The error badge on a tab can read one higher than the list; that is normal (the section itself is counted).
- Edits to a published post only reach visitors after you click **Publish changes** again.

*Removing a post*
- **Marketing can delete drafts only.** To take a published post off the site, open it, use the **⋯ (three dots) menu → Unpublish**; it returns to being a draft, which you can then delete if you wish. Or ask an Admin.

**Forms & leads:** n/a. (The newsletter sign-up and final call-to-action at the end of each article are covered under their own blocks once built.)

**Social share:** not set here yet. The share image and text for posts arrive with the SEO unit. Every image uploaded to Media already gets a 1200 × 630 share-size version.

**Other**
- Never put prices in headings, facts or metrics; use the **Pricing note**.
- Never invent client results. Proof only shows published case studies, with a designed fallback otherwise.
- Changes appear on the site as soon as they are published; no developer is needed.
- The reading-progress bar on article pages is part of the page design; there is no field for it.

## 14. MKT-SEO template

MKT-SEO articles are written in the same place as DEV-SEO articles: **Admin → Collections → Posts**, with **Track** set to **MKT-SEO article**. The full guide is under [Posts (articles and newsletter issues)](#posts-articles-and-newsletter-issues). The article page design itself is built later.

## 15. Campaign LP template

*Not built yet.*

## 16. Newsletter

Newsletter issues (the archive shown on this page) are written in **Admin → Collections → Posts** with **Track** set to **Newsletter issue**. See [Posts (articles and newsletter issues)](#posts-articles-and-newsletter-issues), including the issue-only fields. The Newsletter page itself is built later.

## 17. Link-in-Bio

*Not built yet.*

## 18. Lead Magnet template

Each **lead magnet** (a free download offered in exchange for an email address) is its own landing page at `duhamedia.com/resources/(web address)`. You write one once in the admin: the pitch, what is inside, the file to deliver, the delivery email, and the "check your inbox" message. The page design that displays it is built later; this entry covers where the content is written. Upload the file itself first, in [Downloads](#downloads-lead-magnet-files).

### Lead magnets (the collection)

**SEO:** lead-magnet pages are meant to be kept out of search engines (the page template does this itself, so there is no setting to tick). Search-result title, description and share image fields arrive with the SEO unit and will be added here then.

**Editable by marketing**

Open **Admin → Collections → Lead magnets** and click **Create New**, or open an existing one. The list shows title, web address, status (Draft / Published), published date and last update; published ones first, newest first, then drafts. The edit screen has four **tabs** (the headings across the top of the form) plus a right-hand **sidebar**. Fields with a red asterisk are needed to publish; you can save a draft with them empty.

*Capture tab* (the top of the page)
- **Eyebrow**: the small line above the headline. Starts as "Free download".
- **Title** (required): the headline, naming the download and its pitch, e.g. "The 20-point store leak checklist."
- **Accent phrase** (optional): a word or phrase to show in the accent colour. It must be copied from the title (capital letters do not matter); anything not found in the title is rejected.
- **Pitch** (required): one paragraph on what it is, who it is for and the problem it solves. Lead with the number.
- **Form note** (optional): a small line under the sign-up form.
- **Capture form**: the form that collects the visitor's details for this download. Pick it from the list of forms (forms are set up by an Admin; see [Forms and form submissions](#forms-and-form-submissions)). Public forms are not live yet, so nothing is collected until they are.

*What's inside tab*
- **Value bullets** (required, **3 to 6**): the concrete things the reader gets. Each row is one line of text, and the collapsed row shows that text.
  - **Add:** click **Add Bullet**. The button disappears once you reach 6.
  - **Reorder:** drag a row by its handle.
  - **Remove:** use the row's menu. You need at least 3 to publish.

*Asset & email tab*
- **Asset**: what the visitor receives. Give **either** a file **or** a link, not both, and not neither.
  - **File:** pick it from [Downloads](#downloads-lead-magnet-files) (upload it there first: **Admin → Collections → Downloads → Create New**).
  - **Or a link:** a full `https://` address, if the asset lives somewhere else (for example a shared document).
- **Delivery email**: the one email that sends the asset (there is no follow-up series).
  - **Subject** (required), e.g. "Your store leak checklist".
  - **Intro** (required): short text above the download link.

*Delivered state tab* (what the visitor sees right after signing up)
- **Eyebrow**: small line above the heading. Starts as "Sent".
- **Heading** (required), e.g. "Check your inbox. It's on the way."
- **Accent phrase** (optional): a word or phrase copied from the heading, shown in the accent colour.
- **Body** (optional): e.g. a note to check spam.
- **Newsletter cross-sell line** (optional): the line that leads into the newsletter sign-up, e.g. "While you're here:".

*Sidebar*
- **Web address (slug)**: made automatically from the title and kept unique (`-2`, `-3` … is added if taken). The page lives at `/resources/(slug)`. Click **Unlock** to type your own, then **Lock**. **Changing the web address of a published lead magnet changes its link**, so old links stop working; add a redirect (see the Quick reference once that feature is built).
- **Published** (date): set automatically the first time you publish. You can set it yourself.

*Saving and publishing*
- The admin saves your draft automatically as you type (**autosave**). Clicking **Create New** saves a blank draft straight away, so delete any you abandon.
- **Publish changes** checks everything at once: if anything is missing or invalid (for example both a file and a link, or only 2 bullets), nothing is published and every problem is shown together, so you can fix them in one pass.
- Edits to a published lead magnet only reach visitors after you click **Publish changes** again. Publishing is always done by a person.

*Removing a lead magnet*
- **Marketing can delete drafts only.** To take a published lead magnet off the site, open it, use the **⋯ (three dots) menu → Unpublish**; it returns to being a draft, which you can then delete if you wish. Or ask an Admin.

**Forms & leads:** submissions will land in **Admin → Form submissions** once the public forms are live; see [Forms and form submissions](#forms-and-form-submissions). The public form and the re-send button are not built yet.

**Social share:** not set here yet. The share image and text arrive with the SEO unit.

**Other**
- **Treat files as shareable.** The download link is not yet hidden behind the sign-up form: anyone who gets the link to the file (or the external link) can use it without signing up. Do not upload anything you would not want passed around.
- Changes appear on the site as soon as they are published; no developer is needed.
- Never invent figures in the pitch or bullets.

## 19. Review Hub

*Not built yet.*

## 20. Legal template

*Not built yet.*

## 21. 404

*Not built yet.*

---

## Site-wide settings

Header, footers, contact details, social handles, booking link and default share image.

A **global** is a single settings screen that exists once for the whole site (unlike a collection, which is a list of many items). Globals are listed in the left-hand menu under **Globals**. All four are now built: **Site settings**, **Capacity & scarcity**, **Navigation** (the header menu and footer links) and **SEO defaults** (how the site appears in Google and in social shares, including the default share image).

### Site settings

Facts the whole site shares: the company name in the footer, contact email, social profiles, location, booking link, Google rating and newsletter defaults. You change each one here once and every page that uses it updates.

**Where:** **Admin → Globals → Site settings** (address `duhamedia.com/admin/globals/site-settings`). The screen has five **tabs** (the headings across the top of the form): **Brand & contact**, **Location**, **Booking**, **Reviews**, **Newsletter & closers**. Click **Save** at the bottom/top right when you are done.

**There is no draft stage here.** Unlike pages, a save is live straight away: **changes appear on the site right away**, with no Publish step and no developer needed. Check spelling and links before you click Save. Both Admins and Marketing can edit this screen.

**SEO**
- Nothing here is a search-result title or description. Some facts do reach search engines behind the scenes: the **social profiles** and **location** are given to Google as the company's official profiles and address area, which helps it recognise the business. (This arrives with the SEO unit; there is nothing to set for it.)
- Keep the **social profile links** and **Short location line** accurate, as these are what Google is told.

**Editable by marketing**

*Brand & contact tab* (shown in every footer and on the Contact and Link-in-Bio pages)
- **Legal company name** (required): the registered company name in the copyright line at the bottom of every footer ("© 2026 …"). The year updates by itself.
- **Footer brand line** (optional, up to 120 characters): the short line under the logo in the main footer.
- **Contact email** (required): the public address shown on the Contact page.
- **Reply-time note** (optional, up to 60 characters): a small line next to the email, e.g. "Reply in 1 business day". Only promise what you keep.
- **Social profiles** (a list of rows):
  - **Add:** click **Add Social profile**, then fill the row: **Platform** (LinkedIn, Instagram, YouTube, X (Twitter), Facebook or GitHub), **Handle** and **URL**.
  - **Handle:** type it as it appears on the platform, e.g. `duhamedia`. The **@ is added automatically** if you leave it out. Only letters, numbers, dots, dashes and underscores are accepted.
  - **URL:** the full profile address. It **must start with `https://`**; anything else is rejected when you save.
  - **Reorder:** drag a row by its handle; the order here is the order on the site. Each row is labelled with its platform so you can tell them apart.
  - **Remove:** use the row's menu (the **⋯** or trash icon on the row), then Save.

*Location tab* (the Contact page map and Google search results)
- **Town / city**, **State** and **Country** (town and state are required; use two-letter codes for state and country, e.g. IL and US). The facts already filled in are Lombard, IL, US.
- **Short location line**: how the location reads on the site, e.g. "Lombard, IL".
- **Market area**: the metro area named in the brand line, e.g. "Chicago" in "Integrated ecommerce growth partner — Chicago".
- **Service radius (miles)**: drawn as the ring on the Contact page map (0 to 500).
- **Latitude** and **Longitude**: the map pin position. In Google Maps, right-click the spot; the first number is latitude and the second is longitude. Latitude is between -90 and 90, longitude between -180 and 180.

*Booking tab* (the Book a Call page)
- **Booking page address**: the full `https://` address of the booking calendar. This is where the Book a Call page sends people. **If you leave it empty, the Book a Call page shows a "get in touch" fallback panel** instead of a booking button, so nothing looks broken.
- **How the booking page opens** (required) has two settings:
  - **Button that opens the booking page in a new tab** (**link-out**, the default): visitors see a button and the booking calendar opens in a new browser tab.
  - **Booking calendar shown inside the page** (**embed**): the calendar would appear inside our own page. **Keep link-out.** The booking calendar has not been set up to allow this, so embedding does not work today.

*Reviews tab* (Testimonials and Reviews pages)
- **Google Business Profile link**: the full `https://` link to the business's Google profile, so visitors can check the reviews.
- **Average rating** (the star rating shown on the site):
  - It is **hidden until you tick "Show the rating on the site"**. While unticked, nothing is shown and nothing else needs filling in.
  - Once ticked, more fields appear and **all become required**: **Average stars** (1 to 5, e.g. 4.9), **Number of reviews**, **Checked on** (the day you read the figures) and **Source link** (the Google page the rating comes from, starting with `https://`). Save is refused until they are filled in.
  - Only enter real figures copied from Google. Untick **Show** to take the rating off the site again.

*Newsletter & closers tab*
- **Newsletter form**: the one form used by every newsletter box on the site and by the footer sign-up. Pick it from the list. Forms themselves are set up by an Admin; see [Forms and form submissions](#forms-and-form-submissions).
- **Default closing sections**: used at the end of case studies and articles, and by any newsletter or final call-to-action section whose own heading is left empty.
  - **Newsletter heading** and **Newsletter line** (the quiet line underneath).
  - **Final call-to-action heading** (the big closing line before the footer) and **Final call-to-action button** (usually "Book a Call"). The button is a link: choose **Page on this site** to pick a page from a list, or **Custom address** to type one.
- **Postal address (newsletter emails)**: address lines, city, state, ZIP code and country. **US law requires a postal address at the bottom of every newsletter email**, so it is used in the newsletter footer. **It is not shown on the website pages.** The first newsletter cannot be sent until this is filled in.

**Forms & leads:** n/a here. The postal address is read when a newsletter is sent; see the Quick reference once newsletter sending is documented. The newsletter sign-up form itself is chosen in the **Newsletter form** field on the same tab; sign-ups will land in **Admin → Form submissions** (see [Forms and form submissions](#forms-and-form-submissions)).

**Social share:** the social profile links are for the profile icons on the site, not for share previews. The default share image is not set here; it is set under [SEO defaults](#seo-defaults).

**Other**
- Defaults are filled in the first time the screen is saved; until the first save some fields show their placeholders only.
- Never enter invented facts. Leave a field empty rather than guess: legal name, email, social profiles, the Google link, map position, postal address and rating all start empty on purpose.
- Marketing and Admins can edit this screen; ordinary visitors only see the results.

### Capacity & scarcity

How busy we are, kept in one place. The site uses these numbers in several spots (the big "projects ongoing" strip, the capacity line above the closing call-to-action, the offer on campaign pages, the Link-in-Bio slots line). You update them here once and every spot follows.

**Where:** **Admin → Globals → Capacity & scarcity** (address `duhamedia.com/admin/globals/scarcity`). Click **Save** when done. Both Admins and Marketing can edit it.

**There is no draft stage here.** A save is live straight away, with no Publish step and no developer needed. The page sections that display these numbers are still being built, so for now nothing on the public site shows them; what you save is ready for when they land.

**SEO:** n/a. Nothing here is a search-result title or description.

**Editable by marketing**

*The four counts* (all required whole numbers, 0 or more; the cap must be at least 1)
- **Client cap**: the most clients we take at once ("We cap at 7").
- **Active clients**: clients we are working with now ("Slots open 3/7"). **It can never be more than the Client cap.** If you type a bigger number, Save is refused with a message saying so. Raise the cap first, or lower the number.
- **Builds in progress**: store builds running now ("3 builds in progress").
- **Engines running**: growth engines running now ("3 engines running").
- These start empty on purpose, so no made-up number can ever appear. Fill in the real ones.

*Statements* (the wording the site shows)
- Each statement has a **loud** part and a **quiet** part. The **loud** part is the big line or number ("3 builds in progress. We cap at 7."). The **quiet** part is the one-line **reason** underneath, in small text ("The cap keeps every build senior-staffed.").
- **The reason is required.** The site never shows a number without its reason, so Save is refused if any statement has an empty reason. Keep the reason out of the loud line; each part has its own box.
- Fields on each statement row:
  - **Type** (required): where the statement is used. See the list below. **Each type can be used once**; picking a type already used in another row is refused. Edit that row instead.
  - **Caption** (optional): a small label next to a big number, e.g. "Projects ongoing".
  - **Statement (loud)** (required): the big line.
  - **Reason (quiet)** (required): the line beneath.
- **Add:** click **Add Statement** (you need at least one to save). **Reorder:** drag a row by its handle. **Remove:** use the row's menu, then **Save**. Rows are collapsed to start; click a row to open it. Each collapsed row is labelled with its type.

*Where each type is used*
- **Projects ongoing (big number)**: the "projects ongoing" figure in the scarcity strip on the Homepage.
- **Client cap (big number)**: the "we cap at" figure in that same strip.
- **Builds line (Final CTA)**: the capacity line above the closing call-to-action on most pages.
- **Engines line (Marketing / MKT-SEO Final CTA)**: the same line, but about engines, on the Marketing page and MKT-SEO articles.
- **Slots line (Link-in-Bio)**: the slots line on the Link-in-Bio page.
- **Offer line (Campaign LP offer)**: the offer section on campaign landing pages.

*Placeholders that fill in the numbers*
- A **placeholder** is a word in curly brackets that the site swaps for the real number. Write it inside the loud statement, e.g. `{builds} builds in progress. We cap at {capacity}.`
- The ones that exist: `{active}` (Active clients), `{capacity}` (Client cap), `{builds}` (Builds in progress), `{engines}` (Engines running), and `{open}` (cap minus active clients, worked out for you, never below 0).
- Using placeholders means you only change a number once, in the four counts, and every statement stays in step.
- **An unknown placeholder** (for example `{slots}` or a typo like `{buidls}`) is refused when you Save, with a message naming it and listing the valid ones. Fix the spelling or type the number as plain text. If a placeholder's count is missing, the site leaves that statement out rather than print half a sentence.

**Forms & leads:** n/a.

**Social share:** n/a.

**Other**
- The four counts have no defaults and the statements list starts empty; the example numbers come from demonstration content that is clearly not final.
- Never enter numbers that are not true. Update the counts whenever capacity really changes.

### Navigation (header menu and footers)

The links at the top of every page (the **header**, or menu bar) and the links in the three **footers** (the block of links at the bottom of a page). You edit them here once and every page that shows them follows.

**Where:** **Admin → Globals → Navigation** (address `duhamedia.com/admin/globals/navigation`). It has two **tabs** (the headings across the top of the form): **Header** and **Footers**. Click **Save** when done. Both Admins and Marketing can edit it.

**There is no draft stage here.** A save is live straight away, with no Publish step and no developer needed. Check each link before you click Save.

**SEO:** n/a. Nothing here is a search-result title or description. Links are ordinary links that search engines can follow.

**Editable by marketing**

*Header tab* (**Admin → Globals → Navigation → Header tab**)
- **Menu links**: up to **6** links, shown left to right in the order listed (for example Work, Services, Testimonials, About, FAQ). On phones the same links open from the menu button. Once you have 6, the **Add Link** button is no longer offered.
- **Button**: the highlighted button at the right of the menu, usually "Book a Call". **Leave every part of it empty and no button is shown.** If you fill in any part, the link text and the destination are both needed.
- The header only shows on pages whose **Header** setting is **Standard**. Campaign landing pages (**Logo only**) and Link-in-Bio (**None**) show none of these links.

*Footers tab* (**Admin → Globals → Navigation → Footers tab**)

There are three footers. Which one a page shows is chosen **per page**: **Admin → Collections → Pages → (page) →** the **Footer** setting in the right-hand sidebar (see [Pages](#pages-site-pages)).
- **Standard footer**: used on almost every page. The default.
- **Reduced footer**: only on **Book a Call** and **Thank You**, so visitors stay focused on the next step. The logo, a few links and the legal links.
- **Legal only footer**: on **campaign landing pages**, **Link-in-Bio** and **lead magnets**. Just the small legal links.
- The **company name** in the copyright line and the **brand line** under the logo come from [Site settings](#site-settings) (**Brand & contact** tab), not from here.

What you edit for each footer:
- **Standard footer → Link columns**: up to **3** columns. Each column has a **Column heading** (required, e.g. "Pages") and its own list of **Links**. Open a column to add, remove or reorder the links inside it.
- **Standard footer → Newsletter sign-up**: the small sign-up box in the last column. Three texts: **Heading**, **Line** (the sentence under it) and **Button text**. They start with "Newsletter", "One useful email a month. Numbers included." and "Join". The form it uses is chosen in Site settings.
- **Reduced footer → Links**: a short row of links, e.g. Home, Work, FAQ, Contact.
- **Legal links**: the small links in the bottom bar of **all three** footers, e.g. Privacy, Terms, Cookies, GDPR. On the Legal only footer this bar is the whole footer.

*How to add a link (every list works the same way)*
1. Click **Add Link** (or **Add Column** first, then open it and **Add Link**). A new row opens **collapsed** (closed to one line); click it to open it.
2. Choose the **Link type**:
   - **Page on this site**: then pick the page from the **Page** list. Case studies, articles and lead magnets can be picked too.
   - **Custom address**: then type the **Address**: a full `https://…` address, a `mailto:…` address, or a path on this site starting with `/`, such as `/book-a-call`.
3. Write the **Link text** (the words visitors see). Both the link text and the destination are always required.
4. Tick **Open in a new tab** if the link should open in a separate browser tab (useful for other websites).
5. Click **Save**.

*Reorder and remove*
- **Reorder:** drag a row by its handle (the grip at the left of the row). With a keyboard: click to focus the drag handle, press **Space** to pick the row up, use the **arrow keys** to move it, then press **Space** again to drop it. This works for links, and for footer columns.
- **Remove:** use the row's menu (the **⋯** or trash icon on the row), then **Save**.
- Collapsed rows are labelled with their link text (columns with their heading), so you can tell them apart without opening them.

*If a save is refused*
- Rows start collapsed, so a problem can be hidden inside one. The row with the problem shows a **red badge**. Open it to read the message under the field (for example a missing link text, or an address that is not `https://`, `mailto:` or a `/` path). Fix it and Save again.

**Forms & leads:** n/a here. The newsletter sign-up box in the standard footer submits through the newsletter form chosen in Site settings; where those sign-ups land is covered with the forms unit once it is built.

**Social share:** n/a.

**Other**
- **Deleted or unpublished pages:** the site simply hides any link to a page that has been deleted or is not published, so visitors never hit a dead link. If you **delete a page that a menu links to**, the next time you save Navigation it will ask you to fix or remove that link. Do that, then Save.
- Nothing is pre-filled yet: the lists start empty, so a header or footer with no links shows nothing in that area until you add them. Add the links once the pages exist.
- Changes appear on the site as soon as you save; no rebuild or developer is needed.

### SEO defaults

**SEO** (search engine optimisation) means helping Google and similar search engines understand the site and show it well. This screen holds the site-wide **fallbacks**: the settings used whenever a page has not got its own. Today that is every page, because the per-page SEO tab arrives in a later release. Once it does, any page that fills in its own title, description or share image will use that instead, and anything it leaves empty falls back to what you set here.

**Where:** **Admin → Globals → SEO defaults** (address `duhamedia.com/admin/globals/seo-defaults`). Click **Save** when done. Both Admins and Marketing can edit it.

**There is no draft stage here.** A save is live straight away, with no Publish step and no developer needed. Check spelling before you click Save.

**SEO**
- **Title template** (required, starts as `%s — Duha Media`): how a page's name appears in the browser tab and as the blue headline in Google results.
  - `%s` is a placeholder that the site swaps for the page's own title. With the template `%s — Duha Media`, a page titled "About" shows as "About — Duha Media".
  - Use `%s` **exactly once**. Save is refused with a message if it is missing or appears twice.
- **Default description** (required, up to 155 characters): the grey text under the title in Google results (called the **meta description**), also used in social share cards. It is used for any page that has no description of its own. Keep to 155 characters so Google does not cut it off; the box will not accept more. One or two real sentences about what Duha Media does.
- **Company (for Google)** and **Local business (for Google)** (below) feed what is called **structured data**: facts written in a form Google can read directly. Visitors never see it on the page. It helps Google recognise the business and can improve how it appears in search results.

**Editable by marketing**

All on **Admin → Globals → SEO defaults**; there are no tabs, just one screen of fields.
- **Default social share image** (required): see **Social share** below.
- **Company (for Google)**
  - **Company name**: starts as "Duha Media". Change only if the brand name changes.
  - **Founded**: optional. A real year (`2021`), year and month (`2021-04`) or full date (`2021-04-15`). **Leave it empty unless you know the real date**; a wrong date is refused only for format, not for truth.
  - **Logo**: optional. The logo Google may show beside the company in search results. Pick or upload a square or near-square image, at least 112 × 112 pixels, on a plain background.
- **Local business (for Google)**
  - **Business type**: pick from **Professional service** (recommended) or **Marketing agency**. It starts empty; choose Professional service.
  - **Area served**: starts as "Chicago metropolitan area". Where clients are served.
  - **Opening hours**: optional. **Leave empty unless there are real, set hours.** If you enter some, use the format `Mo-Fr 09:00-17:00` (days Mo Tu We Th Fr Sa Su, 24-hour times). Separate several entries with `;`, for example `Mo-Fr 09:00-17:00; Sa 10:00-14:00`. A wrong format is refused with a message.
  - The business **address** is not entered here. It comes from [Site settings](#site-settings) (**Location** tab), and the company's social profiles come from Site settings (**Brand & contact** tab).
- This screen has no lists, so there is nothing to add, remove or reorder.

**Forms & leads:** n/a.

**Social share**
- When someone shares a link to the site on LinkedIn, Facebook, X or in a message, a preview card appears with a picture. That picture is the **share image** (also called the **OG image**, from "Open Graph", the standard that makes these cards work).
- **Default social share image** is the picture used for any page without its own share image. It is **required**, so the screen cannot be saved without one.
- **Change it:** **Admin → Globals → SEO defaults → Default social share image** → choose an image from Media or upload a new one → **Save**.
- **Size:** at least **1200 × 630 pixels**, landscape. The site crops it to that shape around the image's focal point (see [Media library](#media-library-images)). An image that is too small is refused with a message ("too small for social previews"); upload a bigger one.
- Remember the image needs **Alt** text like any other upload.
- Individual pages will be able to set their own share image once the SEO tab is added to Pages (a later release). Until then this default is used everywhere.
- **Social networks remember previews.** After you change the image, a link that has already been shared may keep showing the old picture for a while. That is the social network's memory, not a fault on the site.

**Other**
- **The image currently used as the default share image cannot be deleted from Media.** Trying shows an error. To remove it, first choose a different image here and Save, then delete the old one in Media.
- Only enter real facts. Company name, area served and business type are the only things filled in or suggested; founding date and opening hours start empty on purpose.
- Changes appear on the site as soon as you save; no rebuild or developer is needed.
- Before the first save, the screen may show only its starting values; the share image has to be chosen before it can be saved.

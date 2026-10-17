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
| Edit scarcity numbers | [fill in once built] |
| Add a redirect | [fill in once built] |
| Edit page copy or images | [fill in once built] |
| Find form submissions and failed deliveries | [fill in once built] |
| Change the booking link | [fill in once built] |
| Send a newsletter broadcast (Resend dashboard steps) | [fill in once built] |
| Change the social-share (OG) image | [fill in once built] |
| Upload an image | **Admin → Collections → Media → Create New** → choose the file → write the **Alt** text (required) → **Save**. See [Media library](#media-library-images). |
| Upload a lead-magnet file (PDF, CSV, Excel, ZIP) | **Admin → Collections → Downloads → Create New** → choose the file → give it a **Title** → **Save**. See [Downloads](#downloads-lead-magnet-files). |
| Add a client logo to the logo strip | **Admin → Collections → Clients → Create New** (or open the client) → **Name**, **Logo** → tick **Show In Logo Strip** → set **Sort Order** → **Publish**. See [Clients](#clients-logo-strips). |
| Add a testimonial or Google review | **Admin → Collections → Testimonials → Create New** → **Quote**, **Author Name** → pick **Source** (Google needs its link and the "word for word" tick) → **Publish**. See [Testimonials and reviews](#testimonials-and-reviews). |
| Add an FAQ | **Admin → Collections → FAQs → Create New** → **Question**, **Answer**, **Category** → set **Sort Order** → **Publish**. See [FAQs](#faqs). |
| Publish a case study | **Admin → Collections → Case studies → (study)** → tick **Client approved the figures** (right-hand sidebar) → **Publish changes**. Only once the client has signed off every number. See [Case studies](#case-studies-the-collection). |
| Review and publish a pipeline draft (article) | **Admin → Collections → Posts** → filter **Status: Draft** → open the draft → check the copy, set **Author** and **Hero image** → **Publish changes**. See [Posts](#posts-articles-and-newsletter-issues). |
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
19. [Review Hub](#19-review-hub)
20. [Legal template](#20-legal-template)
21. [404](#21-404)
- [Site-wide settings (header, footers, contact details)](#site-wide-settings)

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

**Social share:** the 1200 × 630 share size is generated from every uploaded image. Where you choose the default share image is covered under [Site-wide settings](#site-wide-settings) once that part is built.

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

Case studies are a library too, but because each one is a full page of its own, their editing guide lives under [2. Case Study template → Case studies (the collection)](#case-studies-the-collection). The same goes for articles and newsletter issues, whose guide is under [13. DEV-SEO template → Posts](#posts-articles-and-newsletter-issues).

**How drafts work in these four libraries** (the same for all of them):
- **Save draft** stores your work at any time, even when required fields (marked with a red asterisk) are still empty. Visitors never see drafts.
- **Publish** checks that every required field is filled, then makes the item live on the site. Only published items ever appear to visitors. Publishing is always done by a person.
- **Autosave:** as soon as you click **Create New**, the admin saves a blank draft for you and keeps saving as you type. If you start an item and abandon it, delete that blank draft so the list stays tidy.
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

## 1. Homepage

*Not built yet.*

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
- Marketing can delete posts, **including published ones**. To keep a post but take it offline, use the **⋯ (three dots) menu → Unpublish** instead.

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

*Not built yet.*

## 19. Review Hub

*Not built yet.*

## 20. Legal template

*Not built yet.*

## 21. 404

*Not built yet.*

---

## Site-wide settings

Header, footers, contact details, social handles, booking link and default share image.

*Not built yet.*

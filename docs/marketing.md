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

*Not built yet.*

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

*Not built yet.*

## 14. MKT-SEO template

*Not built yet.*

## 15. Campaign LP template

*Not built yet.*

## 16. Newsletter

*Not built yet.*

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

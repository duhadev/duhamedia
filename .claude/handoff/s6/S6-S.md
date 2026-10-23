# S6-S site-settings postLabels (done 2026-10-23)
Files: src/globals/SiteSettings.ts (group `postLabels` "Article and newsletter pages" in Template labels tab; `makeLabelField(defaults)` helper, caseStudyLabels unchanged), src/lib/postLabels.ts (POST_LABEL_DEFAULTS, PostLabels, resolvePostLabels).
Fields (text, max 60, default = placeholder): bylinePrefix "By", bylineOrganisation "Duha Media", publishedPrefix "Published", updatedPrefix "Updated", readTimeSuffix "min read", faqEyebrowSuffix "— common questions", howWeDoItEyebrow "How we do it", issueWord "Issue".
Migration (S6-I1): 8 nullable varchar `site_settings.post_labels_<snake>`.
S6-T1 usage: byline `${bylinePrefix} ${author}, ${bylineOrganisation}`; date line `${publishedPrefix} <date> · ${updatedPrefix} <date> · <n> ${readTimeSuffix}`; faqEyebrowSuffix / howWeDoItEyebrow are FALLBACKS when post.faqHeading / post.howWeDoIt.eyebrow empty.

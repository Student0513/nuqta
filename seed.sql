-- =====================================================================
--  OPTIONAL sample content so the site isn't empty on day one.
--  Every row is marked sample = true and shows a "Sample" tag.
--  Remove them all later from Newsroom -> Manage -> Remove samples.
--  Run AFTER schema.sql, in the SQL Editor.
-- =====================================================================

insert into public.news (title, dek, why, region, status, sources, sample, body, created_at) values
($t$Smog season is back. Here's what the AQI number actually tells you$t$,
 $t$Every November the air quality index climbs past 300 in Punjab's cities. A quick guide to reading the number and what it means for your lungs.$t$,
 $t$Students spend hours commuting and outdoors. Knowing when the index crosses 'hazardous' helps you decide when to mask up or stay in.$t$,
 'Pakistan','Explainer','Sample post. Replace with your own reporting and sources.', true,
 $t$The air quality index (AQI) turns several pollutants into one number from 0 to 500. Anything above 150 is unhealthy for everyone, and above 300 is classed as hazardous.

The main driver in winter is fine particulate matter, PM2.5. These particles are small enough to pass deep into the lungs and the bloodstream.

> A reading of 300 is not a forecast. It is what you are breathing right now.

## What you can do

Check a live AQI reading before you head out, wear a fitted N95 mask on bad days, and keep windows closed during the evening peak.$t$,
 now() - interval '2 hours'),
($t$What a caretaker government can and cannot do$t$,
 $t$Interim setups run the country between an outgoing government and an election. Their powers are narrower than most people think.$t$,
 $t$Caretaker periods come up every election cycle, and the limits on their power decide what can change before people vote.$t$,
 'Pakistan','Analysis','Sample post. Replace with your own reporting and sources.', true,
 $t$A caretaker government exists to keep the state running and to help hold a free and fair election. It is not meant to set long-term policy.

In practice that means routine administration is allowed, while major new decisions are expected to wait for an elected government.$t$,
 now() - interval '5 hours'),
($t$Climate talks, explained in five terms$t$,
 $t$Loss and damage, NDCs, adaptation finance and two more phrases you will hear all month, in plain language.$t$,
 $t$Countries like Pakistan sit on the front line of climate damage, so how these terms are negotiated affects who pays for recovery.$t$,
 'Climate','Explainer','Sample post. Replace with your own reporting and sources.', true, '', now() - interval '8 hours'),
($t$Why a weaker rupee shows up in your grocery bill$t$,
 $t$Fuel, cooking oil and medicine are priced in dollars before they reach the shelf. Here's how an exchange-rate move travels to your kitchen.$t$,
 $t$Inflation hits student budgets first: transport, food and stationery all carry imported costs.$t$,
 'Economy','Explainer','Sample post. Replace with your own reporting and sources.', true, '', now() - interval '1 day 3 hours'),
($t$How fact-checkers verify a viral video in under an hour$t$,
 $t$Reverse image search, shadows, signage and metadata. The routine newsrooms use before a clip is trusted.$t$,
 $t$Most misinformation reaches us as video. A few habits make you much harder to fool.$t$,
 'Tech','Update','Sample post. Replace with your own reporting and sources.', true, '', now() - interval '1 day 9 hours'),
($t$South Asia's water treaties: a short primer$t$,
 $t$Rivers ignore borders. The agreements that share them shape farming, power and diplomacy across the region.$t$,
 $t$Water is the resource most likely to strain relations in South Asia as glaciers shrink.$t$,
 'South Asia','Explainer','Sample post. Replace with your own reporting and sources.', true, '', now() - interval '2 days 6 hours');

insert into public.articles (title, nuqta, dek, section, symbol, author, featured, status, sample, submitted_by, published_at, body) values
($t$Politics Is Not a Spectator Sport$t$, $t$Apathy is a vote too. It just goes to whoever shows up.$t$,
 $t$Young people complain that politics ignores them. Politics is simply responding to who turns up.$t$,
 'Politics','knight','Nuqta Desk', true, 'published', true, null, now() - interval '3 hours',
 $t$Ask a room of students whether politics matters and every hand goes up. Ask how many voted, attended a town hall or wrote to a representative, and the room goes quiet.

That gap is the whole story. Decisions about fees, jobs and the internet we use every day are made by people who count who participates. When young people stay home, they are not neutral. They hand the decision to someone else.

> Staying out of politics is still a political choice, only made by default.

## Showing up is cheaper than you think

Participation is not only voting once every few years. It is reading past the headline, arguing in good faith with a friend, joining a student body or turning up when a local issue is on the table.

**This is a sample piece.** Replace it with your own writing from the Newsroom.$t$),
($t$Who Gets to Tell the Story?$t$, $t$A headline is a decision about whose pain counts.$t$,
 $t$Every news story is shaped by what gets left out. Learning to see the frame is the first media skill.$t$,
 'Media & Narratives','eye','Nuqta Desk', false, 'published', true, null, now() - interval '1 day',
 $t$Two outlets can report the same event with the same facts and leave you with opposite impressions. The difference is the frame: which voice is quoted first, which photo leads, which word describes the crowd.

> Read the story, then read the story about the story.

**This is a sample piece.** Replace it with your own writing from the Newsroom.$t$),
($t$The Doom Scroll Is a Diet$t$, $t$What you consume all day becomes what you think is normal.$t$,
 $t$We count calories and screen time. We rarely count what the feed is teaching us about the world.$t$,
 'Culture','bulb','Nuqta Desk', false, 'published', true, null, now() - interval '3 days',
 $t$An hour of scrolling can carry more outrage than a week of ordinary life. Over time that ratio quietly rewrites our sense of how bad things are and who is to blame.

> You are what you scroll.

**This is a sample piece.** Replace it with your own writing from the Newsroom.$t$),
($t$Chai-Stall Democracy$t$, $t$The best political conversations still happen where nobody is performing.$t$,
 $t$Online debate rewards the loudest take. The roadside dhaba rewards the person who listens.$t$,
 'Society','bubble','Nuqta Desk', false, 'published', true, null, now() - interval '5 days',
 $t$Sit at any chai stall long enough and you will hear sharper analysis of the economy than on most talk shows. People disagree, interrupt, laugh, and somehow leave on good terms.

> Democracy works best at the scale of a conversation.

**This is a sample piece.** Replace it with your own writing from the Newsroom.$t$);

insert into public.prompts (question, context, week, sample) values
($t$Should voting be mandatory for everyone over 18?$t$,
 $t$Some countries fine people who do not vote, and turnout there is far higher. Does compulsory voting strengthen democracy, or does a forced vote mean less than a free one?$t$,
 date_trunc('week', now())::date, true),
($t$Is social media making us more informed, or just more certain?$t$,
 $t$We see more news than any generation before us. Are we understanding more, or only reacting faster?$t$,
 (date_trunc('week', now()) - interval '7 days')::date, true);

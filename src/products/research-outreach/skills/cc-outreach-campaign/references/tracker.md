# Tracker and sending plan

Read this when you build the tracker at the end of a campaign, or when the user asks how to keep their outreach moving. Give the tracker as a table with every contact filled in, then the sending plan. The copy-paste prompt is at the end of this file.

**The tracker**

One row per contact, in the same order as the campaign. Fill in what you know and leave the rest blank for the user.

~~~text
| # | Company | Contact and title | Email (how found) | Hook source checked | Sent | Follow-up 1 due | Follow-up 1 sent | Final note sent | Reply | Next step |
|---|---------|-------------------|-------------------|---------------------|------|-----------------|------------------|-----------------|-------|-----------|
| 1 | [Company] | [Name], [Title] | [Address] (pattern guess) | [ ] | [Date] | [Date + 5 to 7 business days] | [ ] | [ ] | [ ] | [Book call / Try backup address / Try second person] |
~~~

What goes in each column:

- **Email (how found):** "published", "pattern guess" or "verified by the user". Update it once the user checks the address.
- **Hook source checked:** tick it once the user has opened the link and read it.
- **Sent:** the date the first email went out.
- **Follow-up 1 due:** 5 to 7 business days after Sent. If you know today's date, give real dates.
- **Reply:** yes, no, or "bounced".
- **Next step:** one short action. For example "Book the call", "Try the backup address", "Connect on LinkedIn", "Try a second person" or "Move on".

**Statuses to use in the Next step column**

- **Draft:** written, not sent yet
- **Sent:** waiting on a reply
- **Follow-up due:** 5 to 7 business days have passed with no reply
- **Replied:** they wrote back. Reply within one business day and book the call.
- **Bounced:** try the backup pattern, or reach them on LinkedIn
- **Closed:** two follow-ups and no reply, so move on (or try a second person at the same company)

**The sending plan**

- Start with the top 3 to 5 companies.
- Send 2 or 3 emails a day, not all at once. It keeps each one personal and gives the user time to reply to anyone who answers.
- Before each send: verify the address, open the hook's source link, fill any [brackets], and check the spelling of the person's name and the company.
- If there's a posted job, apply through the company's careers page too.
- Follow up after 5 to 7 business days if there's no reply. Send a final note about a week after that. Then stop.
- Block 15 minutes a day to update the tracker and send what's due.

**The legal line (put it under the tracker)**

These are personal, one-to-one emails, not marketing. Use your real name and contact details, never add anyone to a mailing list, and if someone asks you to stop, stop. Follow the spirit of Canada's anti-spam law (CASL) and the US CAN-SPAM Act. This is general guidance, not legal advice.

**Results**

Results vary. Some people reply in a day, some never do, and that's normal. Never tell the user how many replies to expect.

## Build my outreach tracker

**What it does:** Turns your list of contacts into a tracker table with follow-up dates and a simple sending plan.
**When to use it:** You've got your contacts and emails ready, and you want one place to keep track of them.

### Step 1: Build the tracker

~~~text
Build me an outreach tracker as a table.

Today's date: [Today's date]
My contacts (company, name, title, email and how I found it):
[Paste your list of contacts]
The date I plan to send each one (or "2 or 3 a day, starting today"): [Your sending plan]

Columns: # | Company | Contact and title | Email (how found) | Hook source checked | Sent | Follow-up 1 due | Follow-up 1 sent | Final note sent | Reply | Next step

Rules:
- Follow-up 1 is due 5 to 7 business days after each send date. Give real dates.
- Leave the checkboxes and Reply blank for me to fill in.
- Mark any email I haven't verified "(pattern guess)".
Under the table, give me a short sending plan: start with my top 3 to 5, send 2 or 3 a day, follow up once after 5 to 7 business days, send one final note about a week later, then move on.
~~~

**Replace:** [Today's date], [Paste your list of contacts], [Your sending plan]

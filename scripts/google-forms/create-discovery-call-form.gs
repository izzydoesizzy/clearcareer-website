/**
 * Builds the "Book a Discovery Call" Google Form (a copy of the Typeform).
 *
 * HOW TO RUN (2 minutes)
 * 1. Sign in to Google as izzy@joinclearcareer.com.
 * 2. Go to https://script.google.com and click "New project".
 * 3. Delete the sample code, paste this whole file, and click Save.
 * 4. Pick "createDiscoveryCallForm" in the function menu and click Run.
 * 5. Approve the permissions (Forms, Sheets). Google may say the app is unverified:
 *    click Advanced, then "Go to project". It is your own script.
 * 6. Open View > Logs (or Execution log). It prints the form's edit link, share link
 *    and the response sheet.
 *
 * The form is owned by whichever account runs it, so run it as izzy@joinclearcareer.com.
 */

// ── Things you may want to change ──────────────────────────────────────────
var CALENDLY_URL = 'https://calendly.com/clearcareer/discovery-call';
// Your Typeform question 16 names the Job Search Ignition System. Change this
// to 'Land and Level Up' (and update the price wording) if this form is for the new group.
var PROGRAM_NAME = 'Job Search Ignition System';
var INVEST_QUESTION =
  'Are you ready to invest a low four-figure amount in the ' + PROGRAM_NAME + ' to get the results you want?';
var NOT_READY = "I'm not ready to invest in my results";
var READY = "Let's do this!";
var CONSENT_TEXT =
  "Yes, also email me career tips and a short series this week about salary negotiation, the cost of a long search, and ClearCareer's Land and Level Up group. I can unsubscribe at any time.";

function createDiscoveryCallForm() {
  var form = FormApp.create('Book a Discovery Call');
  form
    .setDescription(
      'A few questions so we can make the most of your call. It takes about 5 minutes. ' +
        'Your answers go to ClearCareer only.'
    )
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setProgressBar(true)
    .setConfirmationMessage(
      "Thank you. If you said you're ready, you've already seen your booking link. " +
        "If not, I'll email you a better-fit option. Questions? Reply to any email from izzy@joinclearcareer.com."
    );

  // ── Contact details ──────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Contact details');

  form.addTextItem().setTitle('First name').setRequired(true);
  form.addTextItem().setTitle('Last name').setRequired(false);
  form.addTextItem().setTitle('Phone number').setRequired(false);

  var email = form.addTextItem().setTitle('Email address').setRequired(true);
  email.setValidation(
    FormApp.createTextValidation().requireTextIsEmail().setHelpText('Please enter a valid email address.').build()
  );

  var consent = form.addCheckboxItem();
  consent
    .setTitle('Email permission (optional)')
    .setChoices([consent.createChoice(CONSENT_TEXT)])
    .setRequired(false);

  // ── Job search ───────────────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Your job search');

  form.addParagraphTextItem().setTitle('Job titles you are interested in').setRequired(false);

  var salary = form.addTextItem().setTitle('Target annual salary').setRequired(false);
  salary.setValidation(
    FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).setHelpText('Please enter a number.').build()
  );

  var years = form.addTextItem().setTitle('Years of experience').setRequired(true);
  years.setValidation(
    FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).setHelpText('Please enter a number.').build()
  );

  form
    .addMultipleChoiceItem()
    .setTitle('How long have you been actively job searching?')
    .setChoiceValues([
      'Less than 1 month',
      '1-2 months',
      '3-5 months',
      '6-7 months',
      '8-10 months',
      '11-12 months',
      '1+ years',
    ])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle('How many applications do you submit per week?')
    .setChoiceValues(['None', '0-1', '2-3', '4-5', '6-10', '10-20'])
    .setRequired(true);

  var totalApps = form.addTextItem().setTitle('How many applications have you submitted in total?').setRequired(true);
  totalApps.setValidation(
    FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).setHelpText('Please enter a number.').build()
  );

  var interviews = form.addTextItem().setTitle('How many interview invitations have you received?').setRequired(true);
  interviews.setValidation(
    FormApp.createTextValidation().requireNumberGreaterThanOrEqualTo(0).setHelpText('Please enter a number.').build()
  );

  var struggles = form.addCheckboxItem();
  struggles
    .setTitle('What are your biggest struggles right now? (Pick 1 to 3)')
    .setChoiceValues([
      'Career direction',
      'Experience',
      'Resume writing',
      'Applications',
      'Networking',
      'Interviews',
      'Salary negotiation',
      'Lack of Canadian experience',
    ])
    .showOtherOption(true)
    .setRequired(true)
    .setValidation(
      FormApp.createCheckboxValidation()
        .requireSelectAtMost(3)
        .setHelpText('Please pick no more than 3.')
        .build()
    );

  form.addParagraphTextItem().setTitle('What is your biggest challenge right now, and why?').setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle('Besides landing a job, what else would make this a success for you?')
    .setRequired(true);

  form
    .addScaleItem()
    .setTitle('How motivated are you to make changes?')
    .setBounds(0, 5)
    .setLabels('Very Discouraged', 'Extremely Motivated')
    .setRequired(false);

  // ── Investment and booking (this is the gate) ────────────────────────────
  var bookingPage = null; // created below, but the question needs it, so make the question first

  var investPage = form.addPageBreakItem().setTitle('Investment');
  var invest = form.addMultipleChoiceItem().setTitle(INVEST_QUESTION).setRequired(true);

  // The booking link lives on its own page. Only "Let's do this!" is sent there.
  // "I'm not ready" submits the form straight away, and never sees the link.
  bookingPage = form.addPageBreakItem().setTitle('Last step: book your call');
  bookingPage.setHelpText(
    'Thank you. Press Submit below so I have your answers, then book your time here:\n\n' +
      CALENDLY_URL +
      '\n\nPlease have a credit card nearby on the call, in case we decide it is a fit.'
  );

  invest.setChoices([
    invest.createChoice(NOT_READY, FormApp.PageNavigationType.SUBMIT),
    invest.createChoice(READY, bookingPage),
  ]);

  // ── Save responses in a spreadsheet ──────────────────────────────────────
  var sheet = SpreadsheetApp.create('Book a Discovery Call (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Form created.');
  Logger.log('Edit it:   ' + form.getEditUrl());
  Logger.log('Share it:  ' + form.getPublishedUrl());
  Logger.log('Responses: ' + sheet.getUrl());
}

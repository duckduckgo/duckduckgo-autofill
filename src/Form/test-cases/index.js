export default [
    { html: 'poor-markup-form.html' },
    { html: 'wikipedia_login.html' },
    { html: 'wikipedia_signup.html' },
    { html: 'wikipedia_donation.html' },
    { html: 'amazon_login.html' },
    { html: 'amazon_signup.html' },
    { html: 'amazon_business_signup.html' },
    { html: 'amazon_address.html' },
    { html: 'facebook_login.html' },
    { html: 'facebook_signup.html' },
    { html: 'twitter_login.html', expectedSubmitFalseNegatives: 1 },
    { html: 'twitter_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'], expectedSubmitFalseNegatives: 1 },
    { html: 'fandom_login.html' },
    { html: 'fandom_signup.html', expectedFailures: ['birthday'] },
    { html: 'pinterest_login.html', title: 'Pinterest Login' },
    { html: 'pinterest_signup.html' },
    { html: 'reddit_login.html' },
    { html: 'reddit_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'yelp_login.html' },
    { html: 'yelp_signup.html' },
    { html: 'instagram_login.html' },
    { html: 'instagram_signup.html' },
    { html: 'ebay_login.html' },
    { html: 'ebay_signup.html' },
    { html: 'ebay_checkout.html', expectedFailures: ['unknown', 'unknown'] },
    { html: 'walmart_login.html' },
    { html: 'walmart_signup.html' },
    { html: 'walmart_checkout.html' },
    { html: 'craigslist_account.html' },
    { html: 'healthline_newsletter.html' },
    { html: 'tripadvisor_login.html' },
    { html: 'tripadvisor_signup.html' },
    { html: 'linkedin_login.html' },
    { html: 'linkedin_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'webmd_login.html' },
    { html: 'webmd_signup.html', expectedFailures: ['birthday'] },
    { html: 'netflix_login.html' },
    { html: 'netflix_signup.html' },
    { html: 'apple_login.html', expectedSubmitFalseNegatives: 1 },
    { html: 'apple_signup.html', expectedFailures: ['birthday', 'unknown'], expectedSubmitFalseNegatives: 1 },
    { html: 'apple_checkout.html', expectedSubmitFalseNegatives: 2 },
    { html: 'homedepot_login.html' },
    { html: 'homedepot_signup.html' },
    { html: 'yahoo_login.html', expectedFailures: ['unknown'] },
    { html: 'yahoo_signup.html' },
    { html: 'cnn_newsletter.html' },
    { html: 'etsy_login.html' },
    { html: 'etsy_signup.html' },
    { html: 'etsy_checkout.html' },
    { html: 'google_login.html', expectedSubmitFalseNegatives: 1 },
    { html: 'google_signup.html', expectedFailures: ['username'], expectedSubmitFalseNegatives: 1 },
    { html: 'google_store_checkout.html', expectedSubmitFalseNegatives: 1 },
    { html: 'indeed_login_signup.html' },
    { html: 'target_login.html' },
    { html: 'target_signup.html' },
    { html: 'target_checkout.html' },
    { html: 'microsoft_login.html', expectedSubmitFalseNegatives: 1 },
    { html: 'microsoft_signup.html', expectedFailures: ['username'], expectedSubmitFalsePositives: 1 },
    { html: 'nytimes_login_signup.html' },
    { html: 'mayoclinic_login.html' },
    { html: 'mayoclinic_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'espn_login.html' },
    { html: 'espn_signup.html' },
    { html: 'usps_login.html', expectedSubmitFalseNegatives: 1 },
    { html: 'usps_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'usps_checkout.html', expectedSubmitFalsePositives: 1 },
    { html: 'quizlet_login.html' },
    { html: 'quizlet_signup.html' },
    { html: 'quizlet_checkout.html', expectedSubmitFalseNegatives: 1 },
    { html: 'lowes_login.html' },
    { html: 'lowes_signup.html' },
    { html: 'lowes_checkout.html', expectedSubmitFalseNegatives: 1 },
    { html: 'idme_login.html' },
    { html: 'idme_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'merriamwebster_login.html', expectedSubmitFalseNegatives: 1 },
    { html: 'merriamwebster_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'steam_login.html', expectedSubmitFalseNegatives: 1, expectedSubmitFalsePositives: 1 },
    { html: 'steam_signup.html' },
    { html: 'steam_checkout.html', expectedFailures: ['unknown'], expectedSubmitFalseNegatives: 2 },
    { html: 'mapquest_login.html' },
    { html: 'mapquest_signup.html' },
    { html: 'fox_login.html', expectedSubmitFalsePositives: 1 },
    { html: 'fox_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'allrecipes_login_signup.html' },
    { html: 'quora_login.html' },
    { html: 'quora_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'britannica_login.html' },
    { html: 'britannica_signup.html' },
    { html: 'bestbuy_login.html' },
    { html: 'bestbuy_signup.html' },
    { html: 'bestbuy_checkout.html', expectedSubmitFalseNegatives: 1 },
    { html: 'rottentomatoes_login.html' },
    { html: 'rottentomatoes_signup.html' },
    { html: 'costco_login.html' },
    { html: 'costco_signup.html' },
    { html: 'costco_checkout.html', expectedSubmitFalseNegatives: 1, expectedSubmitFalsePositives: 2 },
    { html: 'kroger_login.html' },
    { html: 'kroger_signup.html' },
    { html: 'kroger_checkout.html', expectedSubmitFalseNegatives: 1 },
    { html: 'wayfair_login_signup.html' },
    { html: 'wayfair_checkout.html' },
    { html: 'chewy_login.html' },
    { html: 'chewy_signup.html' },
    { html: 'chewy_checkout.html', expectedSubmitFalseNegatives: 2 },
    { html: 'everydayoil_checkout.html', expectedSubmitFalseNegatives: 2, expectedSubmitFalsePositives: 4 },
    { html: 'stripeelements_checkout.html', expectedSubmitFalseNegatives: 3 },
    { html: 'litmus_home_search.html' },
    { html: 'litmus_home_new.html' },
    { html: 'asana_tasklist.html' },
    { html: 'asana_search.html' },
    { html: 'aa_login.html' },
    { html: 'hackernews_login_signup.html' },
    { html: 'mkelectricalcontracting_contact.html', expectedSubmitFalseNegatives: 1 },
    { html: 'mbank_login.html', expectedSubmitFalsePositives: 3 },
    { html: 'samash_checkout.html', expectedFailures: ['emailAddress'] },
    { html: 'samash_checkout_international.html' },
    { html: 'samash_login.html' },
    { html: 'samash_signup.html' },
    { html: 'financialtimes_login.html', title: 'Login' },
    { html: 'containerstore_login_signup.html' },
    { html: 'containerstore_forgot_password.html', expectedFailures: ['username'] },
    { html: 'containerstore_newsletter.html' },
    { html: 'containerstore_checkout.html', expectedSubmitFalsePositives: 1, expectedSubmitFalseNegatives: 2 },
    { html: 'containerstore_hidden_contact.html' },
    { html: 'stackoverflow_login.html' },
    { html: 'stackoverflow_signup.html' },
    { html: 'stackoverflow_talent_login.html' },
    { html: 'stackoverflow_talent_contact.html' },
    { html: 'techradar_newsletter.html', title: 'AccessSubscription' },
    { html: 'github_login.html' },
    { html: 'github_signup.html', expectedSubmitFalsePositives: 4 },
    { html: 'imdb_login.html' },
    { html: 'imdb_signup.html' },
    { html: 'kleinanzeigen_login.html' },
    { html: 'kleinanzeigen_signup.html' },
    { html: 'ign_login.html', expectedSubmitFalsePositives: 2 },
    { html: 'ign_signup.html' },
    { html: 'cnbc_login.html' },
    { html: 'cnbc_signup.html' },
    { html: 'cnbc_newsletter.html' },
    { html: 'researchgate_login.html' },
    { html: 'researchgate_signup.html' },
    { html: 'wordreference_newsletter.html' },
    { html: 'rightmove_login.html' },
    { html: 'rightmove_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'infowarsstore_login.html' },
    { html: 'infowarsstore_signup.html' },
    { html: 'infowars_newsletter.html' },
    { html: 'kijiji_login.html' },
    { html: 'kijiji_signup.html' },
    { html: 'leo_login.html' },
    { html: 'leo_signup.html' },
    { html: 'mylo_login.html' },
    { html: 'mylo_signup.html', expectedFailures: ['emailAddress'] },
    { html: 'esquire_newsletter.html' },
    { html: 'wired_login.html' },
    { html: 'wired_signup.html' },
    { html: 'wired_checkout.html', expectedSubmitFalseNegatives: 1 },
    { html: 'wired_newsletter.html' },
    { html: 'tinypass_login.html' },
    { html: 'tinypass_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'apartments_login.html', expectedSubmitFalsePositives: 1 },
    { html: 'apartments_signup.html' },
    { html: 'opticsplanet_login.html' },
    { html: 'opticsplanet_signup.html' },
    { html: 'opticsplanet_checkout.html', expectedSubmitFalsePositives: 5, expectedSubmitFalseNegatives: 1 },
    { html: 'opticsplanet_newsletter.html' },
    { html: 'ifixit_login.html' },
    { html: 'ifixit_signup.html' },
    { html: 'blazetv_login.html' },
    { html: 'blazetv_signup.html' },
    { html: 'blazetv_newsletter.html' },
    { html: 'surly_login.html' },
    { html: 'surly_signup.html' },
    { html: 'surly_contact.html' },
    { html: 'coinmarketcap_login.html', expectedSubmitFalsePositives: 1 },
    { html: 'coinmarketcap_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'coinmarketcap_newsletter.html' },
    { html: '1337x_signup.html' },
    { html: '1337x_login.html' },
    { html: 'reverso_login.html' },
    { html: 'reverso_signup.html' },
    { html: 'usnews_login.html' },
    { html: 'usnews_signup.html' },
    { html: 'usnews_contact.html' },
    { html: 'usnews_newsletter.html' },
    { html: 'babycenter_login.html' },
    { html: 'babycenter_signup.html' },
    { html: 'yourtango_login.html' },
    { html: 'yourtango_signup.html' },
    { html: 'newgrounds_login.html' },
    { html: 'newgrounds_signup.html', expectedFailures: ['birthday'] },
    { html: 'itemfix_login.html' },
    { html: 'itemfix_signup.html', expectedFailures: ['birthday'], expectedSubmitFalseNegatives: 1 },
    { html: 'cookpad_login.html' },
    { html: 'cookpad_signup.html' },
    { html: 'mein_schoener_garten_newsletter.html' },
    { html: 'tripsavvy_newsletter.html' },
    { html: 'fanfiction_login.html' },
    { html: 'fanfiction_signup.html' },
    { html: 'selfcom_newsletter.html' },
    { html: 'gunscom_login.html' },
    { html: 'gunscom_signup.html' },
    { html: 'gunscom_newsletter.html' },
    { html: 'gunscom_newsletter_2.html' },
    { html: 'gartenforum_login.html' },
    { html: 'gartenjournal_newsletter.html' },
    { html: 'dropbox_login.html' },
    { html: 'dropbox_signup.html' },
    { html: 'carmax_login.html' },
    { html: 'carmax_signup.html' },
    { html: 'vulture_login.html' },
    { html: 'vulture_signup.html', expectedSubmitFalseNegatives: 1 },
    { html: 'sydneymorningherald_login.html' },
    { html: 'sydneymorningherald_signup.html' },
    { html: '123rf_login.html' },
    { html: '123rf_signup.html' },
    { html: 'thermoworks_login.html' },
    { html: 'thermoworks_signup.html' },
    { html: 'thermoworks_checkout.html' },
    { html: 'thermoworks_newsletter.html' },
    { html: 'wikihow_login.html' },
    { html: 'wikihow_signup.html' },
    { html: 'airbnb_login_signup.html' },
    { html: 'iqgunder_guest.html', expectedFailures: ['fullName', 'fullName', 'fullName', 'fullName', 'fullName', 'fullName', 'fullName', 'fullName', 'fullName', 'fullName'] },
    { html: 'iqgunder_guest_entry.html', title: 'Fund Formation Portal Login', expectedFailures: ['emailAddress'] },
    { html: 'iqgunder_login.html' },
    { html: 'iqgunder_signup.html' },
    { html: 'gunderassociates_contacts.html' },
    { html: 'websitecarbon.html' },
    { html: 'schwab.html' },
    { html: 'quicksight_login.html' },
    { html: 'godaddy_login.html' },
    { html: 'godaddy_signup.html', expectedSubmitFalsePositives: 1 },
    { html: 'disneyworld_help.html' },
    { html: 'disneyworld_signup.html', expectedFailures: ['birthday'] },
    { html: 'irsgov_refund.html' },
    { html: 'googlecalendar_eventnotification.html' },
    { html: 'givesmart_login.html' },
    { html: 'vancity_login.html' },
    { html: 'expensify.html' },
    { html: 'candidguidestar_checkout_signup.html' },
    { html: 'hulu_account-pin.html' },
    { html: 'poconospa_contact.html' },
    { html: 'statista_login.html' },
    { html: 'statista_signup.html', expectedFailures: ['unknown'] },
    { html: 'sunlife_login.html' },
    { html: 'sunlife_signup.html', expectedFailures: ['birthday'] },
    { html: 'netid_login.html', expectedSubmitFalsePositives: 2 },
    { html: 'evite_checkout-login.html' },
    { html: 'evite_checkout-signup.html' },
    // Issues with buttons here is due to lots of hidden forms and weird markup, they don't affect the actual UX
    { html: 'boardgamearena_signup.html', expectedFailures: ['birthday'], expectedSubmitFalsePositives: 2, expectedSubmitFalseNegatives: 5 },
    { html: 'eventbrite_checkout-signup.html' },
    { html: 'eventbrite_fake-signup.html' },
    { html: 'ryanair_cc-card-name.html' },
    { html: 'paypal_otp.html' },
    { html: 'postnews_login.html' },
    { html: 'airbnb_signup.html' },
    { html: 'cookpad_email-confirmation-code.html', expectedFailures: ['unknown'] },
    { html: 'instagram_email-confirmation-code.html' },
    { html: 'cookpad_signup-second-step.html' },
    { html: 'samash_credit-card.html' }
]

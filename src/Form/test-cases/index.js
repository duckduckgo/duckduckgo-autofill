module.exports = [
    { html: 'poor-markup-form.html' },
    { html: 'wikipedia_login.html' },
    { html: 'wikipedia_signup.html' },
    { html: 'wikipedia_donation.html' },
    { html: 'amazon_login.html' },
    { html: 'amazon_signup.html' },
    { html: 'amazon_address.html' },
    { html: 'facebook_login.html' },
    { html: 'facebook_signup.html' },
    { html: 'twitter_login.html' },
    { html: 'twitter_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'fandom_login.html' },
    { html: 'fandom_signup.html', expectedFailures: ['birthday'] },
    { html: 'pinterest_login.html', title: 'Pinterest Login' },
    { html: 'pinterest_signup.html' },
    { html: 'reddit_login.html' },
    { html: 'reddit_signup.html', expectedFailures: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'] },
    { html: 'yelp_login.html' },
    { html: 'yelp_signup.html' },
    { html: 'instagram_login.html' },
    { html: 'instagram_signup.html' },
    { html: 'ebay_login.html' },
    { html: 'ebay_signup.html' },
    { html: 'ebay_checkout.html', expectedFailures: ['unknown', 'unknown'] },
    { html: 'walmart_login.html' },
    { html: 'walmart_signup.html' },
    { html: 'walmart_checkout.html', expectedFailures: ['unknown', 'unknown'] },
    { html: 'craigslist_account.html' },
    { html: 'healthline_newsletter.html' },
    { html: 'tripadvisor_login.html' },
    { html: 'tripadvisor_signup.html' },
    { html: 'linkedin_login.html' },
    { html: 'linkedin_signup.html' },
    { html: 'webmd_login.html' },
    { html: 'webmd_signup.html', expectedFailures: ['birthday'] },
    { html: 'netflix_login.html' },
    { html: 'netflix_signup.html' },
    { html: 'apple_login.html', expectedFailures: ['username'] },
    { html: 'apple_signup.html', expectedFailures: ['birthday', 'unknown'] },
    { html: 'apple_checkout.html' },
    { html: 'homedepot_login.html' },
    { html: 'homedepot_signup.html' },
    { html: 'yahoo_login.html', expectedFailures: ['unknown'] },
    { html: 'yahoo_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'cnn_newsletter.html' },
    { html: 'etsy_login.html' },
    { html: 'etsy_signup.html' },
    { html: 'etsy_checkout.html' },
    { html: 'google_login.html' },
    { html: 'google_signup.html', expectedFailures: ['username'] },
    { html: 'google_store_checkout.html' },
    { html: 'indeed_login_signup.html' },
    { html: 'target_login.html' },
    { html: 'target_signup.html' },
    { html: 'target_checkout.html' },
    { html: 'microsoft_login.html' },
    { html: 'microsoft_signup.html', expectedFailures: ['username'] },
    { html: 'nytimes_login_signup.html' },
    { html: 'mayoclinic_login.html' },
    { html: 'mayoclinic_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'espn_login.html' },
    { html: 'espn_signup.html' },
    { html: 'usps_login.html' },
    { html: 'usps_signup.html', expectedFailures: ['unknown', 'unknown', 'unknown', 'unknown'] },
    { html: 'usps_checkout.html' },
    { html: 'quizlet_login.html' },
    { html: 'quizlet_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'quizlet_checkout.html' },
    { html: 'lowes_login.html' },
    { html: 'lowes_signup.html' },
    { html: 'lowes_checkout.html' },
    { html: 'idme_login.html', expectedFailures: ['unknown'] },
    { html: 'idme_signup.html' },
    { html: 'merriamwebster_login.html' },
    { html: 'merriamwebster_signup.html' },
    { html: 'steam_login.html', expectedFailures: ['username'] },
    { html: 'steam_signup.html' },
    { html: 'steam_checkout.html', expectedFailures: ['expirationMonth', 'expirationYear', 'addressProvince', 'addressCountryCode', 'unknown', 'unknown', 'addressProvince', 'addressCountryCode', 'cardSecurityCode'] },
    { html: 'mapquest_login.html' },
    { html: 'mapquest_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'fox_login.html' },
    { html: 'fox_signup.html', expectedFailures: ['username', 'birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    { html: 'allrecipes_login_signup.html' },
    { html: 'quora_login.html' },
    { html: 'quora_signup.html' },
    { html: 'britannica_login.html' },
    { html: 'britannica_signup.html' },
    { html: 'bestbuy_login.html' },
    { html: 'bestbuy_signup.html' },
    { html: 'bestbuy_checkout.html' },
    { html: 'rottentomatoes_login.html' },
    { html: 'rottentomatoes_signup.html' },
    { html: 'costco_login.html' },
    { html: 'costco_signup.html' },
    { html: 'costco_checkout.html' },
    { html: 'kroger_login.html' },
    { html: 'kroger_signup.html', expectedFailures: ['unknown'] },
    { html: 'kroger_checkout.html', expectedFailures: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'] },
    { html: 'wayfair_login_signup.html' },
    { html: 'wayfair_checkout.html', expectedFailures: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'] },
    { html: 'chewy_login.html', expectedFailures: ['username'] },
    { html: 'chewy_signup.html' },
    { html: 'chewy_checkout.html' },
    { html: 'everydayoil_checkout.html', expectedFailures: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'] },
    { html: 'stripeelements_checkout.html' },
    { html: 'litmus_home_search.html' },
    { html: 'litmus_home_new.html', expectedFailures: ['unknown', 'unknown'] },
    { html: 'asana_tasklist.html' },
    { html: 'asana_search.html' },
    { html: 'aa_login.html' },
    { html: 'hackernews_login_signup.html' }
]

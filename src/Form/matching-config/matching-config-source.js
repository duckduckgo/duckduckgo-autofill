const {selectors} = require('./selectors-css.js')

/**
 * This is here to mimic what Remote Configuration might look like
 * later on.
 */
const matchingConfiguration = {
    /** @type {MatcherConfiguration} */
    matchers: {
        fields: {
            unknown: {
                type: 'unknown',
                strategies: {
                    ddgMatcher: 'unknown'
                }
            },
            emailAddress: {
                type: 'emailAddress',
                strategies: {
                    cssSelector: 'emailAddress',
                    ddgMatcher: 'emailAddress',
                    vendorRegex: 'email'
                }
            },
            password: {
                type: 'password',
                strategies: {
                    cssSelector: 'password',
                    ddgMatcher: 'password'
                }
            },
            username: {
                type: 'username',
                strategies: {
                    cssSelector: 'username',
                    ddgMatcher: 'username'
                }
            },
            firstName: {
                type: 'firstName',
                strategies: {
                    cssSelector: 'firstName',
                    ddgMatcher: 'firstName',
                    vendorRegex: 'given-name'
                }
            },
            middleName: {
                type: 'middleName',
                strategies: {
                    cssSelector: 'middleName',
                    ddgMatcher: 'middleName',
                    vendorRegex: 'additional-name'
                }
            },
            lastName: {
                type: 'lastName',
                strategies: {
                    cssSelector: 'lastName',
                    ddgMatcher: 'lastName',
                    vendorRegex: 'family-name'
                }
            },
            fullName: {
                type: 'fullName',
                strategies: {
                    cssSelector: 'fullName',
                    ddgMatcher: 'fullName',
                    vendorRegex: 'name'
                }
            },
            phone: {
                type: 'phone',
                strategies: {
                    cssSelector: 'phone',
                    ddgMatcher: 'phone',
                    vendorRegex: 'tel'
                }
            },
            addressStreet: {
                type: 'addressStreet',
                strategies: {
                    cssSelector: 'addressStreet',
                    ddgMatcher: 'addressStreet',
                    vendorRegex: 'address-line1'
                }
            },
            addressStreet2: {
                type: 'addressStreet2',
                strategies: {
                    cssSelector: 'addressStreet2',
                    ddgMatcher: 'addressStreet2',
                    vendorRegex: 'address-line2'
                }
            },
            addressCity: {
                type: 'addressCity',
                strategies: {
                    cssSelector: 'addressCity',
                    ddgMatcher: 'addressCity',
                    vendorRegex: 'address-level2'
                }
            },
            addressProvince: {
                type: 'addressProvince',
                strategies: {
                    cssSelector: 'addressProvince',
                    ddgMatcher: 'addressProvince',
                    vendorRegex: 'address-level1'
                }
            },
            addressPostalCode: {
                type: 'addressPostalCode',
                strategies: {
                    cssSelector: 'addressPostalCode',
                    ddgMatcher: 'addressPostalCode',
                    vendorRegex: 'postal-code'
                }
            },
            addressCountryCode: {
                type: 'addressCountryCode',
                strategies: {
                    cssSelector: 'addressCountryCode',
                    ddgMatcher: 'addressCountryCode',
                    vendorRegex: 'country'
                }
            },
            birthdayDay: {
                type: 'birthdayDay',
                strategies: {
                    cssSelector: 'birthdayDay',
                    ddgMatcher: 'birthdayDay'
                }
            },
            birthdayMonth: {
                type: 'birthdayMonth',
                strategies: {
                    cssSelector: 'birthdayMonth',
                    ddgMatcher: 'birthdayMonth'
                }
            },
            birthdayYear: {
                type: 'birthdayYear',
                strategies: {
                    cssSelector: 'birthdayYear',
                    ddgMatcher: 'birthdayYear'
                }
            },
            cardName: {
                type: 'cardName',
                strategies: {
                    cssSelector: 'cardName',
                    ddgMatcher: 'cardName',
                    vendorRegex: 'cc-name'
                }
            },
            cardNumber: {
                type: 'cardNumber',
                strategies: {
                    cssSelector: 'cardNumber',
                    ddgMatcher: 'cardNumber',
                    vendorRegex: 'cc-number'
                }
            },
            cardSecurityCode: {
                type: 'cardSecurityCode',
                strategies: {
                    cssSelector: 'cardSecurityCode',
                    ddgMatcher: 'cardSecurityCode'
                }
            },
            expirationMonth: {
                type: 'expirationMonth',
                strategies: {
                    cssSelector: 'expirationMonth',
                    ddgMatcher: 'expirationMonth',
                    vendorRegex: 'cc-exp-month'
                }
            },
            expirationYear: {
                type: 'expirationYear',
                strategies: {
                    cssSelector: 'expirationYear',
                    ddgMatcher: 'expirationYear',
                    vendorRegex: 'cc-exp-year'
                }
            },
            expiration: {
                type: 'expiration',
                strategies: {
                    cssSelector: 'expiration',
                    ddgMatcher: 'expiration',
                    vendorRegex: 'cc-exp'
                }
            }
        },
        lists: {
            unknown: ['unknown'],
            emailAddress: ['emailAddress'],
            password: ['password'],
            username: ['username'],
            cc: ['cardName', 'cardNumber', 'cardSecurityCode', 'expirationMonth', 'expirationYear', 'expiration'],
            id: [
                'firstName',
                'middleName',
                'lastName',
                'fullName',
                'phone',
                'addressStreet',
                'addressStreet2',
                'addressCity',
                'addressProvince',
                'addressPostalCode',
                'addressCountryCode',
                'birthdayDay',
                'birthdayMonth',
                'birthdayYear'
            ]
        }
    },
    strategies: {
        /** @type {{selectors: Record<CSSSelectorNames| string, string | string[]>}} */
        cssSelector: {selectors},
        /** @type {DDGMatcherConfigurationInternal} */
        ddgMatcher: {
            matchers: {
                unknown: {
                    match: 'search|filter|subject|title|captcha|mfa|2fa|(two|2).?factor|one-time|otp' +
                        // Italian
                        '|cerca|filtr|oggetto|titolo|(due|2|più).?fattori' +
                        // German
                        '|suche|filtern|betreff' +
                        // Dutch
                        '|zoeken|filter|onderwerp|titel' +
                        // French
                        '|chercher|filtrer|objet|titre|authentification multifacteur|double authentification|à usage unique' +
                        // Spanish
                        '|busca|busqueda|filtra|dos pasos|un solo uso' +
                        // Swedish
                        '|sök|filter|ämne|multifaktorsautentisering|tvåfaktorsautentisering|två.?faktor|engångs',
                    skip: 'phone|mobile|email|password'
                },
                emailAddress: {
                    match: '.mail\\b|apple.?id' +
                        // Italian
                        '|posta elettronica' +
                        // Dutch
                        '|e.?mailadres' +
                        // Spanish
                        '|correo electr|correo-e|^correo$' +
                        // Swedish
                        '|\\be.?post|e.?postadress',
                    skip: 'phone|(first.?|last.?)name|number|code',
                    forceUnknown: 'search|filter|subject|title|\\btab\\b|otp'
                },
                password: {
                    match: 'password' +
                        // German
                        '|passwort|kennwort' +
                        // Dutch
                        '|wachtwoord' +
                        // French
                        '|mot de passe' +
                        // Spanish
                        '|clave|contraseña' +
                        // Swedish
                        '|lösenord',
                    skip: 'email|one-time|error|hint',
                    forceUnknown: 'captcha|mfa|2fa|two factor|otp|pin'
                },
                newPassword: {
                    match: 'new|re.?(enter|type)|repeat|update|reset\\b'
                },
                currentPassword: {
                    match: 'current|old|previous|expired|existing'
                },
                username: {
                    match: '(user|account|online.?id|log(i|o)n|net)((.)?(name|i.?d.?|log(i|o)n).?)?(.?((or|/).+|\\*|:)( required)?)?$' +
                        // Italian
                        '|(nome|id|login).?utente|(nome|id) (dell.)?account|codice cliente' +
                        // German
                        '|nutzername|anmeldename' +
                        // Dutch
                        '|gebruikersnaam' +
                        // French
                        '|nom d.utilisateur|identifiant|pseudo' +
                        // Spanish
                        '|usuari|cuenta|identificador|apodo' +
                            // in Spanish dni and nie stand for id number, often used as username
                            '|\\bdni\\b|\\bnie\\b| del? documento|documento de identidad' +
                        // Swedish
                        '|användarnamn|kontonamn|användar-id',
                    skip: 'phone',
                    forceUnknown: 'search|policy' +
                        // Github assignee picker
                        '|choose a user\\b'
                },

                // CC
                cardName: {match: '(card.*name|name.*card)|(card.*holder|holder.*card)|(card.*owner|owner.*card)'},
                cardNumber: {match: 'card.*number|number.*card', skip: 'phone', forceUnknown: 'plus'},
                cardSecurityCode: {match: 'security.?code|card.?verif|cvv|csc|cvc|cv2|card id'},
                expirationMonth: {
                    match: '(card|\\bcc\\b)?.?(exp(iry|iration)?)?.?(month|\\bmm\\b(?![.\\s/-]yy))',
                    skip: 'mm[/\\s.\\-_—–]|check'
                },
                expirationYear: {match: '(card|\\bcc\\b)?.?(exp(iry|iration)?)?.?(year|yy)', skip: 'mm[/\\s.\\-_—–]|check'},
                expiration: {
                    match: '(\\bmm\\b|\\b\\d\\d\\b)[/\\s.\\-_—–](\\byy|\\bjj|\\baa|\\b\\d\\d)|\\bexp|\\bvalid(idity| through| until)',
                    skip: 'invalid|^dd/|check'
                },

                // Identities
                firstName: {
                    match: '(first|given|fore).?name' +
                        // Italian
                        '|\\bnome',
                    skip: 'last|cognome|completo'
                },
                middleName: {
                    match: '(middle|additional).?name'
                },
                lastName: {
                    match: '(last|family|sur)[^i]?name' +
                        // Italian
                        '|cognome',
                    skip: 'first|\\bnome'
                },
                fullName: {
                    match: '^(full.?|whole\\s|first.*last\\s|real\\s|contact.?)?name\\b' +
                        // Italian
                        '|\\bnome',
                    forceUnknown: 'company|org|item'
                },
                phone: {
                    match: 'phone|mobile' +
                        // Italian
                        '|telefono|cellulare',
                    skip: 'code|pass|country',
                    forceUnknown: 'ext|type|otp'
                },
                addressStreet: {
                    match: 'address',
                    forceUnknown: '\\bip\\b|duck|web|url',
                    skip: 'address.*(2|two|3|three)|email|log.?in|sign.?in|civico'
                },
                addressStreet2: {
                    match: 'address.*(2|two)|apartment|\\bapt\\b|\\bflat\\b|\\bline.*(2|two)',
                    forceUnknown: '\\bip\\b|duck',
                    skip: 'email|log.?in|sign.?in'
                },
                addressCity: {match: 'city|town|città|comune', skip: '\\bzip\\b|\\bcap\\b', forceUnknown: 'vatican'},
                addressProvince: {match: 'state|province|region|county|provincia|regione', forceUnknown: 'united', skip: 'country'},
                addressPostalCode: {match: '\\bzip\\b|postal\\b|post.?code|\\bcap\\b|codice postale'},
                addressCountryCode: {match: 'country|\\bnation\\b|nazione|paese'},
                birthdayDay: {match: '(birth.*day|day.*birth)', skip: 'month|year'},
                birthdayMonth: {match: '(birth.*month|month.*birth)', skip: 'year'},
                birthdayYear: {match: '(birth.*year|year.*birth)'},
                loginRegex: {
                    match:
                        'sign(ing)?.?[io]n(?!g)|log.?[io]n|log.?out|unsubscri|(forgot(ten)?|reset) (your )?password|password (forgotten|lost)' +
                        '|mfa-submit-form' + // fix chase.com
                        '|unlock|logged in as' + // fix bitwarden
                        // Italian
                        '|entra|accedi|accesso|resetta password|password dimenticata|dimenticato la password|recuper[ao] password' +
                        // German
                        '|(ein|aus)loggen|anmeld(eformular|ung|efeld)|abmelden|passwort (vergessen|verloren)|zugang| zugangsformular|einwahl' +
                        // Dutch
                        '|inloggen' +
                        // French
                        '|se (dé)?connecter|(dé)?connexion|récupérer ((mon|ton|votre|le) )?mot de passe|mot de passe (oublié|perdu)' +
                        // Spanish
                        '|clave(?! su)|olvidó su (clave|contraseña)|.*sesión|conect(arse|ado)|conéctate|acce(de|so)|entrar' +
                        // Swedish
                        '|logga (in|ut)|avprenumerera|avregistrera|glömt lösenord|återställ lösenord'
                },
                signupRegex: {
                    match: 'sign(ing)?.?up|join|\\bregist(er|ration)|newsletter|\\bsubscri(be|ption)|contact|create|start|enroll|settings|preferences|profile|update|checkout|purchase|buy|^order|schedule|estimate|request|new.?customer|(confirm|re.?(type|enter)|repeat) password|password confirm' +
                        // Italian
                        '|iscri(viti|zione)|registra(ti|zione)|(?:nuovo|crea(?:zione)?) account|contatt(?:ac)i|sottoscriv|sottoscrizione|compra|acquist(a|o)|ordin[aeio]|richie(?:di|sta)|(?:conferma|ripeti) password|inizia|nuovo cliente|impostazioni|preferenze|profilo|aggiorna|paga' +
                        // German
                        '|registrier(ung|en)|profil (anlegen|erstellen)| nachrichten|verteiler|neukunde|neuer (kunde|benutzer|nutzer)|passwort wiederholen|anmeldeseite' +
                        // Dutch
                        '|nieuwsbrief|aanmaken|profiel' +
                        // French
                        '|s.inscrire|inscription|s.abonner|créer|préférences|profil|mise à jour|payer|ach(eter|at)| nouvel utilisateur|(confirmer|réessayer) ((mon|ton|votre|le) )?mot de passe' +
                        // Spanish
                        '|regis(trarse|tro)|regístrate|inscr(ibirse|ipción|íbete)|solicitar|crea(r cuenta)?|nueva cuenta|nuevo (cliente|usuario)|preferencias|perfil|lista de correo' +
                        // Swedish
                        '|registrer(a|ing)|(nytt|öppna) konto|nyhetsbrev|prenumer(era|ation)|kontakt|skapa|starta|inställningar|min (sida|kundvagn)|uppdatera|till kassan|gäst|köp|beställ|schemalägg|ny kund|(repetera|bekräfta) lösenord'
                },
                conservativeSignupRegex: {
                    match: 'sign.?up|join|register|enroll|(create|new).+account|newsletter|subscri(be|ption)|settings|preferences|profile|update' +
                        // Italian
                        '|iscri(viti|zione)|registra(ti|zione)|(?:nuovo|crea(?:zione)?) account|contatt(?:ac)?i|sottoscriv|sottoscrizione|impostazioni|preferenze|aggiorna' +
                        // German
                        '|anmeld(en|ung)|registrier(en|ung)|neukunde|neuer (kunde|benutzer|nutzer)' +
                        // Dutch
                        '|registreren|eigenschappen|profiel|bijwerken' +
                        // French
                        '|s.inscrire|inscription|s.abonner|abonnement|préférences|profil|créer un compte' +
                        // Spanish
                        '|regis(trarse|tro)|regístrate|inscr(ibirse|ipción|íbete)|crea(r cuenta)?|nueva cuenta|nuevo (cliente|usuario)|preferencias|perfil|lista de correo' +
                        // Swedish
                        '|registrer(a|ing)|(nytt|öppna) konto|nyhetsbrev|prenumer(era|ation)|kontakt|skapa|starta|inställningar|min (sida|kundvagn)|uppdatera'
                },
                resetPasswordLink: {
                    match: '(forgot(ten)?|reset|don\'t remember) (your )?password|password forgotten' +
                        // Italian
                        '|password dimenticata|reset(?:ta) password|recuper[ao] password' +
                        // German
                        '|(vergessen|verloren|verlegt|wiederherstellen) passwort' +
                        // Dutch
                        '|wachtwoord (vergeten|reset)' +
                        // French
                        '|(oublié|récupérer) ((mon|ton|votre|le) )?mot de passe|mot de passe (oublié|perdu)' +
                        // Spanish
                        '|re(iniciar|cuperar) (contraseña|clave)|olvid(ó su|aste tu|é mi) (contraseña|clave)|recordar( su)? (contraseña|clave)' +
                        // Swedish
                        '|glömt lösenord|återställ lösenord'
                },
                loginProvidersRegex: {
                    match: ' with ' +
                        // Italian and Spanish
                        '| con ' +
                        // German
                        '| mit ' +
                        // Dutch
                        '| met ' +
                        // French
                        '| avec '
                },
                submitButtonRegex: {
                    match: 'submit|send|confirm|save|continue|next|sign|log.?([io])n|buy|purchase|check.?out|subscribe|donate|update|\\bset\\b' +
                        // Italian
                        '|invia|conferma|salva|continua|entra|acced|accesso|compra|paga|sottoscriv|registra|dona' +
                        // German
                        '|senden|\\bja\\b|bestätigen|weiter|nächste|kaufen|bezahlen|spenden' +
                        // Dutch
                        '|versturen|verzenden|opslaan|volgende|koop|kopen|voeg toe|aanmelden' +
                        // French
                        '|envoyer|confirmer|sauvegarder|continuer|suivant|signer|connexion|acheter|payer|s.abonner|donner' +
                        // Spanish
                        '|enviar|confirmar|registrarse|continuar|siguiente|comprar|donar' +
                        // Swedish
                        '|skicka|bekräfta|spara|fortsätt|nästa|logga in|köp|handla|till kassan|registrera|donera'
                },
                submitButtonUnlikelyRegex: {
                    match: 'facebook|twitter|google|apple|cancel|show|toggle|reveal|hide|print|back|already' +
                        // Italian
                        '|annulla|mostra|nascondi|stampa|indietro|già' +
                        // German
                        '|abbrechen|passwort|zeigen|verbergen|drucken|zurück' +
                        // Dutch
                        '|annuleer|wachtwoord|toon|vorige' +
                        // French
                        '|annuler|mot de passe|montrer|cacher|imprimer|retour|déjà' +
                        // Spanish
                        '|anular|cancelar|imprimir|cerrar' +
                        // Swedish
                        '|avbryt|lösenord|visa|dölj|skirv ut|tillbaka|redan'
                }
            }
        },
        /**
         * @type {VendorRegexConfiguration}
         */
        vendorRegex: {
            /** @type {Record<keyof VendorRegexRules, RegExp | null>} */
            rules: {
                email: null,
                tel: null,
                organization: null,
                'street-address': null,
                'address-line1': null,
                'address-line2': null,
                'address-line3': null,
                'address-level2': null,
                'address-level1': null,
                'postal-code': null,
                country: null,
                'cc-name': null,
                name: null,
                'given-name': null,
                'additional-name': null,
                'family-name': null,
                'cc-number': null,
                'cc-exp-month': null,
                'cc-exp-year': null,
                'cc-exp': null,
                'cc-type': null
            },
            ruleSets: [
                //= ========================================================================
                // Firefox-specific rules
                {
                    'address-line1': 'addrline1|address_1',
                    'address-line2': 'addrline2|address_2',
                    'address-line3': 'addrline3|address_3',
                    'address-level1': 'land', // de-DE
                    'additional-name': 'apellido.?materno|lastlastname',
                    'cc-name':
                        'accountholdername' +
                        '|titulaire', // fr-FR
                    'cc-number': '(cc|kk)nr', // de-DE
                    'cc-exp-month': '(cc|kk)month', // de-DE
                    'cc-exp-year': '(cc|kk)year', // de-DE
                    'cc-type': 'type' +
                        '|kartenmarke' // de-DE
                },

                //= ========================================================================
                // These are the rules used by Bitwarden [0], converted into RegExp form.
                // [0] https://github.com/bitwarden/browser/blob/c2b8802201fac5e292d55d5caf3f1f78088d823c/src/services/autofill.service.ts#L436
                {
                    email: '(^e-?mail$)|(^email-?address$)',

                    tel:
                        '(^phone$)' +
                        '|(^mobile$)' +
                        '|(^mobile-?phone$)' +
                        '|(^tel$)' +
                        '|(^telephone$)' +
                        '|(^phone-?number$)',

                    organization:
                        '(^company$)' +
                        '|(^company-?name$)' +
                        '|(^organization$)' +
                        '|(^organization-?name$)',

                    'street-address':
                        '(^address$)' +
                        '|(^street-?address$)' +
                        '|(^addr$)' +
                        '|(^street$)' +
                        '|(^mailing-?addr(ess)?$)' + // Modified to not grab lines, below
                        '|(^billing-?addr(ess)?$)' + // Modified to not grab lines, below
                        '|(^mail-?addr(ess)?$)' + // Modified to not grab lines, below
                        '|(^bill-?addr(ess)?$)', // Modified to not grab lines, below

                    'address-line1':
                        '(^address-?1$)' +
                        '|(^address-?line-?1$)' +
                        '|(^addr-?1$)' +
                        '|(^street-?1$)',

                    'address-line2':
                        '(^address-?2$)' +
                        '|(^address-?line-?2$)' +
                        '|(^addr-?2$)' +
                        '|(^street-?2$)',

                    'address-line3':
                        '(^address-?3$)' +
                        '|(^address-?line-?3$)' +
                        '|(^addr-?3$)' +
                        '|(^street-?3$)',

                    'address-level2':
                        '(^city$)' +
                        '|(^town$)' +
                        '|(^address-?level-?2$)' +
                        '|(^address-?city$)' +
                        '|(^address-?town$)',

                    'address-level1':
                        '(^state$)' +
                        '|(^province$)' +
                        '|(^provence$)' +
                        '|(^address-?level-?1$)' +
                        '|(^address-?state$)' +
                        '|(^address-?province$)',

                    'postal-code':
                        '(^postal$)' +
                        '|(^zip$)' +
                        '|(^zip2$)' +
                        '|(^zip-?code$)' +
                        '|(^postal-?code$)' +
                        '|(^post-?code$)' +
                        '|(^address-?zip$)' +
                        '|(^address-?postal$)' +
                        '|(^address-?code$)' +
                        '|(^address-?postal-?code$)' +
                        '|(^address-?zip-?code$)',

                    country:
                        '(^country$)' +
                        '|(^country-?code$)' +
                        '|(^country-?name$)' +
                        '|(^address-?country$)' +
                        '|(^address-?country-?name$)' +
                        '|(^address-?country-?code$)',

                    name: '(^name$)|full-?name|your-?name',

                    'given-name':
                        '(^f-?name$)' +
                        '|(^first-?name$)' +
                        '|(^given-?name$)' +
                        '|(^first-?n$)',

                    'additional-name':
                        '(^m-?name$)' +
                        '|(^middle-?name$)' +
                        '|(^additional-?name$)' +
                        '|(^middle-?initial$)' +
                        '|(^middle-?n$)' +
                        '|(^middle-?i$)',

                    'family-name':
                        '(^l-?name$)' +
                        '|(^last-?name$)' +
                        '|(^s-?name$)' +
                        '|(^surname$)' +
                        '|(^family-?name$)' +
                        '|(^family-?n$)' +
                        '|(^last-?n$)',

                    'cc-name':
                        'cc-?name' +
                        '|card-?name' +
                        '|cardholder-?name' +
                        '|cardholder' +
                        // "|(^name$)" + // Removed to avoid overwriting "name", above.
                        '|(^nom$)',

                    'cc-number':
                        'cc-?number' +
                        '|cc-?num' +
                        '|card-?number' +
                        '|card-?num' +
                        '|(^number$)' +
                        '|(^cc$)' +
                        '|cc-?no' +
                        '|card-?no' +
                        '|(^credit-?card$)' +
                        '|numero-?carte' +
                        '|(^carte$)' +
                        '|(^carte-?credit$)' +
                        '|num-?carte' +
                        '|cb-?num',

                    'cc-exp':
                        '(^cc-?exp$)' +
                        '|(^card-?exp$)' +
                        '|(^cc-?expiration$)' +
                        '|(^card-?expiration$)' +
                        '|(^cc-?ex$)' +
                        '|(^card-?ex$)' +
                        '|(^card-?expire$)' +
                        '|(^card-?expiry$)' +
                        '|(^validite$)' +
                        '|(^expiration$)' +
                        '|(^expiry$)' +
                        '|mm-?yy' +
                        '|mm-?yyyy' +
                        '|yy-?mm' +
                        '|yyyy-?mm' +
                        '|expiration-?date' +
                        '|payment-?card-?expiration' +
                        '|(^payment-?cc-?date$)',

                    'cc-exp-month':
                        '(^exp-?month$)' +
                        '|(^cc-?exp-?month$)' +
                        '|(^cc-?month$)' +
                        '|(^card-?month$)' +
                        '|(^cc-?mo$)' +
                        '|(^card-?mo$)' +
                        '|(^exp-?mo$)' +
                        '|(^card-?exp-?mo$)' +
                        '|(^cc-?exp-?mo$)' +
                        '|(^card-?expiration-?month$)' +
                        '|(^expiration-?month$)' +
                        '|(^cc-?mm$)' +
                        '|(^cc-?m$)' +
                        '|(^card-?mm$)' +
                        '|(^card-?m$)' +
                        '|(^card-?exp-?mm$)' +
                        '|(^cc-?exp-?mm$)' +
                        '|(^exp-?mm$)' +
                        '|(^exp-?m$)' +
                        '|(^expire-?month$)' +
                        '|(^expire-?mo$)' +
                        '|(^expiry-?month$)' +
                        '|(^expiry-?mo$)' +
                        '|(^card-?expire-?month$)' +
                        '|(^card-?expire-?mo$)' +
                        '|(^card-?expiry-?month$)' +
                        '|(^card-?expiry-?mo$)' +
                        '|(^mois-?validite$)' +
                        '|(^mois-?expiration$)' +
                        '|(^m-?validite$)' +
                        '|(^m-?expiration$)' +
                        '|(^expiry-?date-?field-?month$)' +
                        '|(^expiration-?date-?month$)' +
                        '|(^expiration-?date-?mm$)' +
                        '|(^exp-?mon$)' +
                        '|(^validity-?mo$)' +
                        '|(^exp-?date-?mo$)' +
                        '|(^cb-?date-?mois$)' +
                        '|(^date-?m$)',

                    'cc-exp-year':
                        '(^exp-?year$)' +
                        '|(^cc-?exp-?year$)' +
                        '|(^cc-?year$)' +
                        '|(^card-?year$)' +
                        '|(^cc-?yr$)' +
                        '|(^card-?yr$)' +
                        '|(^exp-?yr$)' +
                        '|(^card-?exp-?yr$)' +
                        '|(^cc-?exp-?yr$)' +
                        '|(^card-?expiration-?year$)' +
                        '|(^expiration-?year$)' +
                        '|(^cc-?yy$)' +
                        '|(^cc-?y$)' +
                        '|(^card-?yy$)' +
                        '|(^card-?y$)' +
                        '|(^card-?exp-?yy$)' +
                        '|(^cc-?exp-?yy$)' +
                        '|(^exp-?yy$)' +
                        '|(^exp-?y$)' +
                        '|(^cc-?yyyy$)' +
                        '|(^card-?yyyy$)' +
                        '|(^card-?exp-?yyyy$)' +
                        '|(^cc-?exp-?yyyy$)' +
                        '|(^expire-?year$)' +
                        '|(^expire-?yr$)' +
                        '|(^expiry-?year$)' +
                        '|(^expiry-?yr$)' +
                        '|(^card-?expire-?year$)' +
                        '|(^card-?expire-?yr$)' +
                        '|(^card-?expiry-?year$)' +
                        '|(^card-?expiry-?yr$)' +
                        '|(^an-?validite$)' +
                        '|(^an-?expiration$)' +
                        '|(^annee-?validite$)' +
                        '|(^annee-?expiration$)' +
                        '|(^expiry-?date-?field-?year$)' +
                        '|(^expiration-?date-?year$)' +
                        '|(^cb-?date-?ann$)' +
                        '|(^expiration-?date-?yy$)' +
                        '|(^expiration-?date-?yyyy$)' +
                        '|(^validity-?year$)' +
                        '|(^exp-?date-?year$)' +
                        '|(^date-?y$)',

                    'cc-type':
                        '(^cc-?type$)' +
                        '|(^card-?type$)' +
                        '|(^card-?brand$)' +
                        '|(^cc-?brand$)' +
                        '|(^cb-?type$)'
                },

                //= ========================================================================
                // These rules are from Chromium source codes [1]. Most of them
                // converted to JS format have the same meaning with the original ones
                // except the first line of "address-level1".
                // [1] https://source.chromium.org/chromium/chromium/src/+/master:components/autofill/core/common/autofill_regex_constants.cc
                {
                    // ==== Email ====
                    email:
                        'e.?mail' +
                        '|courriel' + // fr
                        '|correo.*electr(o|ó)nico' + // es-ES
                        '|メールアドレス' + // ja-JP
                        '|Электронной.?Почты' + // ru
                        '|邮件|邮箱' + // zh-CN
                        '|電郵地址' + // zh-TW
                        '|ഇ-മെയില്‍|ഇലക്ട്രോണിക്.?' +
                        'മെയിൽ' + // ml
                        '|ایمیل|پست.*الکترونیک' + // fa
                        '|ईमेल|इलॅक्ट्रॉनिक.?मेल' + // hi
                        '|(\\b|_)eposta(\\b|_)' + // tr
                        '|(?:이메일|전자.?우편|[Ee]-?mail)(.?주소)?', // ko-KR

                    // ==== Telephone ====
                    tel:
                        'phone|mobile|contact.?number' +
                        '|telefonnummer' + // de-DE
                        '|telefono|teléfono' + // es
                        '|telfixe' + // fr-FR
                        '|電話' + // ja-JP
                        '|telefone|telemovel' + // pt-BR, pt-PT
                        '|телефон' + // ru
                        '|मोबाइल' + // hi for mobile
                        '|(\\b|_|\\*)telefon(\\b|_|\\*)' + // tr
                        '|电话' + // zh-CN
                        '|മൊബൈല്‍' + // ml for mobile
                        '|(?:전화|핸드폰|휴대폰|휴대전화)(?:.?번호)?', // ko-KR

                    // ==== Address Fields ====
                    organization:
                        'company|business|organization|organisation' +
                        // '|(?<!con)firma' + // de-DE // // todo: not supported in safari
                        '|empresa' + // es
                        '|societe|société' + // fr-FR
                        '|ragione.?sociale' + // it-IT
                        '|会社' + // ja-JP
                        '|название.?компании' + // ru
                        '|单位|公司' + // zh-CN
                        '|شرکت' + // fa
                        '|회사|직장', // ko-KR

                    'street-address': 'streetaddress|street-address',

                    'address-line1':
                        '^address$|address[_-]?line[_-]?(1|one)|address1|addr1|street' +
                        '|(?:shipping|billing)address$' +
                        '|strasse|straße|hausnummer|housenumber' + // de-DE
                        '|house.?name' + // en-GB
                        '|direccion|dirección' + // es
                        '|adresse' + // fr-FR
                        '|indirizzo' + // it-IT
                        '|^住所$|住所1' + // ja-JP
                        // '|morada|((?<!identificação do )endereço)' + // pt-BR, pt-PT // todo: not supported in safari
                        '|Адрес' + // ru
                        '|地址' + // zh-CN
                        '|(\\b|_)adres(?! (başlığı(nız)?|tarifi))(\\b|_)' + // tr
                        '|^주소.?$|주소.?1', // ko-KR

                    'address-line2':
                        'address[_-]?line(2|two)|address2|addr2|street|suite|unit(?!e)' + // Firefox adds `(?!e)` to unit to skip `United State`
                        '|adresszusatz|ergänzende.?angaben' + // de-DE
                        '|direccion2|colonia|adicional' + // es
                        '|addresssuppl|complementnom|appartement' + // fr-FR
                        '|indirizzo2' + // it-IT
                        '|住所2' + // ja-JP
                        '|complemento|addrcomplement' + // pt-BR, pt-PT
                        '|Улица' + // ru
                        '|地址2' + // zh-CN
                        '|주소.?2', // ko-KR

                    'address-line3':
                        'address[_-]?line(3|three)|address3|addr3|street|suite|unit(?!e)' + // Firefox adds `(?!e)` to unit to skip `United State`
                        '|adresszusatz|ergänzende.?angaben' + // de-DE
                        '|direccion3|colonia|adicional' + // es
                        '|addresssuppl|complementnom|appartement' + // fr-FR
                        '|indirizzo3' + // it-IT
                        '|住所3' + // ja-JP
                        '|complemento|addrcomplement' + // pt-BR, pt-PT
                        '|Улица' + // ru
                        '|地址3' + // zh-CN
                        '|주소.?3', // ko-KR

                    'address-level2':
                        'city|town' +
                        '|\\bort\\b|stadt' + // de-DE
                        '|suburb' + // en-AU
                        '|ciudad|provincia|localidad|poblacion' + // es
                        '|ville|commune' + // fr-FR
                        '|localit(a|à)|citt(a|à)' + // it-IT
                        '|市区町村' + // ja-JP
                        '|cidade' + // pt-BR, pt-PT
                        '|Город' + // ru
                        '|市' + // zh-CN
                        '|分區' + // zh-TW
                        '|شهر' + // fa
                        '|शहर' + // hi for city
                        '|ग्राम|गाँव' + // hi for village
                        '|നഗരം|ഗ്രാമം' + // ml for town|village
                        '|((\\b|_|\\*)([İii̇]l[cç]e(miz|niz)?)(\\b|_|\\*))' + // tr
                        '|^시[^도·・]|시[·・]?군[·・]?구', // ko-KR

                    'address-level1':
                    // '(?<!(united|hist|history).?)state|county|region|province' + // todo: not supported in safari
                        'county|region|province' +
                        '|county|principality' + // en-UK
                        '|都道府県' + // ja-JP
                        '|estado|provincia' + // pt-BR, pt-PT
                        '|область' + // ru
                        '|省' + // zh-CN
                        '|地區' + // zh-TW
                        '|സംസ്ഥാനം' + // ml
                        '|استان' + // fa
                        '|राज्य' + // hi
                        '|((\\b|_|\\*)(eyalet|[şs]ehir|[İii̇]limiz|kent)(\\b|_|\\*))' + // tr
                        '|^시[·・]?도', // ko-KR

                    'postal-code':
                        'zip|postal|post.*code|pcode' +
                        '|pin.?code' + // en-IN
                        '|postleitzahl' + // de-DE
                        '|\\bcp\\b' + // es
                        '|\\bcdp\\b' + // fr-FR
                        '|\\bcap\\b' + // it-IT
                        '|郵便番号' + // ja-JP
                        '|codigo|codpos|\\bcep\\b' + // pt-BR, pt-PT
                        '|Почтовый.?Индекс' + // ru
                        '|पिन.?कोड' + // hi
                        '|പിന്‍കോഡ്' + // ml
                        '|邮政编码|邮编' + // zh-CN
                        '|郵遞區號' + // zh-TW
                        '|(\\b|_)posta kodu(\\b|_)' + // tr
                        '|우편.?번호', // ko-KR

                    country:
                        'country|countries' +
                        '|país|pais' + // es
                        '|(\\b|_)land(\\b|_)(?!.*(mark.*))' + // de-DE landmark is a type in india.
                        // '|(?<!(入|出))国' + // ja-JP // todo: not supported in safari
                        '|国家' + // zh-CN
                        '|국가|나라' + // ko-KR
                        '|(\\b|_)(ülke|ulce|ulke)(\\b|_)' + // tr
                        '|کشور', // fa

                    // ==== Name Fields ====
                    'cc-name':
                        'card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*card' +
                        '|(?:card|cc).?name|cc.?full.?name' +
                        '|karteninhaber' + // de-DE
                        '|nombre.*tarjeta' + // es
                        '|nom.*carte' + // fr-FR
                        '|nome.*cart' + // it-IT
                        '|名前' + // ja-JP
                        '|Имя.*карты' + // ru
                        '|信用卡开户名|开户名|持卡人姓名' + // zh-CN
                        '|持卡人姓名', // zh-TW

                    name:
                        '^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name' +
                        '|name.*first.*last|firstandlastname' +
                        '|nombre.*y.*apellidos' + // es
                        '|^nom(?!bre)\\b' + // fr-FR
                        '|お名前|氏名' + // ja-JP
                        '|^nome' + // pt-BR, pt-PT
                        '|نام.*نام.*خانوادگی' + // fa
                        '|姓名' + // zh-CN
                        '|(\\b|_|\\*)ad[ı]? soyad[ı]?(\\b|_|\\*)' + // tr
                        '|성명', // ko-KR

                    'given-name':
                        'first.*name|initials|fname|first$|given.*name' +
                        '|vorname' + // de-DE
                        '|nombre' + // es
                        '|forename|prénom|prenom' + // fr-FR
                        '|名' + // ja-JP
                        '|\\bnome' + // pt-BR, pt-PT
                        '|Имя' + // ru
                        '|نام' + // fa
                        '|이름' + // ko-KR
                        '|പേര്' + // ml
                        '|(\\b|_|\\*)(isim|ad|ad(i|ı|iniz|ınız)?)(\\b|_|\\*)' + // tr
                        '|नाम', // hi

                    'additional-name':
                        'middle.*name|mname|middle$|middle.*initial|m\\.i\\.|mi$|\\bmi\\b',

                    'family-name':
                        'last.*name|lname|surname|last$|secondname|family.*name' +
                        '|nachname' + // de-DE
                        '|apellidos?' + // es
                        '|famille|^nom(?!bre)' + // fr-FR
                        '|cognome' + // it-IT
                        '|姓' + // ja-JP
                        '|apelidos|surename|sobrenome' + // pt-BR, pt-PT
                        '|Фамилия' + // ru
                        '|نام.*خانوادگی' + // fa
                        '|उपनाम' + // hi
                        '|മറുപേര്' + // ml
                        '|(\\b|_|\\*)(soyisim|soyad(i|ı|iniz|ınız)?)(\\b|_|\\*)' + // tr
                        '|\\b성(?:[^명]|\\b)', // ko-KR

                    // ==== Credit Card Fields ====
                    // Note: `cc-name` expression has been moved up, above `name`, in
                    // order to handle specialization through ordering.
                    'cc-number':
                        '(add)?(?:card|cc|acct).?(?:number|#|no|num|field)' +
                        // '|(?<!telefon|haus|person|fødsels)nummer' + // de-DE, sv-SE, no // todo: not supported in safari
                        '|カード番号' + // ja-JP
                        '|Номер.*карты' + // ru
                        '|信用卡号|信用卡号码' + // zh-CN
                        '|信用卡卡號' + // zh-TW
                        '|카드' + // ko-KR
                        // es/pt/fr
                        '|(numero|número|numéro)(?!.*(document|fono|phone|réservation))',

                    'cc-exp-month':
                        // 'expir|exp.*mo|exp.*date|ccmonth|cardmonth|addmonth' + // todo: Decide if we need any of this
                        'gueltig|gültig|monat' + // de-DE
                        '|fecha' + // es
                        '|date.*exp' + // fr-FR
                        '|scadenza' + // it-IT
                        '|有効期限' + // ja-JP
                        '|validade' + // pt-BR, pt-PT
                        '|Срок действия карты' + // ru
                        '|月', // zh-CN

                    'cc-exp-year':
                        // 'exp|^/|(add)?year' + // todo: Decide if we need any of this
                        'ablaufdatum|gueltig|gültig|jahr' + // de-DE
                        '|fecha' + // es
                        '|scadenza' + // it-IT
                        '|有効期限' + // ja-JP
                        '|validade' + // pt-BR, pt-PT
                        '|Срок действия карты' + // ru
                        '|年|有效期', // zh-CN

                    'cc-exp':
                        'expir|exp.*date|^expfield$' +
                        '|gueltig|gültig' + // de-DE
                        '|fecha' + // es
                        '|date.*exp' + // fr-FR
                        '|scadenza' + // it-IT
                        '|有効期限' + // ja-JP
                        '|validade' + // pt-BR, pt-PT
                        '|Срок действия карты' // ru
                }
            ]
        }
    }
}

module.exports = { matchingConfiguration }

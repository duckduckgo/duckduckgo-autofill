 // TODO(sjbarag): read from JS module generated from JSON files, probably.
const translations = {
  en: {
    "hello": {
      title: "hello, {name}",
      note: "Says hi to a person.",
    },
    "usePersonalDuckAddr": {
      title: "Use {email}",
      note: "Shown when a user can choose their personal @duck.com address.",
    },
    "blockEmailTrackers": {
      title: "Block email trackers",
      note: "Shown when a user can choose their personal @duck.com address on native platforms.",
    }
  },
  xa: {
    "hello": {
      title: "h33llllo, {name}",
      note: "Says hi to a person.",
    },
    "usePersonalDuckAddr": {
      title: "Ü55££ {email}",
      note: "Shown when a user can choose their personal @duck.com address.",
    },
    "blockEmailTrackers": {
      title: "Bl000ck €m@@@i1il1l träáåck33rr55",
      note: "Shown when a user can choose their personal @duck.com address on native platforms.",
    }
  },
};

export function getTranslator(locale) {
  let library = translations[locale];
  if (library == null) {
    console.warn(`Received unsupported locale '${locale}'. Falling back to 'en'.`);
    library = translations.en;
  }

  return function t(id, opts) {
    return translateImpl(library, id, opts);
  }
};

function translateImpl(library, id, opts) {
  const msg = library[id];
  // Fall back to the message ID if an unsupported message is provided.
  if (!msg) { return id; }

  // Fast path: return the translated string directly if no replacements are provided.
  if (opts == null) {
    return msg.title;
  }

  // Repeatedly replace all instances of '{ SOME_REPLACEMENT_NAME }' with the corresponding value.
  let out = msg.title;
  for (const [ name, value ] of Object.entries(opts)) {
    out = out.replaceAll(`{${name}}`, value);
  }
  return out;
}

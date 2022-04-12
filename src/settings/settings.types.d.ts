interface Settings {
    featureToggles: FeatureTogglesSettings
}

type json = typeof import("./settings.schema.json");
type props = json['definitions']['FeatureToggles']['properties'];

// This is a list of known feature toggles, derived from the schema file
type FeatureTogglesSettings = {
    [K in keyof props]: boolean
}

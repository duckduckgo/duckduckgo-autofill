interface Settings {
    featureToggles: FeatureTogglesSettings
}

type json = typeof import("./schema.featureToggles.json");
type props = json['properties'];

// This is a list of known feature toggles, derived from the schema file
type FeatureTogglesSettings = {
    [K in keyof props]: boolean
}

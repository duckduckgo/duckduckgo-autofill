interface Settings {
    featureToggles: FeatureTogglesSettings
}

// be VERY careful here - the path is not validated by TSC
type json = typeof import("../schema/settings.schema.json");
type props = json['properties']['featureToggles']['properties'];

// This is a list of known feature toggles, derived from the schema file
type FeatureTogglesSettings = {
    [K in keyof props]: boolean
}


import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';


export default class RemoteRules extends ConfigFeature {
    constructor(name, args) {
        super(name, args);
        console.log('DEEP remote rules', this.featureSettings);
    }
}

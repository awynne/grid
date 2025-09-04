"use strict";
// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings supabase_settings}
*/
class Settings extends cdktf.TerraformResource {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a Settings resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Settings to import
    * @param importFromId The id of the existing Settings that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Settings to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase_settings", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings supabase_settings} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options SettingsConfig
    */
    constructor(scope, id, config) {
        super(scope, id, {
            terraformResourceType: 'supabase_settings',
            terraformGeneratorMetadata: {
                providerName: 'supabase',
                providerVersion: '1.5.1',
                providerVersionConstraint: '~> 1.0'
            },
            provider: config.provider,
            dependsOn: config.dependsOn,
            count: config.count,
            lifecycle: config.lifecycle,
            provisioners: config.provisioners,
            connection: config.connection,
            forEach: config.forEach
        });
        this._api = config.api;
        this._auth = config.auth;
        this._database = config.database;
        this._network = config.network;
        this._pooler = config.pooler;
        this._projectRef = config.projectRef;
        this._storage = config.storage;
    }
    get api() {
        return this.getStringAttribute('api');
    }
    set api(value) {
        this._api = value;
    }
    resetApi() {
        this._api = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get apiInput() {
        return this._api;
    }
    get auth() {
        return this.getStringAttribute('auth');
    }
    set auth(value) {
        this._auth = value;
    }
    resetAuth() {
        this._auth = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get authInput() {
        return this._auth;
    }
    get database() {
        return this.getStringAttribute('database');
    }
    set database(value) {
        this._database = value;
    }
    resetDatabase() {
        this._database = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get databaseInput() {
        return this._database;
    }
    // id - computed: true, optional: false, required: false
    get id() {
        return this.getStringAttribute('id');
    }
    get network() {
        return this.getStringAttribute('network');
    }
    set network(value) {
        this._network = value;
    }
    resetNetwork() {
        this._network = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get networkInput() {
        return this._network;
    }
    get pooler() {
        return this.getStringAttribute('pooler');
    }
    set pooler(value) {
        this._pooler = value;
    }
    resetPooler() {
        this._pooler = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get poolerInput() {
        return this._pooler;
    }
    get projectRef() {
        return this.getStringAttribute('project_ref');
    }
    set projectRef(value) {
        this._projectRef = value;
    }
    // Temporarily expose input value. Use with caution.
    get projectRefInput() {
        return this._projectRef;
    }
    get storage() {
        return this.getStringAttribute('storage');
    }
    set storage(value) {
        this._storage = value;
    }
    resetStorage() {
        this._storage = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get storageInput() {
        return this._storage;
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
        return {
            api: cdktf.stringToTerraform(this._api),
            auth: cdktf.stringToTerraform(this._auth),
            database: cdktf.stringToTerraform(this._database),
            network: cdktf.stringToTerraform(this._network),
            pooler: cdktf.stringToTerraform(this._pooler),
            project_ref: cdktf.stringToTerraform(this._projectRef),
            storage: cdktf.stringToTerraform(this._storage),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            api: {
                value: cdktf.stringToHclTerraform(this._api),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            auth: {
                value: cdktf.stringToHclTerraform(this._auth),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            database: {
                value: cdktf.stringToHclTerraform(this._database),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            network: {
                value: cdktf.stringToHclTerraform(this._network),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            pooler: {
                value: cdktf.stringToHclTerraform(this._pooler),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            project_ref: {
                value: cdktf.stringToHclTerraform(this._projectRef),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            storage: {
                value: cdktf.stringToHclTerraform(this._storage),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
        };
        // remove undefined attributes
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.Settings = Settings;
// =================
// STATIC PROPERTIES
// =================
Settings.tfResourceType = "supabase_settings";
//# sourceMappingURL=index.js.map
"use strict";
// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseProvider = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs supabase}
*/
class SupabaseProvider extends cdktf.TerraformProvider {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a SupabaseProvider resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the SupabaseProvider to import
    * @param importFromId The id of the existing SupabaseProvider that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the SupabaseProvider to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs supabase} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options SupabaseProviderConfig = {}
    */
    constructor(scope, id, config = {}) {
        super(scope, id, {
            terraformResourceType: 'supabase',
            terraformGeneratorMetadata: {
                providerName: 'supabase',
                providerVersion: '1.5.1',
                providerVersionConstraint: '~> 1.0'
            },
            terraformProviderSource: 'supabase/supabase'
        });
        this._accessToken = config.accessToken;
        this._endpoint = config.endpoint;
        this._alias = config.alias;
    }
    get accessToken() {
        return this._accessToken;
    }
    set accessToken(value) {
        this._accessToken = value;
    }
    resetAccessToken() {
        this._accessToken = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get accessTokenInput() {
        return this._accessToken;
    }
    get endpoint() {
        return this._endpoint;
    }
    set endpoint(value) {
        this._endpoint = value;
    }
    resetEndpoint() {
        this._endpoint = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get endpointInput() {
        return this._endpoint;
    }
    get alias() {
        return this._alias;
    }
    set alias(value) {
        this._alias = value;
    }
    resetAlias() {
        this._alias = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get aliasInput() {
        return this._alias;
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
        return {
            access_token: cdktf.stringToTerraform(this._accessToken),
            endpoint: cdktf.stringToTerraform(this._endpoint),
            alias: cdktf.stringToTerraform(this._alias),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            access_token: {
                value: cdktf.stringToHclTerraform(this._accessToken),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            endpoint: {
                value: cdktf.stringToHclTerraform(this._endpoint),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            alias: {
                value: cdktf.stringToHclTerraform(this._alias),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
        };
        // remove undefined attributes
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.SupabaseProvider = SupabaseProvider;
// =================
// STATIC PROPERTIES
// =================
SupabaseProvider.tfResourceType = "supabase";
//# sourceMappingURL=index.js.map
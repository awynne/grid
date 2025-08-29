"use strict";
// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.RailwayProvider = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs railway}
*/
class RailwayProvider extends cdktf.TerraformProvider {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a RailwayProvider resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the RailwayProvider to import
    * @param importFromId The id of the existing RailwayProvider that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the RailwayProvider to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs railway} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options RailwayProviderConfig = {}
    */
    constructor(scope, id, config = {}) {
        super(scope, id, {
            terraformResourceType: 'railway',
            terraformGeneratorMetadata: {
                providerName: 'railway',
                providerVersion: '0.5.2',
                providerVersionConstraint: '~> 0.1'
            },
            terraformProviderSource: 'terraform-community-providers/railway'
        });
        this._token = config.token;
        this._alias = config.alias;
    }
    get token() {
        return this._token;
    }
    set token(value) {
        this._token = value;
    }
    resetToken() {
        this._token = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get tokenInput() {
        return this._token;
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
            token: cdktf.stringToTerraform(this._token),
            alias: cdktf.stringToTerraform(this._alias),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            token: {
                value: cdktf.stringToHclTerraform(this._token),
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
exports.RailwayProvider = RailwayProvider;
// =================
// STATIC PROPERTIES
// =================
RailwayProvider.tfResourceType = "railway";
//# sourceMappingURL=index.js.map
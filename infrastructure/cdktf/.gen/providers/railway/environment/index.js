"use strict";
// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment railway_environment}
*/
class Environment extends cdktf.TerraformResource {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a Environment resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Environment to import
    * @param importFromId The id of the existing Environment that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Environment to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_environment", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment railway_environment} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options EnvironmentConfig
    */
    constructor(scope, id, config) {
        super(scope, id, {
            terraformResourceType: 'railway_environment',
            terraformGeneratorMetadata: {
                providerName: 'railway',
                providerVersion: '0.5.2',
                providerVersionConstraint: '~> 0.1'
            },
            provider: config.provider,
            dependsOn: config.dependsOn,
            count: config.count,
            lifecycle: config.lifecycle,
            provisioners: config.provisioners,
            connection: config.connection,
            forEach: config.forEach
        });
        this._name = config.name;
        this._projectId = config.projectId;
    }
    // ==========
    // ATTRIBUTES
    // ==========
    // id - computed: true, optional: false, required: false
    get id() {
        return this.getStringAttribute('id');
    }
    get name() {
        return this.getStringAttribute('name');
    }
    set name(value) {
        this._name = value;
    }
    // Temporarily expose input value. Use with caution.
    get nameInput() {
        return this._name;
    }
    get projectId() {
        return this.getStringAttribute('project_id');
    }
    set projectId(value) {
        this._projectId = value;
    }
    // Temporarily expose input value. Use with caution.
    get projectIdInput() {
        return this._projectId;
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
        return {
            name: cdktf.stringToTerraform(this._name),
            project_id: cdktf.stringToTerraform(this._projectId),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            name: {
                value: cdktf.stringToHclTerraform(this._name),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            project_id: {
                value: cdktf.stringToHclTerraform(this._projectId),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
        };
        // remove undefined attributes
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.Environment = Environment;
// =================
// STATIC PROPERTIES
// =================
Environment.tfResourceType = "railway_environment";
//# sourceMappingURL=index.js.map
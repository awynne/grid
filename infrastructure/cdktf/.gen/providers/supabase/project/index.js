"use strict";
// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project supabase_project}
*/
class Project extends cdktf.TerraformResource {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a Project resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Project to import
    * @param importFromId The id of the existing Project that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Project to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase_project", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project supabase_project} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options ProjectConfig
    */
    constructor(scope, id, config) {
        super(scope, id, {
            terraformResourceType: 'supabase_project',
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
        this._databasePassword = config.databasePassword;
        this._instanceSize = config.instanceSize;
        this._name = config.name;
        this._organizationId = config.organizationId;
        this._region = config.region;
    }
    get databasePassword() {
        return this.getStringAttribute('database_password');
    }
    set databasePassword(value) {
        this._databasePassword = value;
    }
    // Temporarily expose input value. Use with caution.
    get databasePasswordInput() {
        return this._databasePassword;
    }
    // id - computed: true, optional: false, required: false
    get id() {
        return this.getStringAttribute('id');
    }
    get instanceSize() {
        return this.getStringAttribute('instance_size');
    }
    set instanceSize(value) {
        this._instanceSize = value;
    }
    resetInstanceSize() {
        this._instanceSize = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get instanceSizeInput() {
        return this._instanceSize;
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
    get organizationId() {
        return this.getStringAttribute('organization_id');
    }
    set organizationId(value) {
        this._organizationId = value;
    }
    // Temporarily expose input value. Use with caution.
    get organizationIdInput() {
        return this._organizationId;
    }
    get region() {
        return this.getStringAttribute('region');
    }
    set region(value) {
        this._region = value;
    }
    // Temporarily expose input value. Use with caution.
    get regionInput() {
        return this._region;
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
        return {
            database_password: cdktf.stringToTerraform(this._databasePassword),
            instance_size: cdktf.stringToTerraform(this._instanceSize),
            name: cdktf.stringToTerraform(this._name),
            organization_id: cdktf.stringToTerraform(this._organizationId),
            region: cdktf.stringToTerraform(this._region),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            database_password: {
                value: cdktf.stringToHclTerraform(this._databasePassword),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            instance_size: {
                value: cdktf.stringToHclTerraform(this._instanceSize),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            name: {
                value: cdktf.stringToHclTerraform(this._name),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            organization_id: {
                value: cdktf.stringToHclTerraform(this._organizationId),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            region: {
                value: cdktf.stringToHclTerraform(this._region),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
        };
        // remove undefined attributes
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.Project = Project;
// =================
// STATIC PROPERTIES
// =================
Project.tfResourceType = "supabase_project";
//# sourceMappingURL=index.js.map
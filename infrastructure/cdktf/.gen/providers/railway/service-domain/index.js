"use strict";
// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceDomain = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain railway_service_domain}
*/
class ServiceDomain extends cdktf.TerraformResource {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a ServiceDomain resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the ServiceDomain to import
    * @param importFromId The id of the existing ServiceDomain that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the ServiceDomain to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_service_domain", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain railway_service_domain} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options ServiceDomainConfig
    */
    constructor(scope, id, config) {
        super(scope, id, {
            terraformResourceType: 'railway_service_domain',
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
        this._environmentId = config.environmentId;
        this._serviceId = config.serviceId;
        this._subdomain = config.subdomain;
    }
    // ==========
    // ATTRIBUTES
    // ==========
    // domain - computed: true, optional: false, required: false
    get domain() {
        return this.getStringAttribute('domain');
    }
    get environmentId() {
        return this.getStringAttribute('environment_id');
    }
    set environmentId(value) {
        this._environmentId = value;
    }
    // Temporarily expose input value. Use with caution.
    get environmentIdInput() {
        return this._environmentId;
    }
    // id - computed: true, optional: false, required: false
    get id() {
        return this.getStringAttribute('id');
    }
    // project_id - computed: true, optional: false, required: false
    get projectId() {
        return this.getStringAttribute('project_id');
    }
    get serviceId() {
        return this.getStringAttribute('service_id');
    }
    set serviceId(value) {
        this._serviceId = value;
    }
    // Temporarily expose input value. Use with caution.
    get serviceIdInput() {
        return this._serviceId;
    }
    get subdomain() {
        return this.getStringAttribute('subdomain');
    }
    set subdomain(value) {
        this._subdomain = value;
    }
    // Temporarily expose input value. Use with caution.
    get subdomainInput() {
        return this._subdomain;
    }
    // suffix - computed: true, optional: false, required: false
    get suffix() {
        return this.getStringAttribute('suffix');
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
        return {
            environment_id: cdktf.stringToTerraform(this._environmentId),
            service_id: cdktf.stringToTerraform(this._serviceId),
            subdomain: cdktf.stringToTerraform(this._subdomain),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            environment_id: {
                value: cdktf.stringToHclTerraform(this._environmentId),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            service_id: {
                value: cdktf.stringToHclTerraform(this._serviceId),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
            subdomain: {
                value: cdktf.stringToHclTerraform(this._subdomain),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
        };
        // remove undefined attributes
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.ServiceDomain = ServiceDomain;
// =================
// STATIC PROPERTIES
// =================
ServiceDomain.tfResourceType = "railway_service_domain";
//# sourceMappingURL=index.js.map
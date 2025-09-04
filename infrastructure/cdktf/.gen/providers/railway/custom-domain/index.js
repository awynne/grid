"use strict";
// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDomain = void 0;
const cdktf = require("cdktf");
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain railway_custom_domain}
*/
class CustomDomain extends cdktf.TerraformResource {
    // ==============
    // STATIC Methods
    // ==============
    /**
    * Generates CDKTF code for importing a CustomDomain resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the CustomDomain to import
    * @param importFromId The id of the existing CustomDomain that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the CustomDomain to import is found
    */
    static generateConfigForImport(scope, importToId, importFromId, provider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_custom_domain", importId: importFromId, provider });
    }
    // ===========
    // INITIALIZER
    // ===========
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain railway_custom_domain} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options CustomDomainConfig
    */
    constructor(scope, id, config) {
        super(scope, id, {
            terraformResourceType: 'railway_custom_domain',
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
        this._domain = config.domain;
        this._environmentId = config.environmentId;
        this._serviceId = config.serviceId;
    }
    // ==========
    // ATTRIBUTES
    // ==========
    // dns_record_value - computed: true, optional: false, required: false
    get dnsRecordValue() {
        return this.getStringAttribute('dns_record_value');
    }
    get domain() {
        return this.getStringAttribute('domain');
    }
    set domain(value) {
        this._domain = value;
    }
    // Temporarily expose input value. Use with caution.
    get domainInput() {
        return this._domain;
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
    // host_label - computed: true, optional: false, required: false
    get hostLabel() {
        return this.getStringAttribute('host_label');
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
    // zone - computed: true, optional: false, required: false
    get zone() {
        return this.getStringAttribute('zone');
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
        return {
            domain: cdktf.stringToTerraform(this._domain),
            environment_id: cdktf.stringToTerraform(this._environmentId),
            service_id: cdktf.stringToTerraform(this._serviceId),
        };
    }
    synthesizeHclAttributes() {
        const attrs = {
            domain: {
                value: cdktf.stringToHclTerraform(this._domain),
                isBlock: false,
                type: "simple",
                storageClassType: "string",
            },
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
        };
        // remove undefined attributes
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.CustomDomain = CustomDomain;
// =================
// STATIC PROPERTIES
// =================
CustomDomain.tfResourceType = "railway_custom_domain";
//# sourceMappingURL=index.js.map
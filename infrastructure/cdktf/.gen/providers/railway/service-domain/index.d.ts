import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface ServiceDomainConfig extends cdktf.TerraformMetaArguments {
    /**
    * Identifier of the environment the service domain belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain#environment_id ServiceDomain#environment_id}
    */
    readonly environmentId: string;
    /**
    * Identifier of the service the service domain belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain#service_id ServiceDomain#service_id}
    */
    readonly serviceId: string;
    /**
    * Subdomain of the service domain.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain#subdomain ServiceDomain#subdomain}
    */
    readonly subdomain: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain railway_service_domain}
*/
export declare class ServiceDomain extends cdktf.TerraformResource {
    static readonly tfResourceType = "railway_service_domain";
    /**
    * Generates CDKTF code for importing a ServiceDomain resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the ServiceDomain to import
    * @param importFromId The id of the existing ServiceDomain that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the ServiceDomain to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service_domain railway_service_domain} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options ServiceDomainConfig
    */
    constructor(scope: Construct, id: string, config: ServiceDomainConfig);
    get domain(): string;
    private _environmentId?;
    get environmentId(): string;
    set environmentId(value: string);
    get environmentIdInput(): string | undefined;
    get id(): string;
    get projectId(): string;
    private _serviceId?;
    get serviceId(): string;
    set serviceId(value: string);
    get serviceIdInput(): string | undefined;
    private _subdomain?;
    get subdomain(): string;
    set subdomain(value: string);
    get subdomainInput(): string | undefined;
    get suffix(): string;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
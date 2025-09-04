import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface CustomDomainConfig extends cdktf.TerraformMetaArguments {
    /**
    * Custom domain.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain#domain CustomDomain#domain}
    */
    readonly domain: string;
    /**
    * Identifier of the environment the custom domain belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain#environment_id CustomDomain#environment_id}
    */
    readonly environmentId: string;
    /**
    * Identifier of the service the custom domain belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain#service_id CustomDomain#service_id}
    */
    readonly serviceId: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain railway_custom_domain}
*/
export declare class CustomDomain extends cdktf.TerraformResource {
    static readonly tfResourceType = "railway_custom_domain";
    /**
    * Generates CDKTF code for importing a CustomDomain resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the CustomDomain to import
    * @param importFromId The id of the existing CustomDomain that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the CustomDomain to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/custom_domain railway_custom_domain} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options CustomDomainConfig
    */
    constructor(scope: Construct, id: string, config: CustomDomainConfig);
    get dnsRecordValue(): string;
    private _domain?;
    get domain(): string;
    set domain(value: string);
    get domainInput(): string | undefined;
    private _environmentId?;
    get environmentId(): string;
    set environmentId(value: string);
    get environmentIdInput(): string | undefined;
    get hostLabel(): string;
    get id(): string;
    get projectId(): string;
    private _serviceId?;
    get serviceId(): string;
    set serviceId(value: string);
    get serviceIdInput(): string | undefined;
    get zone(): string;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
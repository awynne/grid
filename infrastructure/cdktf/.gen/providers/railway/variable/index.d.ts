import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface VariableConfig extends cdktf.TerraformMetaArguments {
    /**
    * Identifier of the environment the variable belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable#environment_id Variable#environment_id}
    */
    readonly environmentId: string;
    /**
    * Name of the variable.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable#name Variable#name}
    */
    readonly name: string;
    /**
    * Identifier of the service the variable belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable#service_id Variable#service_id}
    */
    readonly serviceId: string;
    /**
    * Value of the variable.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable#value Variable#value}
    */
    readonly value: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable railway_variable}
*/
export declare class Variable extends cdktf.TerraformResource {
    static readonly tfResourceType = "railway_variable";
    /**
    * Generates CDKTF code for importing a Variable resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Variable to import
    * @param importFromId The id of the existing Variable that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Variable to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable railway_variable} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options VariableConfig
    */
    constructor(scope: Construct, id: string, config: VariableConfig);
    private _environmentId?;
    get environmentId(): string;
    set environmentId(value: string);
    get environmentIdInput(): string | undefined;
    get id(): string;
    private _name?;
    get name(): string;
    set name(value: string);
    get nameInput(): string | undefined;
    get projectId(): string;
    private _serviceId?;
    get serviceId(): string;
    set serviceId(value: string);
    get serviceIdInput(): string | undefined;
    private _value?;
    get value(): string;
    set value(value: string);
    get valueInput(): string | undefined;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface SharedVariableConfig extends cdktf.TerraformMetaArguments {
    /**
    * Identifier of the environment the variable belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable#environment_id SharedVariable#environment_id}
    */
    readonly environmentId: string;
    /**
    * Name of the variable.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable#name SharedVariable#name}
    */
    readonly name: string;
    /**
    * Identifier of the project the variable belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable#project_id SharedVariable#project_id}
    */
    readonly projectId: string;
    /**
    * Value of the variable.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable#value SharedVariable#value}
    */
    readonly value: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable railway_shared_variable}
*/
export declare class SharedVariable extends cdktf.TerraformResource {
    static readonly tfResourceType = "railway_shared_variable";
    /**
    * Generates CDKTF code for importing a SharedVariable resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the SharedVariable to import
    * @param importFromId The id of the existing SharedVariable that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the SharedVariable to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/shared_variable railway_shared_variable} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options SharedVariableConfig
    */
    constructor(scope: Construct, id: string, config: SharedVariableConfig);
    private _environmentId?;
    get environmentId(): string;
    set environmentId(value: string);
    get environmentIdInput(): string | undefined;
    get id(): string;
    private _name?;
    get name(): string;
    set name(value: string);
    get nameInput(): string | undefined;
    private _projectId?;
    get projectId(): string;
    set projectId(value: string);
    get projectIdInput(): string | undefined;
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
import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface EnvironmentConfig extends cdktf.TerraformMetaArguments {
    /**
    * Name of the environment.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment#name Environment#name}
    */
    readonly name: string;
    /**
    * Identifier of the project the environment belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment#project_id Environment#project_id}
    */
    readonly projectId: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment railway_environment}
*/
export declare class Environment extends cdktf.TerraformResource {
    static readonly tfResourceType = "railway_environment";
    /**
    * Generates CDKTF code for importing a Environment resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Environment to import
    * @param importFromId The id of the existing Environment that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Environment to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/environment railway_environment} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options EnvironmentConfig
    */
    constructor(scope: Construct, id: string, config: EnvironmentConfig);
    get id(): string;
    private _name?;
    get name(): string;
    set name(value: string);
    get nameInput(): string | undefined;
    private _projectId?;
    get projectId(): string;
    set projectId(value: string);
    get projectIdInput(): string | undefined;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
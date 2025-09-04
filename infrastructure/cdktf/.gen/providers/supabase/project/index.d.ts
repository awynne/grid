import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface ProjectConfig extends cdktf.TerraformMetaArguments {
    /**
    * Password for the project database
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#database_password Project#database_password}
    */
    readonly databasePassword: string;
    /**
    * Desired instance size of the project
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#instance_size Project#instance_size}
    */
    readonly instanceSize?: string;
    /**
    * Name of the project
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#name Project#name}
    */
    readonly name: string;
    /**
    * Reference to the organization
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#organization_id Project#organization_id}
    */
    readonly organizationId: string;
    /**
    * Region where the project is located
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#region Project#region}
    */
    readonly region: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project supabase_project}
*/
export declare class Project extends cdktf.TerraformResource {
    static readonly tfResourceType = "supabase_project";
    /**
    * Generates CDKTF code for importing a Project resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Project to import
    * @param importFromId The id of the existing Project that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Project to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project supabase_project} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options ProjectConfig
    */
    constructor(scope: Construct, id: string, config: ProjectConfig);
    private _databasePassword?;
    get databasePassword(): string;
    set databasePassword(value: string);
    get databasePasswordInput(): string | undefined;
    get id(): string;
    private _instanceSize?;
    get instanceSize(): string;
    set instanceSize(value: string);
    resetInstanceSize(): void;
    get instanceSizeInput(): string | undefined;
    private _name?;
    get name(): string;
    set name(value: string);
    get nameInput(): string | undefined;
    private _organizationId?;
    get organizationId(): string;
    set organizationId(value: string);
    get organizationIdInput(): string | undefined;
    private _region?;
    get region(): string;
    set region(value: string);
    get regionInput(): string | undefined;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
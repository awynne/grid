// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/project
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

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
export class Project extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "supabase_project";

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
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
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
  public constructor(scope: Construct, id: string, config: ProjectConfig) {
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

  // ==========
  // ATTRIBUTES
  // ==========

  // database_password - computed: false, optional: false, required: true
  private _databasePassword?: string; 
  public get databasePassword() {
    return this.getStringAttribute('database_password');
  }
  public set databasePassword(value: string) {
    this._databasePassword = value;
  }
  // Temporarily expose input value. Use with caution.
  public get databasePasswordInput() {
    return this._databasePassword;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // instance_size - computed: false, optional: true, required: false
  private _instanceSize?: string; 
  public get instanceSize() {
    return this.getStringAttribute('instance_size');
  }
  public set instanceSize(value: string) {
    this._instanceSize = value;
  }
  public resetInstanceSize() {
    this._instanceSize = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get instanceSizeInput() {
    return this._instanceSize;
  }

  // name - computed: false, optional: false, required: true
  private _name?: string; 
  public get name() {
    return this.getStringAttribute('name');
  }
  public set name(value: string) {
    this._name = value;
  }
  // Temporarily expose input value. Use with caution.
  public get nameInput() {
    return this._name;
  }

  // organization_id - computed: false, optional: false, required: true
  private _organizationId?: string; 
  public get organizationId() {
    return this.getStringAttribute('organization_id');
  }
  public set organizationId(value: string) {
    this._organizationId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get organizationIdInput() {
    return this._organizationId;
  }

  // region - computed: false, optional: false, required: true
  private _region?: string; 
  public get region() {
    return this.getStringAttribute('region');
  }
  public set region(value: string) {
    this._region = value;
  }
  // Temporarily expose input value. Use with caution.
  public get regionInput() {
    return this._region;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      database_password: cdktf.stringToTerraform(this._databasePassword),
      instance_size: cdktf.stringToTerraform(this._instanceSize),
      name: cdktf.stringToTerraform(this._name),
      organization_id: cdktf.stringToTerraform(this._organizationId),
      region: cdktf.stringToTerraform(this._region),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
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
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

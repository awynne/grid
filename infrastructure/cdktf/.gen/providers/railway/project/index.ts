// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface ProjectConfig extends cdktf.TerraformMetaArguments {
  /**
  * Default environment of the project. When multiple exist, the oldest is considered.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#default_environment Project#default_environment}
  */
  readonly defaultEnvironment?: ProjectDefaultEnvironment;
  /**
  * Description of the project.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#description Project#description}
  */
  readonly description?: string;
  /**
  * Whether the project has PR deploys enabled. **Default** `false`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#has_pr_deploys Project#has_pr_deploys}
  */
  readonly hasPrDeploys?: boolean | cdktf.IResolvable;
  /**
  * Name of the project.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#name Project#name}
  */
  readonly name: string;
  /**
  * Privacy of the project. **Default** `true`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#private Project#private}
  */
  readonly private?: boolean | cdktf.IResolvable;
  /**
  * Identifier of the team the project belongs to.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#team_id Project#team_id}
  */
  readonly teamId?: string;
}
export interface ProjectDefaultEnvironment {
  /**
  * Name of the default environment.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#name Project#name}
  */
  readonly name?: string;
}

export function projectDefaultEnvironmentToTerraform(struct?: ProjectDefaultEnvironment | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    name: cdktf.stringToTerraform(struct!.name),
  }
}


export function projectDefaultEnvironmentToHclTerraform(struct?: ProjectDefaultEnvironment | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    name: {
      value: cdktf.stringToHclTerraform(struct!.name),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ProjectDefaultEnvironmentOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): ProjectDefaultEnvironment | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._name !== undefined) {
      hasAnyValues = true;
      internalValueResult.name = this._name;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ProjectDefaultEnvironment | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._name = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._name = value.name;
    }
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // name - computed: true, optional: true, required: false
  private _name?: string; 
  public get name() {
    return this.getStringAttribute('name');
  }
  public set name(value: string) {
    this._name = value;
  }
  public resetName() {
    this._name = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get nameInput() {
    return this._name;
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project railway_project}
*/
export class Project extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "railway_project";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a Project resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the Project to import
  * @param importFromId The id of the existing Project that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the Project to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_project", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/project railway_project} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options ProjectConfig
  */
  public constructor(scope: Construct, id: string, config: ProjectConfig) {
    super(scope, id, {
      terraformResourceType: 'railway_project',
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
    this._defaultEnvironment.internalValue = config.defaultEnvironment;
    this._description = config.description;
    this._hasPrDeploys = config.hasPrDeploys;
    this._name = config.name;
    this._private = config.private;
    this._teamId = config.teamId;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // default_environment - computed: true, optional: true, required: false
  private _defaultEnvironment = new ProjectDefaultEnvironmentOutputReference(this, "default_environment");
  public get defaultEnvironment() {
    return this._defaultEnvironment;
  }
  public putDefaultEnvironment(value: ProjectDefaultEnvironment) {
    this._defaultEnvironment.internalValue = value;
  }
  public resetDefaultEnvironment() {
    this._defaultEnvironment.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get defaultEnvironmentInput() {
    return this._defaultEnvironment.internalValue;
  }

  // description - computed: true, optional: true, required: false
  private _description?: string; 
  public get description() {
    return this.getStringAttribute('description');
  }
  public set description(value: string) {
    this._description = value;
  }
  public resetDescription() {
    this._description = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get descriptionInput() {
    return this._description;
  }

  // has_pr_deploys - computed: true, optional: true, required: false
  private _hasPrDeploys?: boolean | cdktf.IResolvable; 
  public get hasPrDeploys() {
    return this.getBooleanAttribute('has_pr_deploys');
  }
  public set hasPrDeploys(value: boolean | cdktf.IResolvable) {
    this._hasPrDeploys = value;
  }
  public resetHasPrDeploys() {
    this._hasPrDeploys = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get hasPrDeploysInput() {
    return this._hasPrDeploys;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
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

  // private - computed: true, optional: true, required: false
  private _private?: boolean | cdktf.IResolvable; 
  public get private() {
    return this.getBooleanAttribute('private');
  }
  public set private(value: boolean | cdktf.IResolvable) {
    this._private = value;
  }
  public resetPrivate() {
    this._private = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get privateInput() {
    return this._private;
  }

  // team_id - computed: true, optional: true, required: false
  private _teamId?: string; 
  public get teamId() {
    return this.getStringAttribute('team_id');
  }
  public set teamId(value: string) {
    this._teamId = value;
  }
  public resetTeamId() {
    this._teamId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get teamIdInput() {
    return this._teamId;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      default_environment: projectDefaultEnvironmentToTerraform(this._defaultEnvironment.internalValue),
      description: cdktf.stringToTerraform(this._description),
      has_pr_deploys: cdktf.booleanToTerraform(this._hasPrDeploys),
      name: cdktf.stringToTerraform(this._name),
      private: cdktf.booleanToTerraform(this._private),
      team_id: cdktf.stringToTerraform(this._teamId),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      default_environment: {
        value: projectDefaultEnvironmentToHclTerraform(this._defaultEnvironment.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "ProjectDefaultEnvironment",
      },
      description: {
        value: cdktf.stringToHclTerraform(this._description),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      has_pr_deploys: {
        value: cdktf.booleanToHclTerraform(this._hasPrDeploys),
        isBlock: false,
        type: "simple",
        storageClassType: "boolean",
      },
      name: {
        value: cdktf.stringToHclTerraform(this._name),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      private: {
        value: cdktf.booleanToHclTerraform(this._private),
        isBlock: false,
        type: "simple",
        storageClassType: "boolean",
      },
      team_id: {
        value: cdktf.stringToHclTerraform(this._teamId),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

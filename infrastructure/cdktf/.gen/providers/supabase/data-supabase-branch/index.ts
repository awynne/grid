// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/branch
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataSupabaseBranchConfig extends cdktf.TerraformMetaArguments {
  /**
  * Parent project ref
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/branch#parent_project_ref DataSupabaseBranch#parent_project_ref}
  */
  readonly parentProjectRef: string;
}
export interface DataSupabaseBranchBranches {
}

export function dataSupabaseBranchBranchesToTerraform(struct?: DataSupabaseBranchBranches): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
  }
}


export function dataSupabaseBranchBranchesToHclTerraform(struct?: DataSupabaseBranchBranches): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
  };
  return attrs;
}

export class DataSupabaseBranchBranchesOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): DataSupabaseBranchBranches | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataSupabaseBranchBranches | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
    }
  }

  // git_branch - computed: true, optional: false, required: false
  public get gitBranch() {
    return this.getStringAttribute('git_branch');
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // project_ref - computed: true, optional: false, required: false
  public get projectRef() {
    return this.getStringAttribute('project_ref');
  }
}

export class DataSupabaseBranchBranchesList extends cdktf.ComplexList {

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  constructor(protected terraformResource: cdktf.IInterpolatingParent, protected terraformAttribute: string, protected wrapsSet: boolean) {
    super(terraformResource, terraformAttribute, wrapsSet)
  }

  /**
  * @param index the index of the item to return
  */
  public get(index: number): DataSupabaseBranchBranchesOutputReference {
    return new DataSupabaseBranchBranchesOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/branch supabase_branch}
*/
export class DataSupabaseBranch extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "supabase_branch";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a DataSupabaseBranch resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the DataSupabaseBranch to import
  * @param importFromId The id of the existing DataSupabaseBranch that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/branch#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the DataSupabaseBranch to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase_branch", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/branch supabase_branch} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataSupabaseBranchConfig
  */
  public constructor(scope: Construct, id: string, config: DataSupabaseBranchConfig) {
    super(scope, id, {
      terraformResourceType: 'supabase_branch',
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
    this._parentProjectRef = config.parentProjectRef;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // branches - computed: true, optional: false, required: false
  private _branches = new DataSupabaseBranchBranchesList(this, "branches", true);
  public get branches() {
    return this._branches;
  }

  // parent_project_ref - computed: false, optional: false, required: true
  private _parentProjectRef?: string; 
  public get parentProjectRef() {
    return this.getStringAttribute('parent_project_ref');
  }
  public set parentProjectRef(value: string) {
    this._parentProjectRef = value;
  }
  // Temporarily expose input value. Use with caution.
  public get parentProjectRefInput() {
    return this._parentProjectRef;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      parent_project_ref: cdktf.stringToTerraform(this._parentProjectRef),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      parent_project_ref: {
        value: cdktf.stringToHclTerraform(this._parentProjectRef),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

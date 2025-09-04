// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/pooler
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataSupabasePoolerConfig extends cdktf.TerraformMetaArguments {
  /**
  * Project ref
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/pooler#project_ref DataSupabasePooler#project_ref}
  */
  readonly projectRef: string;
}

/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/pooler supabase_pooler}
*/
export class DataSupabasePooler extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "supabase_pooler";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a DataSupabasePooler resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the DataSupabasePooler to import
  * @param importFromId The id of the existing DataSupabasePooler that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/pooler#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the DataSupabasePooler to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase_pooler", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/data-sources/pooler supabase_pooler} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataSupabasePoolerConfig
  */
  public constructor(scope: Construct, id: string, config: DataSupabasePoolerConfig) {
    super(scope, id, {
      terraformResourceType: 'supabase_pooler',
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
    this._projectRef = config.projectRef;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // project_ref - computed: false, optional: false, required: true
  private _projectRef?: string; 
  public get projectRef() {
    return this.getStringAttribute('project_ref');
  }
  public set projectRef(value: string) {
    this._projectRef = value;
  }
  // Temporarily expose input value. Use with caution.
  public get projectRefInput() {
    return this._projectRef;
  }

  // url - computed: true, optional: false, required: false
  private _url = new cdktf.StringMap(this, "url");
  public get url() {
    return this._url;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      project_ref: cdktf.stringToTerraform(this._projectRef),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      project_ref: {
        value: cdktf.stringToHclTerraform(this._projectRef),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface SettingsConfig extends cdktf.TerraformMetaArguments {
  /**
  * API settings as [serialised JSON](https://api.supabase.com/api/v1#/services/updatePostgRESTConfig)
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#api Settings#api}
  */
  readonly api?: string;
  /**
  * Auth settings as [serialised JSON](https://api.supabase.com/api/v1#/projects%20config/updateV1AuthConfig)
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#auth Settings#auth}
  */
  readonly auth?: string;
  /**
  * Database settings as [serialised JSON](https://api.supabase.com/api/v1#/projects%20config/updateConfig)
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#database Settings#database}
  */
  readonly database?: string;
  /**
  * Network settings as serialised JSON
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#network Settings#network}
  */
  readonly network?: string;
  /**
  * Pooler settings as serialised JSON
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#pooler Settings#pooler}
  */
  readonly pooler?: string;
  /**
  * Project reference ID
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#project_ref Settings#project_ref}
  */
  readonly projectRef: string;
  /**
  * Storage settings as serialised JSON
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#storage Settings#storage}
  */
  readonly storage?: string;
}

/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings supabase_settings}
*/
export class Settings extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "supabase_settings";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a Settings resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the Settings to import
  * @param importFromId The id of the existing Settings that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the Settings to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase_settings", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings supabase_settings} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options SettingsConfig
  */
  public constructor(scope: Construct, id: string, config: SettingsConfig) {
    super(scope, id, {
      terraformResourceType: 'supabase_settings',
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
    this._api = config.api;
    this._auth = config.auth;
    this._database = config.database;
    this._network = config.network;
    this._pooler = config.pooler;
    this._projectRef = config.projectRef;
    this._storage = config.storage;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // api - computed: false, optional: true, required: false
  private _api?: string; 
  public get api() {
    return this.getStringAttribute('api');
  }
  public set api(value: string) {
    this._api = value;
  }
  public resetApi() {
    this._api = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get apiInput() {
    return this._api;
  }

  // auth - computed: false, optional: true, required: false
  private _auth?: string; 
  public get auth() {
    return this.getStringAttribute('auth');
  }
  public set auth(value: string) {
    this._auth = value;
  }
  public resetAuth() {
    this._auth = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get authInput() {
    return this._auth;
  }

  // database - computed: false, optional: true, required: false
  private _database?: string; 
  public get database() {
    return this.getStringAttribute('database');
  }
  public set database(value: string) {
    this._database = value;
  }
  public resetDatabase() {
    this._database = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get databaseInput() {
    return this._database;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // network - computed: false, optional: true, required: false
  private _network?: string; 
  public get network() {
    return this.getStringAttribute('network');
  }
  public set network(value: string) {
    this._network = value;
  }
  public resetNetwork() {
    this._network = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get networkInput() {
    return this._network;
  }

  // pooler - computed: false, optional: true, required: false
  private _pooler?: string; 
  public get pooler() {
    return this.getStringAttribute('pooler');
  }
  public set pooler(value: string) {
    this._pooler = value;
  }
  public resetPooler() {
    this._pooler = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get poolerInput() {
    return this._pooler;
  }

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

  // storage - computed: false, optional: true, required: false
  private _storage?: string; 
  public get storage() {
    return this.getStringAttribute('storage');
  }
  public set storage(value: string) {
    this._storage = value;
  }
  public resetStorage() {
    this._storage = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get storageInput() {
    return this._storage;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      api: cdktf.stringToTerraform(this._api),
      auth: cdktf.stringToTerraform(this._auth),
      database: cdktf.stringToTerraform(this._database),
      network: cdktf.stringToTerraform(this._network),
      pooler: cdktf.stringToTerraform(this._pooler),
      project_ref: cdktf.stringToTerraform(this._projectRef),
      storage: cdktf.stringToTerraform(this._storage),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      api: {
        value: cdktf.stringToHclTerraform(this._api),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      auth: {
        value: cdktf.stringToHclTerraform(this._auth),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      database: {
        value: cdktf.stringToHclTerraform(this._database),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      network: {
        value: cdktf.stringToHclTerraform(this._network),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      pooler: {
        value: cdktf.stringToHclTerraform(this._pooler),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      project_ref: {
        value: cdktf.stringToHclTerraform(this._projectRef),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      storage: {
        value: cdktf.stringToHclTerraform(this._storage),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

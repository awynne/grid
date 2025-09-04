// https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface SupabaseProviderConfig {
  /**
  * Supabase access token
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs#access_token SupabaseProvider#access_token}
  */
  readonly accessToken?: string;
  /**
  * Supabase API endpoint
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs#endpoint SupabaseProvider#endpoint}
  */
  readonly endpoint?: string;
  /**
  * Alias name
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs#alias SupabaseProvider#alias}
  */
  readonly alias?: string;
}

/**
* Represents a {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs supabase}
*/
export class SupabaseProvider extends cdktf.TerraformProvider {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "supabase";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a SupabaseProvider resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the SupabaseProvider to import
  * @param importFromId The id of the existing SupabaseProvider that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the SupabaseProvider to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "supabase", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs supabase} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options SupabaseProviderConfig = {}
  */
  public constructor(scope: Construct, id: string, config: SupabaseProviderConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'supabase',
      terraformGeneratorMetadata: {
        providerName: 'supabase',
        providerVersion: '1.5.1',
        providerVersionConstraint: '~> 1.0'
      },
      terraformProviderSource: 'supabase/supabase'
    });
    this._accessToken = config.accessToken;
    this._endpoint = config.endpoint;
    this._alias = config.alias;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // access_token - computed: false, optional: true, required: false
  private _accessToken?: string; 
  public get accessToken() {
    return this._accessToken;
  }
  public set accessToken(value: string | undefined) {
    this._accessToken = value;
  }
  public resetAccessToken() {
    this._accessToken = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get accessTokenInput() {
    return this._accessToken;
  }

  // endpoint - computed: false, optional: true, required: false
  private _endpoint?: string; 
  public get endpoint() {
    return this._endpoint;
  }
  public set endpoint(value: string | undefined) {
    this._endpoint = value;
  }
  public resetEndpoint() {
    this._endpoint = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get endpointInput() {
    return this._endpoint;
  }

  // alias - computed: false, optional: true, required: false
  private _alias?: string; 
  public get alias() {
    return this._alias;
  }
  public set alias(value: string | undefined) {
    this._alias = value;
  }
  public resetAlias() {
    this._alias = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get aliasInput() {
    return this._alias;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      access_token: cdktf.stringToTerraform(this._accessToken),
      endpoint: cdktf.stringToTerraform(this._endpoint),
      alias: cdktf.stringToTerraform(this._alias),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      access_token: {
        value: cdktf.stringToHclTerraform(this._accessToken),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      endpoint: {
        value: cdktf.stringToHclTerraform(this._endpoint),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      alias: {
        value: cdktf.stringToHclTerraform(this._alias),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

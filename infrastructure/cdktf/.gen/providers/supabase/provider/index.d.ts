import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
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
export declare class SupabaseProvider extends cdktf.TerraformProvider {
    static readonly tfResourceType = "supabase";
    /**
    * Generates CDKTF code for importing a SupabaseProvider resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the SupabaseProvider to import
    * @param importFromId The id of the existing SupabaseProvider that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the SupabaseProvider to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs supabase} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options SupabaseProviderConfig = {}
    */
    constructor(scope: Construct, id: string, config?: SupabaseProviderConfig);
    private _accessToken?;
    get accessToken(): string | undefined;
    set accessToken(value: string | undefined);
    resetAccessToken(): void;
    get accessTokenInput(): string | undefined;
    private _endpoint?;
    get endpoint(): string | undefined;
    set endpoint(value: string | undefined);
    resetEndpoint(): void;
    get endpointInput(): string | undefined;
    private _alias?;
    get alias(): string | undefined;
    set alias(value: string | undefined);
    resetAlias(): void;
    get aliasInput(): string | undefined;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
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
export declare class Settings extends cdktf.TerraformResource {
    static readonly tfResourceType = "supabase_settings";
    /**
    * Generates CDKTF code for importing a Settings resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Settings to import
    * @param importFromId The id of the existing Settings that should be imported. Refer to the {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Settings to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/supabase/supabase/1.5.1/docs/resources/settings supabase_settings} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options SettingsConfig
    */
    constructor(scope: Construct, id: string, config: SettingsConfig);
    private _api?;
    get api(): string;
    set api(value: string);
    resetApi(): void;
    get apiInput(): string | undefined;
    private _auth?;
    get auth(): string;
    set auth(value: string);
    resetAuth(): void;
    get authInput(): string | undefined;
    private _database?;
    get database(): string;
    set database(value: string);
    resetDatabase(): void;
    get databaseInput(): string | undefined;
    get id(): string;
    private _network?;
    get network(): string;
    set network(value: string);
    resetNetwork(): void;
    get networkInput(): string | undefined;
    private _pooler?;
    get pooler(): string;
    set pooler(value: string);
    resetPooler(): void;
    get poolerInput(): string | undefined;
    private _projectRef?;
    get projectRef(): string;
    set projectRef(value: string);
    get projectRefInput(): string | undefined;
    private _storage?;
    get storage(): string;
    set storage(value: string);
    resetStorage(): void;
    get storageInput(): string | undefined;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
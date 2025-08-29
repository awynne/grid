import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface RailwayProviderConfig {
    /**
    * The token used to authenticate with Railway.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs#token RailwayProvider#token}
    */
    readonly token?: string;
    /**
    * Alias name
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs#alias RailwayProvider#alias}
    */
    readonly alias?: string;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs railway}
*/
export declare class RailwayProvider extends cdktf.TerraformProvider {
    static readonly tfResourceType = "railway";
    /**
    * Generates CDKTF code for importing a RailwayProvider resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the RailwayProvider to import
    * @param importFromId The id of the existing RailwayProvider that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the RailwayProvider to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs railway} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options RailwayProviderConfig = {}
    */
    constructor(scope: Construct, id: string, config?: RailwayProviderConfig);
    private _token?;
    get token(): string | undefined;
    set token(value: string | undefined);
    resetToken(): void;
    get tokenInput(): string | undefined;
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
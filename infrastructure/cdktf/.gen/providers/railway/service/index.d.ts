import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
export interface ServiceConfig extends cdktf.TerraformMetaArguments {
    /**
    * Path to the Railway config file. Conflicts with `source_image`.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#config_path Service#config_path}
    */
    readonly configPath?: string;
    /**
    * Cron schedule of the service. Only allowed when total number of replicas across all regions is `1`.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#cron_schedule Service#cron_schedule}
    */
    readonly cronSchedule?: string;
    /**
    * Name of the service.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#name Service#name}
    */
    readonly name: string;
    /**
    * Identifier of the project the service belongs to.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#project_id Service#project_id}
    */
    readonly projectId: string;
    /**
    * Regions with replicas to deploy service in.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#regions Service#regions}
    */
    readonly regions?: ServiceRegions[] | cdktf.IResolvable;
    /**
    * Directory to user for the service. Conflicts with `source_image`.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#root_directory Service#root_directory}
    */
    readonly rootDirectory?: string;
    /**
    * Source image of the service. Conflicts with `source_repo`, `source_repo_branch`, `root_directory` and `config_path`.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#source_image Service#source_image}
    */
    readonly sourceImage?: string;
    /**
    * Private Docker registry credentials.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#source_image_registry_password Service#source_image_registry_password}
    */
    readonly sourceImageRegistryPassword?: string;
    /**
    * Private Docker registry credentials.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#source_image_registry_username Service#source_image_registry_username}
    */
    readonly sourceImageRegistryUsername?: string;
    /**
    * Source repository of the service. Conflicts with `source_image`.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#source_repo Service#source_repo}
    */
    readonly sourceRepo?: string;
    /**
    * Source repository branch to be used with `source_repo`. Must be specified if `source_repo` is specified.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#source_repo_branch Service#source_repo_branch}
    */
    readonly sourceRepoBranch?: string;
    /**
    * Volume connected to the service.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#volume Service#volume}
    */
    readonly volume?: ServiceVolume;
}
export interface ServiceRegions {
    /**
    * Number of replicas to deploy. **Default** `1`.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#num_replicas Service#num_replicas}
    */
    readonly numReplicas?: number;
    /**
    * Region to deploy in.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#region Service#region}
    */
    readonly region?: string;
}
export declare function serviceRegionsToTerraform(struct?: ServiceRegions | cdktf.IResolvable): any;
export declare function serviceRegionsToHclTerraform(struct?: ServiceRegions | cdktf.IResolvable): any;
export declare class ServiceRegionsOutputReference extends cdktf.ComplexObject {
    private isEmptyObject;
    private resolvableValue?;
    /**
    * @param terraformResource The parent resource
    * @param terraformAttribute The attribute on the parent resource this class is referencing
    * @param complexObjectIndex the index of this item in the list
    * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
    */
    constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean);
    get internalValue(): ServiceRegions | cdktf.IResolvable | undefined;
    set internalValue(value: ServiceRegions | cdktf.IResolvable | undefined);
    private _numReplicas?;
    get numReplicas(): number;
    set numReplicas(value: number);
    resetNumReplicas(): void;
    get numReplicasInput(): number | undefined;
    private _region?;
    get region(): string;
    set region(value: string);
    resetRegion(): void;
    get regionInput(): string | undefined;
}
export declare class ServiceRegionsList extends cdktf.ComplexList {
    protected terraformResource: cdktf.IInterpolatingParent;
    protected terraformAttribute: string;
    protected wrapsSet: boolean;
    internalValue?: ServiceRegions[] | cdktf.IResolvable;
    /**
    * @param terraformResource The parent resource
    * @param terraformAttribute The attribute on the parent resource this class is referencing
    * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
    */
    constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, wrapsSet: boolean);
    /**
    * @param index the index of the item to return
    */
    get(index: number): ServiceRegionsOutputReference;
}
export interface ServiceVolume {
    /**
    * Mount path of the volume.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#mount_path Service#mount_path}
    */
    readonly mountPath: string;
    /**
    * Name of the volume.
    *
    * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#name Service#name}
    */
    readonly name: string;
}
export declare function serviceVolumeToTerraform(struct?: ServiceVolume | cdktf.IResolvable): any;
export declare function serviceVolumeToHclTerraform(struct?: ServiceVolume | cdktf.IResolvable): any;
export declare class ServiceVolumeOutputReference extends cdktf.ComplexObject {
    private isEmptyObject;
    private resolvableValue?;
    /**
    * @param terraformResource The parent resource
    * @param terraformAttribute The attribute on the parent resource this class is referencing
    */
    constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string);
    get internalValue(): ServiceVolume | cdktf.IResolvable | undefined;
    set internalValue(value: ServiceVolume | cdktf.IResolvable | undefined);
    get id(): string;
    private _mountPath?;
    get mountPath(): string;
    set mountPath(value: string);
    get mountPathInput(): string | undefined;
    private _name?;
    get name(): string;
    set name(value: string);
    get nameInput(): string | undefined;
    get size(): number;
}
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service railway_service}
*/
export declare class Service extends cdktf.TerraformResource {
    static readonly tfResourceType = "railway_service";
    /**
    * Generates CDKTF code for importing a Service resource upon running "cdktf plan <stack-name>"
    * @param scope The scope in which to define this construct
    * @param importToId The construct id used in the generated config for the Service to import
    * @param importFromId The id of the existing Service that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#import import section} in the documentation of this resource for the id to use
    * @param provider? Optional instance of the provider where the Service to import is found
    */
    static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider): cdktf.ImportableResource;
    /**
    * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service railway_service} Resource
    *
    * @param scope The scope in which to define this construct
    * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
    * @param options ServiceConfig
    */
    constructor(scope: Construct, id: string, config: ServiceConfig);
    private _configPath?;
    get configPath(): string;
    set configPath(value: string);
    resetConfigPath(): void;
    get configPathInput(): string | undefined;
    private _cronSchedule?;
    get cronSchedule(): string;
    set cronSchedule(value: string);
    resetCronSchedule(): void;
    get cronScheduleInput(): string | undefined;
    get id(): string;
    private _name?;
    get name(): string;
    set name(value: string);
    get nameInput(): string | undefined;
    private _projectId?;
    get projectId(): string;
    set projectId(value: string);
    get projectIdInput(): string | undefined;
    private _regions;
    get regions(): ServiceRegionsList;
    putRegions(value: ServiceRegions[] | cdktf.IResolvable): void;
    resetRegions(): void;
    get regionsInput(): cdktf.IResolvable | ServiceRegions[] | undefined;
    private _rootDirectory?;
    get rootDirectory(): string;
    set rootDirectory(value: string);
    resetRootDirectory(): void;
    get rootDirectoryInput(): string | undefined;
    private _sourceImage?;
    get sourceImage(): string;
    set sourceImage(value: string);
    resetSourceImage(): void;
    get sourceImageInput(): string | undefined;
    private _sourceImageRegistryPassword?;
    get sourceImageRegistryPassword(): string;
    set sourceImageRegistryPassword(value: string);
    resetSourceImageRegistryPassword(): void;
    get sourceImageRegistryPasswordInput(): string | undefined;
    private _sourceImageRegistryUsername?;
    get sourceImageRegistryUsername(): string;
    set sourceImageRegistryUsername(value: string);
    resetSourceImageRegistryUsername(): void;
    get sourceImageRegistryUsernameInput(): string | undefined;
    private _sourceRepo?;
    get sourceRepo(): string;
    set sourceRepo(value: string);
    resetSourceRepo(): void;
    get sourceRepoInput(): string | undefined;
    private _sourceRepoBranch?;
    get sourceRepoBranch(): string;
    set sourceRepoBranch(value: string);
    resetSourceRepoBranch(): void;
    get sourceRepoBranchInput(): string | undefined;
    private _volume;
    get volume(): ServiceVolumeOutputReference;
    putVolume(value: ServiceVolume): void;
    resetVolume(): void;
    get volumeInput(): cdktf.IResolvable | ServiceVolume | undefined;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
    protected synthesizeHclAttributes(): {
        [name: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map
// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

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

export function serviceRegionsToTerraform(struct?: ServiceRegions | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    num_replicas: cdktf.numberToTerraform(struct!.numReplicas),
    region: cdktf.stringToTerraform(struct!.region),
  }
}


export function serviceRegionsToHclTerraform(struct?: ServiceRegions | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    num_replicas: {
      value: cdktf.numberToHclTerraform(struct!.numReplicas),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
    region: {
      value: cdktf.stringToHclTerraform(struct!.region),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ServiceRegionsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): ServiceRegions | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._numReplicas !== undefined) {
      hasAnyValues = true;
      internalValueResult.numReplicas = this._numReplicas;
    }
    if (this._region !== undefined) {
      hasAnyValues = true;
      internalValueResult.region = this._region;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ServiceRegions | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._numReplicas = undefined;
      this._region = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._numReplicas = value.numReplicas;
      this._region = value.region;
    }
  }

  // num_replicas - computed: true, optional: true, required: false
  private _numReplicas?: number; 
  public get numReplicas() {
    return this.getNumberAttribute('num_replicas');
  }
  public set numReplicas(value: number) {
    this._numReplicas = value;
  }
  public resetNumReplicas() {
    this._numReplicas = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get numReplicasInput() {
    return this._numReplicas;
  }

  // region - computed: true, optional: true, required: false
  private _region?: string; 
  public get region() {
    return this.getStringAttribute('region');
  }
  public set region(value: string) {
    this._region = value;
  }
  public resetRegion() {
    this._region = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get regionInput() {
    return this._region;
  }
}

export class ServiceRegionsList extends cdktf.ComplexList {
  public internalValue? : ServiceRegions[] | cdktf.IResolvable

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
  public get(index: number): ServiceRegionsOutputReference {
    return new ServiceRegionsOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
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

export function serviceVolumeToTerraform(struct?: ServiceVolume | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    mount_path: cdktf.stringToTerraform(struct!.mountPath),
    name: cdktf.stringToTerraform(struct!.name),
  }
}


export function serviceVolumeToHclTerraform(struct?: ServiceVolume | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    mount_path: {
      value: cdktf.stringToHclTerraform(struct!.mountPath),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
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

export class ServiceVolumeOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): ServiceVolume | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._mountPath !== undefined) {
      hasAnyValues = true;
      internalValueResult.mountPath = this._mountPath;
    }
    if (this._name !== undefined) {
      hasAnyValues = true;
      internalValueResult.name = this._name;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ServiceVolume | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._mountPath = undefined;
      this._name = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._mountPath = value.mountPath;
      this._name = value.name;
    }
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // mount_path - computed: false, optional: false, required: true
  private _mountPath?: string; 
  public get mountPath() {
    return this.getStringAttribute('mount_path');
  }
  public set mountPath(value: string) {
    this._mountPath = value;
  }
  // Temporarily expose input value. Use with caution.
  public get mountPathInput() {
    return this._mountPath;
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

  // size - computed: true, optional: false, required: false
  public get size() {
    return this.getNumberAttribute('size');
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service railway_service}
*/
export class Service extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "railway_service";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a Service resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the Service to import
  * @param importFromId The id of the existing Service that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the Service to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_service", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service railway_service} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options ServiceConfig
  */
  public constructor(scope: Construct, id: string, config: ServiceConfig) {
    super(scope, id, {
      terraformResourceType: 'railway_service',
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
    this._configPath = config.configPath;
    this._cronSchedule = config.cronSchedule;
    this._name = config.name;
    this._projectId = config.projectId;
    this._regions.internalValue = config.regions;
    this._rootDirectory = config.rootDirectory;
    this._sourceImage = config.sourceImage;
    this._sourceImageRegistryPassword = config.sourceImageRegistryPassword;
    this._sourceImageRegistryUsername = config.sourceImageRegistryUsername;
    this._sourceRepo = config.sourceRepo;
    this._sourceRepoBranch = config.sourceRepoBranch;
    this._volume.internalValue = config.volume;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // config_path - computed: false, optional: true, required: false
  private _configPath?: string; 
  public get configPath() {
    return this.getStringAttribute('config_path');
  }
  public set configPath(value: string) {
    this._configPath = value;
  }
  public resetConfigPath() {
    this._configPath = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get configPathInput() {
    return this._configPath;
  }

  // cron_schedule - computed: false, optional: true, required: false
  private _cronSchedule?: string; 
  public get cronSchedule() {
    return this.getStringAttribute('cron_schedule');
  }
  public set cronSchedule(value: string) {
    this._cronSchedule = value;
  }
  public resetCronSchedule() {
    this._cronSchedule = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get cronScheduleInput() {
    return this._cronSchedule;
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

  // project_id - computed: false, optional: false, required: true
  private _projectId?: string; 
  public get projectId() {
    return this.getStringAttribute('project_id');
  }
  public set projectId(value: string) {
    this._projectId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get projectIdInput() {
    return this._projectId;
  }

  // regions - computed: true, optional: true, required: false
  private _regions = new ServiceRegionsList(this, "regions", false);
  public get regions() {
    return this._regions;
  }
  public putRegions(value: ServiceRegions[] | cdktf.IResolvable) {
    this._regions.internalValue = value;
  }
  public resetRegions() {
    this._regions.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get regionsInput() {
    return this._regions.internalValue;
  }

  // root_directory - computed: false, optional: true, required: false
  private _rootDirectory?: string; 
  public get rootDirectory() {
    return this.getStringAttribute('root_directory');
  }
  public set rootDirectory(value: string) {
    this._rootDirectory = value;
  }
  public resetRootDirectory() {
    this._rootDirectory = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get rootDirectoryInput() {
    return this._rootDirectory;
  }

  // source_image - computed: false, optional: true, required: false
  private _sourceImage?: string; 
  public get sourceImage() {
    return this.getStringAttribute('source_image');
  }
  public set sourceImage(value: string) {
    this._sourceImage = value;
  }
  public resetSourceImage() {
    this._sourceImage = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sourceImageInput() {
    return this._sourceImage;
  }

  // source_image_registry_password - computed: false, optional: true, required: false
  private _sourceImageRegistryPassword?: string; 
  public get sourceImageRegistryPassword() {
    return this.getStringAttribute('source_image_registry_password');
  }
  public set sourceImageRegistryPassword(value: string) {
    this._sourceImageRegistryPassword = value;
  }
  public resetSourceImageRegistryPassword() {
    this._sourceImageRegistryPassword = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sourceImageRegistryPasswordInput() {
    return this._sourceImageRegistryPassword;
  }

  // source_image_registry_username - computed: false, optional: true, required: false
  private _sourceImageRegistryUsername?: string; 
  public get sourceImageRegistryUsername() {
    return this.getStringAttribute('source_image_registry_username');
  }
  public set sourceImageRegistryUsername(value: string) {
    this._sourceImageRegistryUsername = value;
  }
  public resetSourceImageRegistryUsername() {
    this._sourceImageRegistryUsername = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sourceImageRegistryUsernameInput() {
    return this._sourceImageRegistryUsername;
  }

  // source_repo - computed: false, optional: true, required: false
  private _sourceRepo?: string; 
  public get sourceRepo() {
    return this.getStringAttribute('source_repo');
  }
  public set sourceRepo(value: string) {
    this._sourceRepo = value;
  }
  public resetSourceRepo() {
    this._sourceRepo = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sourceRepoInput() {
    return this._sourceRepo;
  }

  // source_repo_branch - computed: false, optional: true, required: false
  private _sourceRepoBranch?: string; 
  public get sourceRepoBranch() {
    return this.getStringAttribute('source_repo_branch');
  }
  public set sourceRepoBranch(value: string) {
    this._sourceRepoBranch = value;
  }
  public resetSourceRepoBranch() {
    this._sourceRepoBranch = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sourceRepoBranchInput() {
    return this._sourceRepoBranch;
  }

  // volume - computed: false, optional: true, required: false
  private _volume = new ServiceVolumeOutputReference(this, "volume");
  public get volume() {
    return this._volume;
  }
  public putVolume(value: ServiceVolume) {
    this._volume.internalValue = value;
  }
  public resetVolume() {
    this._volume.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get volumeInput() {
    return this._volume.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      config_path: cdktf.stringToTerraform(this._configPath),
      cron_schedule: cdktf.stringToTerraform(this._cronSchedule),
      name: cdktf.stringToTerraform(this._name),
      project_id: cdktf.stringToTerraform(this._projectId),
      regions: cdktf.listMapper(serviceRegionsToTerraform, false)(this._regions.internalValue),
      root_directory: cdktf.stringToTerraform(this._rootDirectory),
      source_image: cdktf.stringToTerraform(this._sourceImage),
      source_image_registry_password: cdktf.stringToTerraform(this._sourceImageRegistryPassword),
      source_image_registry_username: cdktf.stringToTerraform(this._sourceImageRegistryUsername),
      source_repo: cdktf.stringToTerraform(this._sourceRepo),
      source_repo_branch: cdktf.stringToTerraform(this._sourceRepoBranch),
      volume: serviceVolumeToTerraform(this._volume.internalValue),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      config_path: {
        value: cdktf.stringToHclTerraform(this._configPath),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      cron_schedule: {
        value: cdktf.stringToHclTerraform(this._cronSchedule),
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
      project_id: {
        value: cdktf.stringToHclTerraform(this._projectId),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      regions: {
        value: cdktf.listMapperHcl(serviceRegionsToHclTerraform, false)(this._regions.internalValue),
        isBlock: true,
        type: "list",
        storageClassType: "ServiceRegionsList",
      },
      root_directory: {
        value: cdktf.stringToHclTerraform(this._rootDirectory),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      source_image: {
        value: cdktf.stringToHclTerraform(this._sourceImage),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      source_image_registry_password: {
        value: cdktf.stringToHclTerraform(this._sourceImageRegistryPassword),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      source_image_registry_username: {
        value: cdktf.stringToHclTerraform(this._sourceImageRegistryUsername),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      source_repo: {
        value: cdktf.stringToHclTerraform(this._sourceRepo),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      source_repo_branch: {
        value: cdktf.stringToHclTerraform(this._sourceRepoBranch),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      volume: {
        value: serviceVolumeToHclTerraform(this._volume.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "ServiceVolume",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

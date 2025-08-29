"use strict";
// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service
// generated from terraform resource schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.ServiceVolumeOutputReference = exports.ServiceRegionsList = exports.ServiceRegionsOutputReference = void 0;
exports.serviceRegionsToTerraform = serviceRegionsToTerraform;
exports.serviceRegionsToHclTerraform = serviceRegionsToHclTerraform;
exports.serviceVolumeToTerraform = serviceVolumeToTerraform;
exports.serviceVolumeToHclTerraform = serviceVolumeToHclTerraform;
const cdktf = require("cdktf");
function serviceRegionsToTerraform(struct) {
    if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) {
        return struct;
    }
    if (cdktf.isComplexElement(struct)) {
        throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
    }
    return {
        num_replicas: cdktf.numberToTerraform(struct.numReplicas),
        region: cdktf.stringToTerraform(struct.region),
    };
}
function serviceRegionsToHclTerraform(struct) {
    if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) {
        return struct;
    }
    if (cdktf.isComplexElement(struct)) {
        throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
    }
    const attrs = {
        num_replicas: {
            value: cdktf.numberToHclTerraform(struct.numReplicas),
            isBlock: false,
            type: "simple",
            storageClassType: "number",
        },
        region: {
            value: cdktf.stringToHclTerraform(struct.region),
            isBlock: false,
            type: "simple",
            storageClassType: "string",
        },
    };
    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}
class ServiceRegionsOutputReference extends cdktf.ComplexObject {
    /**
    * @param terraformResource The parent resource
    * @param terraformAttribute The attribute on the parent resource this class is referencing
    * @param complexObjectIndex the index of this item in the list
    * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
    */
    constructor(terraformResource, terraformAttribute, complexObjectIndex, complexObjectIsFromSet) {
        super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
        this.isEmptyObject = false;
    }
    get internalValue() {
        if (this.resolvableValue) {
            return this.resolvableValue;
        }
        let hasAnyValues = this.isEmptyObject;
        const internalValueResult = {};
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
    set internalValue(value) {
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
    get numReplicas() {
        return this.getNumberAttribute('num_replicas');
    }
    set numReplicas(value) {
        this._numReplicas = value;
    }
    resetNumReplicas() {
        this._numReplicas = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get numReplicasInput() {
        return this._numReplicas;
    }
    get region() {
        return this.getStringAttribute('region');
    }
    set region(value) {
        this._region = value;
    }
    resetRegion() {
        this._region = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get regionInput() {
        return this._region;
    }
}
exports.ServiceRegionsOutputReference = ServiceRegionsOutputReference;
class ServiceRegionsList extends cdktf.ComplexList {
    /**
    * @param terraformResource The parent resource
    * @param terraformAttribute The attribute on the parent resource this class is referencing
    * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
    */
    constructor(terraformResource, terraformAttribute, wrapsSet) {
        super(terraformResource, terraformAttribute, wrapsSet);
        this.terraformResource = terraformResource;
        this.terraformAttribute = terraformAttribute;
        this.wrapsSet = wrapsSet;
    }
    /**
    * @param index the index of the item to return
    */
    get(index) {
        return new ServiceRegionsOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
    }
}
exports.ServiceRegionsList = ServiceRegionsList;
function serviceVolumeToTerraform(struct) {
    if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) {
        return struct;
    }
    if (cdktf.isComplexElement(struct)) {
        throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
    }
    return {
        mount_path: cdktf.stringToTerraform(struct.mountPath),
        name: cdktf.stringToTerraform(struct.name),
    };
}
function serviceVolumeToHclTerraform(struct) {
    if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) {
        return struct;
    }
    if (cdktf.isComplexElement(struct)) {
        throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
    }
    const attrs = {
        mount_path: {
            value: cdktf.stringToHclTerraform(struct.mountPath),
            isBlock: false,
            type: "simple",
            storageClassType: "string",
        },
        name: {
            value: cdktf.stringToHclTerraform(struct.name),
            isBlock: false,
            type: "simple",
            storageClassType: "string",
        },
    };
    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}
class ServiceVolumeOutputReference extends cdktf.ComplexObject {
    /**
    * @param terraformResource The parent resource
    * @param terraformAttribute The attribute on the parent resource this class is referencing
    */
    constructor(terraformResource, terraformAttribute) {
        super(terraformResource, terraformAttribute, false);
        this.isEmptyObject = false;
    }
    get internalValue() {
        if (this.resolvableValue) {
            return this.resolvableValue;
        }
        let hasAnyValues = this.isEmptyObject;
        const internalValueResult = {};
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
    set internalValue(value) {
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
    get id() {
        return this.getStringAttribute('id');
    }
    get mountPath() {
        return this.getStringAttribute('mount_path');
    }
    set mountPath(value) {
        this._mountPath = value;
    }
    // Temporarily expose input value. Use with caution.
    get mountPathInput() {
        return this._mountPath;
    }
    get name() {
        return this.getStringAttribute('name');
    }
    set name(value) {
        this._name = value;
    }
    // Temporarily expose input value. Use with caution.
    get nameInput() {
        return this._name;
    }
    // size - computed: true, optional: false, required: false
    get size() {
        return this.getNumberAttribute('size');
    }
}
exports.ServiceVolumeOutputReference = ServiceVolumeOutputReference;
/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/service railway_service}
*/
class Service extends cdktf.TerraformResource {
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
    static generateConfigForImport(scope, importToId, importFromId, provider) {
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
    constructor(scope, id, config) {
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
        // regions - computed: true, optional: true, required: false
        this._regions = new ServiceRegionsList(this, "regions", false);
        // volume - computed: false, optional: true, required: false
        this._volume = new ServiceVolumeOutputReference(this, "volume");
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
    get configPath() {
        return this.getStringAttribute('config_path');
    }
    set configPath(value) {
        this._configPath = value;
    }
    resetConfigPath() {
        this._configPath = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get configPathInput() {
        return this._configPath;
    }
    get cronSchedule() {
        return this.getStringAttribute('cron_schedule');
    }
    set cronSchedule(value) {
        this._cronSchedule = value;
    }
    resetCronSchedule() {
        this._cronSchedule = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get cronScheduleInput() {
        return this._cronSchedule;
    }
    // id - computed: true, optional: false, required: false
    get id() {
        return this.getStringAttribute('id');
    }
    get name() {
        return this.getStringAttribute('name');
    }
    set name(value) {
        this._name = value;
    }
    // Temporarily expose input value. Use with caution.
    get nameInput() {
        return this._name;
    }
    get projectId() {
        return this.getStringAttribute('project_id');
    }
    set projectId(value) {
        this._projectId = value;
    }
    // Temporarily expose input value. Use with caution.
    get projectIdInput() {
        return this._projectId;
    }
    get regions() {
        return this._regions;
    }
    putRegions(value) {
        this._regions.internalValue = value;
    }
    resetRegions() {
        this._regions.internalValue = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get regionsInput() {
        return this._regions.internalValue;
    }
    get rootDirectory() {
        return this.getStringAttribute('root_directory');
    }
    set rootDirectory(value) {
        this._rootDirectory = value;
    }
    resetRootDirectory() {
        this._rootDirectory = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get rootDirectoryInput() {
        return this._rootDirectory;
    }
    get sourceImage() {
        return this.getStringAttribute('source_image');
    }
    set sourceImage(value) {
        this._sourceImage = value;
    }
    resetSourceImage() {
        this._sourceImage = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get sourceImageInput() {
        return this._sourceImage;
    }
    get sourceImageRegistryPassword() {
        return this.getStringAttribute('source_image_registry_password');
    }
    set sourceImageRegistryPassword(value) {
        this._sourceImageRegistryPassword = value;
    }
    resetSourceImageRegistryPassword() {
        this._sourceImageRegistryPassword = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get sourceImageRegistryPasswordInput() {
        return this._sourceImageRegistryPassword;
    }
    get sourceImageRegistryUsername() {
        return this.getStringAttribute('source_image_registry_username');
    }
    set sourceImageRegistryUsername(value) {
        this._sourceImageRegistryUsername = value;
    }
    resetSourceImageRegistryUsername() {
        this._sourceImageRegistryUsername = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get sourceImageRegistryUsernameInput() {
        return this._sourceImageRegistryUsername;
    }
    get sourceRepo() {
        return this.getStringAttribute('source_repo');
    }
    set sourceRepo(value) {
        this._sourceRepo = value;
    }
    resetSourceRepo() {
        this._sourceRepo = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get sourceRepoInput() {
        return this._sourceRepo;
    }
    get sourceRepoBranch() {
        return this.getStringAttribute('source_repo_branch');
    }
    set sourceRepoBranch(value) {
        this._sourceRepoBranch = value;
    }
    resetSourceRepoBranch() {
        this._sourceRepoBranch = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get sourceRepoBranchInput() {
        return this._sourceRepoBranch;
    }
    get volume() {
        return this._volume;
    }
    putVolume(value) {
        this._volume.internalValue = value;
    }
    resetVolume() {
        this._volume.internalValue = undefined;
    }
    // Temporarily expose input value. Use with caution.
    get volumeInput() {
        return this._volume.internalValue;
    }
    // =========
    // SYNTHESIS
    // =========
    synthesizeAttributes() {
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
    synthesizeHclAttributes() {
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
        return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
    }
}
exports.Service = Service;
// =================
// STATIC PROPERTIES
// =================
Service.tfResourceType = "railway_service";
//# sourceMappingURL=index.js.map
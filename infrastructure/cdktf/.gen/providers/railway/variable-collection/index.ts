// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface VariableCollectionConfig extends cdktf.TerraformMetaArguments {
  /**
  * Identifier of the environment the variable collection belongs to.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection#environment_id VariableCollection#environment_id}
  */
  readonly environmentId: string;
  /**
  * Identifier of the service the variable collection belongs to.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection#service_id VariableCollection#service_id}
  */
  readonly serviceId: string;
  /**
  * Collection of variables.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection#variables VariableCollection#variables}
  */
  readonly variables: VariableCollectionVariables[] | cdktf.IResolvable;
}
export interface VariableCollectionVariables {
  /**
  * Name of the variable.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection#name VariableCollection#name}
  */
  readonly name: string;
  /**
  * Value of the variable.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection#value VariableCollection#value}
  */
  readonly value: string;
}

export function variableCollectionVariablesToTerraform(struct?: VariableCollectionVariables | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    name: cdktf.stringToTerraform(struct!.name),
    value: cdktf.stringToTerraform(struct!.value),
  }
}


export function variableCollectionVariablesToHclTerraform(struct?: VariableCollectionVariables | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    name: {
      value: cdktf.stringToHclTerraform(struct!.name),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    value: {
      value: cdktf.stringToHclTerraform(struct!.value),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class VariableCollectionVariablesOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): VariableCollectionVariables | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._name !== undefined) {
      hasAnyValues = true;
      internalValueResult.name = this._name;
    }
    if (this._value !== undefined) {
      hasAnyValues = true;
      internalValueResult.value = this._value;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: VariableCollectionVariables | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._name = undefined;
      this._value = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._name = value.name;
      this._value = value.value;
    }
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

  // value - computed: false, optional: false, required: true
  private _value?: string; 
  public get value() {
    return this.getStringAttribute('value');
  }
  public set value(value: string) {
    this._value = value;
  }
  // Temporarily expose input value. Use with caution.
  public get valueInput() {
    return this._value;
  }
}

export class VariableCollectionVariablesList extends cdktf.ComplexList {
  public internalValue? : VariableCollectionVariables[] | cdktf.IResolvable

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
  public get(index: number): VariableCollectionVariablesOutputReference {
    return new VariableCollectionVariablesOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection railway_variable_collection}
*/
export class VariableCollection extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "railway_variable_collection";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a VariableCollection resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the VariableCollection to import
  * @param importFromId The id of the existing VariableCollection that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the VariableCollection to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_variable_collection", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/variable_collection railway_variable_collection} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options VariableCollectionConfig
  */
  public constructor(scope: Construct, id: string, config: VariableCollectionConfig) {
    super(scope, id, {
      terraformResourceType: 'railway_variable_collection',
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
    this._environmentId = config.environmentId;
    this._serviceId = config.serviceId;
    this._variables.internalValue = config.variables;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // environment_id - computed: false, optional: false, required: true
  private _environmentId?: string; 
  public get environmentId() {
    return this.getStringAttribute('environment_id');
  }
  public set environmentId(value: string) {
    this._environmentId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get environmentIdInput() {
    return this._environmentId;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // project_id - computed: true, optional: false, required: false
  public get projectId() {
    return this.getStringAttribute('project_id');
  }

  // service_id - computed: false, optional: false, required: true
  private _serviceId?: string; 
  public get serviceId() {
    return this.getStringAttribute('service_id');
  }
  public set serviceId(value: string) {
    this._serviceId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get serviceIdInput() {
    return this._serviceId;
  }

  // variables - computed: false, optional: false, required: true
  private _variables = new VariableCollectionVariablesList(this, "variables", false);
  public get variables() {
    return this._variables;
  }
  public putVariables(value: VariableCollectionVariables[] | cdktf.IResolvable) {
    this._variables.internalValue = value;
  }
  // Temporarily expose input value. Use with caution.
  public get variablesInput() {
    return this._variables.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      environment_id: cdktf.stringToTerraform(this._environmentId),
      service_id: cdktf.stringToTerraform(this._serviceId),
      variables: cdktf.listMapper(variableCollectionVariablesToTerraform, false)(this._variables.internalValue),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      environment_id: {
        value: cdktf.stringToHclTerraform(this._environmentId),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      service_id: {
        value: cdktf.stringToHclTerraform(this._serviceId),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      variables: {
        value: cdktf.listMapperHcl(variableCollectionVariablesToHclTerraform, false)(this._variables.internalValue),
        isBlock: true,
        type: "list",
        storageClassType: "VariableCollectionVariablesList",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

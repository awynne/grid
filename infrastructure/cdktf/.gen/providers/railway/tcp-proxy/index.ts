// https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface TcpProxyConfig extends cdktf.TerraformMetaArguments {
  /**
  * Port of the application the TCP proxy points to.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy#application_port TcpProxy#application_port}
  */
  readonly applicationPort: number;
  /**
  * Identifier of the environment the TCP proxy belongs to.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy#environment_id TcpProxy#environment_id}
  */
  readonly environmentId: string;
  /**
  * Identifier of the service the TCP proxy belongs to.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy#service_id TcpProxy#service_id}
  */
  readonly serviceId: string;
}

/**
* Represents a {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy railway_tcp_proxy}
*/
export class TcpProxy extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "railway_tcp_proxy";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a TcpProxy resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the TcpProxy to import
  * @param importFromId The id of the existing TcpProxy that should be imported. Refer to the {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the TcpProxy to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "railway_tcp_proxy", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/terraform-community-providers/railway/0.5.2/docs/resources/tcp_proxy railway_tcp_proxy} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options TcpProxyConfig
  */
  public constructor(scope: Construct, id: string, config: TcpProxyConfig) {
    super(scope, id, {
      terraformResourceType: 'railway_tcp_proxy',
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
    this._applicationPort = config.applicationPort;
    this._environmentId = config.environmentId;
    this._serviceId = config.serviceId;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // application_port - computed: false, optional: false, required: true
  private _applicationPort?: number; 
  public get applicationPort() {
    return this.getNumberAttribute('application_port');
  }
  public set applicationPort(value: number) {
    this._applicationPort = value;
  }
  // Temporarily expose input value. Use with caution.
  public get applicationPortInput() {
    return this._applicationPort;
  }

  // domain - computed: true, optional: false, required: false
  public get domain() {
    return this.getStringAttribute('domain');
  }

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

  // proxy_port - computed: true, optional: false, required: false
  public get proxyPort() {
    return this.getNumberAttribute('proxy_port');
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

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      application_port: cdktf.numberToTerraform(this._applicationPort),
      environment_id: cdktf.stringToTerraform(this._environmentId),
      service_id: cdktf.stringToTerraform(this._serviceId),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      application_port: {
        value: cdktf.numberToHclTerraform(this._applicationPort),
        isBlock: false,
        type: "simple",
        storageClassType: "number",
      },
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
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}

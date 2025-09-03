import { Construct } from "constructs";
import { Environment } from "../.gen/providers/railway/environment";
import { Service } from "../.gen/providers/railway/service";
export interface GridPulseEnvironmentConfig {
    projectId: string;
    environmentName: string;
    railwayToken: string;
    postgresPassword: string;
    sessionSecret: string;
    eiaApiKey?: string;
    dockerImage?: string;
    dockerUsername?: string;
    dockerPassword?: string;
}
export declare class GridPulseEnvironment extends Construct {
    readonly environment: Environment;
    readonly webService: Service;
    readonly postgresService: Service;
    readonly redisService: Service;
    dataService?: Service;
    private readonly config;
    private readonly envPostgresPassword;
    constructor(scope: Construct, id: string, config: GridPulseEnvironmentConfig);
    private createWebServiceVariables;
    addDataService(serviceConfig: {
        cronSchedule?: string;
    }): Service;
}
//# sourceMappingURL=GridPulseEnvironment.d.ts.map
import { Construct } from "constructs";
import { Environment } from "../.gen/providers/railway/environment";
import { Service } from "../.gen/providers/railway/service";
import { ServiceDomain } from "../.gen/providers/railway/service-domain";
import { CustomDomain } from "../.gen/providers/railway/custom-domain";
import { Project } from "../.gen/providers/supabase/project";
import { Settings } from "../.gen/providers/supabase/settings";
export interface GridPulseEnvironmentConfig {
    projectId: string;
    environmentName: string;
    railwayToken: string;
    sessionSecret: string;
    eiaApiKey?: string;
    postgresPassword?: string;
    supabase?: {
        accessToken: string;
        organizationId: string;
        projectName: string;
        databasePassword: string;
        region?: string;
    };
    dockerImage?: string;
    dockerUsername?: string;
    dockerPassword?: string;
    domain?: {
        railwaySubdomain?: string;
        customDomain?: string;
    };
}
export declare class GridPulseEnvironment extends Construct {
    readonly environment: Environment;
    readonly webService: Service;
    readonly postgresService?: Service;
    readonly redisService: Service;
    readonly supabaseProject?: Project;
    readonly supabaseSettings?: Settings;
    readonly serviceDomain?: ServiceDomain;
    readonly customDomain?: CustomDomain;
    dataService?: Service;
    private readonly config;
    private readonly envPostgresPassword?;
    private readonly databaseUrl;
    constructor(scope: Construct, id: string, config: GridPulseEnvironmentConfig);
    private createWebServiceVariables;
    addDataService(serviceConfig: {
        cronSchedule?: string;
    }): Service;
}
//# sourceMappingURL=GridPulseEnvironment.d.ts.map
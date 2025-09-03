"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdktf_1 = require("cdktf");
const ProductionEnvironmentStack_1 = require("./stacks/ProductionEnvironmentStack");
const app = new cdktf_1.App();
// Create production-only stack
const prod = new ProductionEnvironmentStack_1.ProductionEnvironmentStack(app, "gridpulse-prod");
// Optional: Configure Terraform Cloud remote backend when env vars are provided
const org = process.env.TF_CLOUD_ORG;
const workspace = process.env.TF_CLOUD_WORKSPACE;
if (org && workspace) {
    new cdktf_1.CloudBackend(prod, {
        hostname: "app.terraform.io",
        organization: org,
        workspaces: new cdktf_1.NamedCloudWorkspace(workspace),
    });
}
app.synth();
//# sourceMappingURL=main.js.map
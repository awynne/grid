"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdktf_1 = require("cdktf");
const ProductionEnvironmentStack_1 = require("./stacks/ProductionEnvironmentStack");
const app = new cdktf_1.App();
// Create production-only stack
new ProductionEnvironmentStack_1.ProductionEnvironmentStack(app, "gridpulse-prod");
app.synth();
//# sourceMappingURL=main.js.map
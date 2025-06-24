import { exec } from "child_process";
import foundryConfig from "../foundryconfig.json" with { type: "json" };

exec(`cd ${foundryConfig.pf2eRepoPath} && git checkout v13-dev && git pull`);

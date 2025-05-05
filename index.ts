import { config } from "dotenv";
config();

import { allocateAndAssignElasticIP } from "./ec2.js";
import { getOldIpFromCloudflare, updateCloudflareARecords } from "./cloudflare.js";
import { replaceIPInFiles } from "./sftp.js";

const instanceId = "i-0a15c00767b88eaaa";
const privateIp = "172.31.22.106";

(async () => {
    try {
        const newIp = await allocateAndAssignElasticIP(instanceId, privateIp);
        const oldIp = await getOldIpFromCloudflare(process.env.CLOUDFLARE_ZONE_ID!, "zeitvertreib.vip");
        updateCloudflareARecords(process.env.CLOUDFLARE_ZONE_ID!, oldIp, newIp);
        replaceIPInFiles(newIp);
    } catch (err) {
        console.error("Script failed:", err);
    }
})();

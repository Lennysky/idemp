"use strict";
let clients = [
    { id: 1, name: "Kurt", pockemons: ["Pika", "Squirtle"] },
];
function applyPatch(patch) {
    const { op, path, value } = patch;
    // Validate the patch operation
    if (!["add", "remove", "replace"].includes(op)) {
        throw new Error(`Unsupported operation: ${op}`);
    }
    if (!path.startsWith("/clients.pockemons")) {
        throw new Error(`Invalid path: ${path}`);
    }
    // Parse the path to determine the target location
    const pathParts = path.split("/");
    if (pathParts.length !== 3 || pathParts[2] !== "-") {
        throw new Error(`Invalid path format. Expected "/clients.pockemons/-", got: ${path}`);
    }
    // Locate the clients array (assumes only one client for simplicity)
    const targetClient = clients.find(client => client.id === 1);
    if (!targetClient) {
        throw new Error("Target client not found");
    }
    // Apply the patch operation
    switch (op) {
        case "add":
            if (!value) {
                throw new Error("Value must be provided for 'add' operation");
            }
            targetClient.pockemons.push(value);
            break;
        case "remove":
            const indexToRemove = targetClient.pockemons.indexOf(value);
            if (indexToRemove === -1) {
                throw new Error(`Pockemon ${value} not found for removal`);
            }
            targetClient.pockemons.splice(indexToRemove, 1);
            break;
        case "replace":
            if (!value) {
                throw new Error("Value must be provided for 'replace' operation");
            }
            targetClient.pockemons = [value]; // Replace the whole array (modify logic as needed)
            break;
        default:
            throw new Error(`Unsupported operation: ${op}`);
    }
    console.log("Updated clients:", clients);
}
// Example patch operation
const patch = {
    op: "add",
    path: "/clients.pockemons/-",
    value: "Star",
};
try {
    applyPatch(patch);
}
catch (error) {
    console.error(error.message);
}
//# sourceMappingURL=attempt.js.map
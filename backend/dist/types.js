"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.AgentRole = void 0;
const zod_1 = require("zod");
exports.AgentRole = zod_1.z.enum([
    'lead',
    'backend',
    'frontend',
    'content',
    'qa',
    'scheduler'
]);
exports.TaskStatus = zod_1.z.enum([
    'pending',
    'in_progress',
    'completed',
    'failed',
    'waiting_approval'
]);
//# sourceMappingURL=types.js.map
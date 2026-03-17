"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const axios_1 = __importDefault(require("axios"));
const agents_1 = require("../config/agents");
class LLMService {
    deepseekKey;
    openrouterKey;
    minimaxKey;
    constructor() {
        this.deepseekKey = process.env.DEEPSEEK_API_KEY || '';
        this.openrouterKey = process.env.OPENROUTER_API_KEY || '';
        this.minimaxKey = process.env.MINIMAX_API_KEY || '';
    }
    async generate(role, prompt, context) {
        const systemPrompt = agents_1.SYSTEM_PROMPTS[role];
        const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;
        const config = agents_1.MODEL_CONFIG[role];
        switch (config.provider) {
            case 'deepseek':
                return this.callDeepSeek(systemPrompt, fullPrompt);
            case 'openrouter':
                return this.callOpenRouter(config.model, systemPrompt, fullPrompt);
            case 'minimax':
                return this.callMiniMax(systemPrompt, fullPrompt);
            default:
                throw new Error(`Proveedor no soportado: ${config.provider}`);
        }
    }
    async callDeepSeek(system, prompt) {
        const response = await axios_1.default.post('https://api.deepseek.com/v1/chat/completions', {
            model: 'deepseek-coder',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        }, {
            headers: {
                'Authorization': `Bearer ${this.deepseekKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        const content = data.choices[0]?.message?.content || '';
        const tokensUsed = data.usage?.total_tokens || 0;
        const cost = (tokensUsed / 1_000_000) * 1.0;
        return { content, tokensUsed, cost };
    }
    async callOpenRouter(model, system, prompt) {
        // Kimi usa su propia API, no OpenRouter
        if (model.includes('kimi')) {
            return this.callKimi(system, prompt);
        }
        const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
            model: model,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        }, {
            headers: {
                'Authorization': `Bearer ${this.openrouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://officeai.local',
                'X-Title': 'OfficeAI Orchestrator'
            }
        });
        const data = response.data;
        const content = data.choices[0]?.message?.content || '';
        const tokensUsed = data.usage?.total_tokens || 0;
        const cost = (tokensUsed / 1_000_000) * 2.0;
        return { content, tokensUsed, cost };
    }
    async callKimi(system, prompt) {
        const response = await axios_1.default.post('https://api.moonshot.cn/v1/chat/completions', {
            model: 'kimi-k2.5',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        }, {
            headers: {
                'Authorization': `Bearer ${this.openrouterKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        const content = data.choices[0]?.message?.content || '';
        const tokensUsed = data.usage?.total_tokens || 0;
        // Kimi: ~$2.00 por 1M tokens
        const cost = (tokensUsed / 1_000_000) * 2.0;
        return { content, tokensUsed, cost };
    }
    async callMiniMax(system, prompt) {
        const response = await axios_1.default.post('https://api.minimax.chat/v1/text/chatcompletion_v2', {
            model: 'MiniMax-M2.5',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        }, {
            headers: {
                'Authorization': `Bearer ${this.minimaxKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        const content = data.choices[0]?.message?.content || '';
        const tokensUsed = data.usage?.total_tokens || 0;
        const cost = (tokensUsed / 1_000_000) * 1.0;
        return { content, tokensUsed, cost };
    }
}
exports.LLMService = LLMService;
//# sourceMappingURL=llm.js.map
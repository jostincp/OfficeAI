import { AgentRole } from '../types';
export interface LLMResponse {
    content: string;
    tokensUsed: number;
    cost: number;
}
export declare class LLMService {
    private deepseekKey;
    private openrouterKey;
    private minimaxKey;
    private moonshotKey;
    constructor();
    generate(role: AgentRole, prompt: string, context?: string): Promise<LLMResponse>;
    private callDeepSeek;
    private callOpenRouter;
    private callKimi;
    private callMiniMax;
}
//# sourceMappingURL=llm.d.ts.map
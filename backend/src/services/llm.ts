import axios from 'axios';
import { AgentRole } from '../types';
import { SYSTEM_PROMPTS, MODEL_CONFIG } from '../config/agents';

export interface LLMResponse {
  content: string;
  tokensUsed: number;
  cost: number;
}

export class LLMService {
  private deepseekKey: string;
  private minimaxKey: string;
  private moonshotKey: string;

  constructor() {
    this.deepseekKey = process.env.DEEPSEEK_API_KEY || '';
    this.minimaxKey = process.env.MINIMAX_API_KEY || '';
    this.moonshotKey = process.env.MOONSHOT_API_KEY || '';
  }

  async generate(role: AgentRole, prompt: string, context?: string): Promise<LLMResponse> {
    const systemPrompt = SYSTEM_PROMPTS[role];
    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;
    const config = MODEL_CONFIG[role];

    switch (config.provider) {
      case 'deepseek':
        return this.callDeepSeek(systemPrompt, fullPrompt);
      case 'minimax':
        return this.callMiniMax(systemPrompt, fullPrompt);
      case 'moonshot':
        return this.callKimi(systemPrompt, fullPrompt, config.model);
      default:
        throw new Error(`Proveedor no soportado: ${config.provider}`);
    }
  }

  private async callDeepSeek(system: string, prompt: string): Promise<LLMResponse> {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-coder',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.deepseekKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;
    const content = data.choices[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;
    const cost = (tokensUsed / 1_000_000) * 1.0;

    return { content, tokensUsed, cost };
  }

  private async callKimi(system: string, prompt: string, model: string = 'kimi-k2.5'): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.moonshot.ai/v1/chat/completions',
        {
          model: model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
          ],
          temperature: 1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.moonshotKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      const content = data.choices[0]?.message?.content || '';
      const tokensUsed = data.usage?.total_tokens || 0;
      const cost = (tokensUsed / 1_000_000) * 2.0;

      return { content, tokensUsed, cost };
    } catch (error: any) {
      console.error('Error llamando a Moonshot:', error.response?.data || error.message);
      throw error;
    }
  }

  private async callMiniMax(system: string, prompt: string): Promise<LLMResponse> {
    const response = await axios.post(
      'https://api.minimax.chat/v1/text/chatcompletion_v2',
      {
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.minimaxKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;
    const content = data.choices[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;
    const cost = (tokensUsed / 1_000_000) * 1.0;

    return { content, tokensUsed, cost };
  }
}

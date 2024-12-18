export type Platform = 'facebook' | 'twitter' | 'linkedin';

export type GeneratedContent = {
  content: string;
  hashtags: string[];
};

export type PlatformContent = {
  [key in Platform]?: GeneratedContent;
};

export type PromptTemplate = {
  platform: Platform;
  prompt: string;
};

export type PromptHistory = {
  prompt: string;
  timestamp: number;
  platform: Platform;
  success: boolean;
}; 
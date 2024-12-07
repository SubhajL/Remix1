import OpenAI from 'openai';
import { PLATFORM_PROMPTS } from '@/app/lib/openai';
import { Platform, GeneratedContent } from '@/app/types';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { content, platform, customPrompt } = await request.json();
    
    if (!content || !platform) {
      return NextResponse.json(
        { error: 'Content and platform are required' },
        { status: 400 }
      );
    }

    const prompt = customPrompt || PLATFORM_PROMPTS[platform as Platform];
    
    console.log('Making OpenAI request with:', {
      model: "gpt-3.5-turbo-1106",
      platform,
      contentLength: content.length,
      promptLength: prompt.length
    });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0].message.content;
      console.log('OpenAI response:', responseContent);
      
      if (!responseContent) {
        throw new Error('Empty response from OpenAI');
      }

      try {
        const result = JSON.parse(responseContent);
        
        if (!result.content || !Array.isArray(result.hashtags)) {
          console.error('Invalid response structure:', result);
          throw new Error('Invalid response format from OpenAI');
        }
        
        return NextResponse.json(result);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Raw response:', responseContent);
        return NextResponse.json(
          { error: 'Invalid response format from AI' },
          { status: 500 }
        );
      }
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json(
        { error: 'Error communicating with OpenAI' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
} 
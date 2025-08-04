import { saveToken, getToken } from "../config/store";
import { TWITCH_CLIENT_ID, TWITCH_SECRET } from "../config/vars";
import { Token } from "./Storage";

async function getTwitchToken(): Promise<Token> {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_SECRET}&grant_type=client_credentials`;

  const response = await fetch(url, { method: "POST" });
  const data = await response.json() as Token;

  return data;
}

interface LiveStreamResponse {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    tags: string[];
    is_mature: boolean;
  }[];
  status: number;
}

export async function getLiveStreams(streamers: string[], config?: { end: boolean }): Promise<LiveStreamResponse['data']> {
  if (!streamers.length) {
    console.log('required streamers data to get streams');
    throw new Error('No streamers provided');
  }

  const end = config?.end ?? false;

  const queryString = streamers
    .map(item => `user_login=${encodeURI(item)}`)
    .join('&')

  const url = `https://api.twitch.tv/helix/streams?${queryString}`
  const headers = {
    'Client-ID': TWITCH_CLIENT_ID ?? '',
    'Authorization': `Bearer ${getToken()}`
  }
  const options = { method: 'GET', headers };

  const response = await fetch(url, options);
  const rawData = await response.json() as LiveStreamResponse;

  if (rawData.status === 401 && !end) {
    const newToken = await getTwitchToken();
    await saveToken(newToken);
    return getLiveStreams(streamers, { end: true });
  }

  return rawData.data.filter(item => item.type === 'live');
}


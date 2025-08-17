import { saveToken, getToken, getWatchedStreamersFromFile, WatchedStreamer } from "../config/store";
import { STREAMER_WATCHED_FILE, TWITCH_CLIENT_ID, TWITCH_SECRET } from "../config/vars";
import { processStreams } from "./Notifier";
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
    subscribers: string[]; // this doesn't come from Twitch
  }[];
  status: number;
}

export async function getLiveStreams(streamers: WatchedStreamer[], config?: { end: boolean }): Promise<LiveStreamResponse['data']> {
  if (!streamers.length) {
    console.log('required streamers data to get streams');
    throw new Error('No streamers provided');
  }

  const end = config?.end ?? false;

  const queryString = streamers
    .map(item => `user_login=${encodeURI(item.channel)}`)
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

  if (rawData.status === 400) {
    const error = new Error("some of the channels doesn't exist");
    (error as Error & { code: number }).code = 400;
    throw error;
  }

  return rawData.data
    .filter(item => item.type === 'live')
    .map(item => {
      const subscribers = streamers.find(streamer => streamer.channel === item.user_login)?.subscribers ?? [];
      return { ...item, subscribers }
    })
}

export async function checkStreamings() {
  console.log('checking streamings...');

  const watchedStreamers = getWatchedStreamersFromFile(STREAMER_WATCHED_FILE);
  
  console.log('channels watched:', watchedStreamers.map(item => item.channel));

  const streams = await getLiveStreams(watchedStreamers);
  console.log('twitch streams:', streams)

  await processStreams(streams)

  console.log('notifications sent');
}

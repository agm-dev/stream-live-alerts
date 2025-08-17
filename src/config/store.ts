import { readFileSync, writeFileSync } from 'node:fs';
import { STORE_FILE, STREAMER_WATCHED_CSV_HEADER_0, STREAMER_WATCHED_CSV_HEADER_1, STREAMER_WATCHED_FILE } from "./vars";
import { LiveStreamer, Token } from '../services/Storage';

let liveStreamers: LiveStreamer[] = [];
let token: Token | null = null;

export function loadStoreData() {
  try {
    const jsonContent = readFileSync(STORE_FILE, 'utf-8')
    const data = JSON.parse(jsonContent)
    liveStreamers = data.liveStreamers ?? [];
    token = data.token
  } catch (err) {
    console.log('there is no saved data in the store')
  }
}

export function saveStreamers(streamers: LiveStreamer[]) {
  liveStreamers = [...streamers];

  const data = JSON.stringify({ liveStreamers, token }, null, 2);

  try {
    writeFileSync(STORE_FILE, data, 'utf-8')
  } catch (err) {
    console.log('error on saving data', err)
  }
}

export function saveToken(newToken: Token) {
  token = newToken

  const data = JSON.stringify({ liveStreamers, token }, null, 2);

  try {
    writeFileSync(STORE_FILE, data, 'utf-8')
  } catch (err) {
    console.log('error on saving data', err)
  }
}

export interface WatchedStreamer {
  channel: string;
  subscribers: string[];
}

export function getWatchedStreamersFromFile(filePath: string): WatchedStreamer[] {
  const csvContent = readFileSync(filePath, 'utf-8');

  const lines = csvContent.split('\n');

  const values = lines.slice(1).map(line => line.split(','));

  return values.map(values => ({
    channel: values[0].trim(),
    subscribers: values[1].trim().split(';'),
  }));
}

export const getToken = () => token?.access_token ?? '';

export const getLiveStreamers = () => liveStreamers

export function getWatchedStreamers(subscriber: string): string[] {
  const data = getWatchedStreamersFromFile(STREAMER_WATCHED_FILE);
  return data
    .filter(item => item.subscribers.includes(subscriber))
    .map(item => item.channel);
}

export function addWatchedStreamer(channel: string, subscriber: string) {
  const watchedStreamers = getWatchedStreamersFromFile(STREAMER_WATCHED_FILE);

  let streamData = watchedStreamers.find(i => i.channel.toLowerCase() === channel.toLowerCase());

  if (streamData?.subscribers.includes(subscriber)) {
    return; // already exists
  } else if (streamData) {
    streamData.subscribers.push(subscriber);
  } else {
    streamData = {
      channel,
      subscribers: [subscriber],
    }
  }

  const newValue = watchedStreamers.map(data => {
    if (data.channel === channel) {
      return streamData;
    }
    return data;
  })

  const csvContent = [
    [STREAMER_WATCHED_CSV_HEADER_0, STREAMER_WATCHED_CSV_HEADER_1].join(','),
    ...newValue.map(data => [
      data.channel,
      data.subscribers.join(';')
    ].join(','))
  ].join('\n');

  writeFileSync(STREAMER_WATCHED_FILE, csvContent, 'utf-8');
}

export function removeWatchedStreamer(channel: string, subscriber: string) {
  const watchedStreamers = getWatchedStreamersFromFile(STREAMER_WATCHED_FILE);

  const newContent = watchedStreamers
    .filter(item => item.channel.toLowerCase() !== channel.toLowerCase() || (item.subscribers.length === 1 && item.subscribers[0] === subscriber))
    .map(item => {
      if (item.channel.toLowerCase() !== channel.toLowerCase()) {
        return item;
      }
      return {
        channel: item.channel,
        subscribers: item.subscribers.filter(value => value !== subscriber),
      }
    });

  const csvContent = [
    [STREAMER_WATCHED_CSV_HEADER_0, STREAMER_WATCHED_CSV_HEADER_1].join(','),
    ...newContent.map(data => [
      data.channel,
      data.subscribers.join(';')
    ].join(','))
  ].join('\n');

  writeFileSync(STREAMER_WATCHED_FILE, csvContent, 'utf-8');

  const updatedStreamers = liveStreamers
    .map(item => {
      if (item.user_name !== channel) {
        return item;
      }

      return {
        ...item,
        subscribers: item.subscribers.filter(value => value !== subscriber),
      }
    })
    
  saveStreamers(updatedStreamers);
}

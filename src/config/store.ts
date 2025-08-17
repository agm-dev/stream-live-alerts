import { readFileSync, writeFileSync } from 'node:fs';
import { MAX_CHANNELS_ALLOWED, SECONDARY_USERS_IDS, STORE_FILE, STREAMER_WATCHED_CSV_HEADER_0, STREAMER_WATCHED_CSV_HEADER_1, STREAMER_WATCHED_FILE } from "./vars";
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

  const valueLines = lines.slice(1).map(line => line.split(','));

  const parsed = valueLines
    .map(line => ({
      channel: line?.[0]?.trim() ?? '',
      subscribers: line?.[1]?.trim().split(';').filter(i => i.length) ?? [],
    }))
    .filter(i => i.channel.length && i.subscribers.length)

  return parsed;
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

  const channelIsInTheList = watchedStreamers.some(item => item.channel === channel);

  const newValue: WatchedStreamer[] = channelIsInTheList ?
    watchedStreamers.map(item => {
      if (item.channel !== channel) {
        return item;
      }

      return {
        channel: item.channel,
        subscribers: item.subscribers.includes(subscriber) ? item.subscribers : [...item.subscribers, subscriber],
      }
    }) :
    [...watchedStreamers, {
      channel,
      subscribers: [subscriber],
    }]

  const csvContent = [
    [
      STREAMER_WATCHED_CSV_HEADER_0, STREAMER_WATCHED_CSV_HEADER_1].join(','),
      ...newValue.map(data => [
        data.channel,
        data.subscribers.join(';')
      ].join(','))
    ].join('\n');

  writeFileSync(STREAMER_WATCHED_FILE, csvContent, 'utf-8');
}

export function removeWatchedStreamer(channel: string, subscriber: string) {
  const watchedStreamers = getWatchedStreamersFromFile(STREAMER_WATCHED_FILE);

  const channelIsInTheList = watchedStreamers.some(item => item.channel === channel);

  const newContent: WatchedStreamer[] = channelIsInTheList ? 
    watchedStreamers
      .map(item => ({
        channel: item.channel,
        subscribers: item.channel === channel ? item.subscribers.filter(value => value !== subscriber) : [...item.subscribers]
      }))
      .filter(item => !!item.subscribers.length) :
    [...watchedStreamers];

  const csvContent = [
    [
      STREAMER_WATCHED_CSV_HEADER_0, STREAMER_WATCHED_CSV_HEADER_1].join(','),
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

export function userCanSubscribeToMoreChannels(user_id: string): boolean {
  const watchedStreamers = getWatchedStreamersFromFile(STREAMER_WATCHED_FILE);  
  const subscribedChannels = watchedStreamers.filter(item => item.subscribers.includes(user_id))
  const isSecondaryUser = SECONDARY_USERS_IDS.includes(user_id);

  if (!isSecondaryUser) {
    return true;
  }

  const hasRoomForMoreSubscriptions = subscribedChannels.length < MAX_CHANNELS_ALLOWED;

  return hasRoomForMoreSubscriptions;
}
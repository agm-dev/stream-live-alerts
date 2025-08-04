import { getWatchedStreamers, loadStoreData } from "./config/store"
import { processStreams } from "./services/Notifier"
import { getLiveStreams } from "./services/Twitch"

(async () => {
  loadStoreData();

  const watchedStreamers = getWatchedStreamers();
  console.log('channels watched:', watchedStreamers);

  const streams = await getLiveStreams(watchedStreamers);
  console.log('twitch streams:', streams)

  await processStreams(streams)

  console.log('notifications sent');
})()

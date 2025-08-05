import { job } from "./config/cron";
import { loadStoreData } from "./config/store"
import { launchTelegramBot } from "./services/Telegram";

loadStoreData();

launchTelegramBot();

job.start();

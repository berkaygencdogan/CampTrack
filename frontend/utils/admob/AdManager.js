// adManager.js
import { showInterstitial } from "./useInterstitial";

let instance = null; // ✔ Singleton koruması

class AdManager {
  constructor() {
    if (instance) return instance; // ✔ ikinci kez oluşturmayı engelle
    instance = this;

    this.interval = null;

    this.resetAll();
    this.startTimer();

    return instance;
  }

  resetAll() {
    this.timeCounter = 0;
    this.locationVisitCounter = 0;
    this.profileVisitCounter = 0;
    this.commentSendCounter = 0;
    this.teamCreateCounter = 0;
  }

  startTimer() {
    // ✔ Eski timer varsa durdur
    if (this.interval) clearInterval(this.interval);

    // ✔ Yeni timer başlat
    this.interval = setInterval(() => {
      this.timeCounter += 1;

      if (this.timeCounter >= 300) {
        this.triggerAd("5dk");
      }
    }, 1000);
  }

  triggerAd(reason) {
    showInterstitial();
    this.resetAll();
  }

  // --- diğer tetikleyiciler ---
  onLocationDetailOpen() {
    this.locationVisitCounter += 1;
    if (this.locationVisitCounter >= 2) {
      this.triggerAd("location");
    }
  }

  onProfileVisit() {
    this.profileVisitCounter += 1;
    if (this.profileVisitCounter >= 1) {
      this.triggerAd("profile");
    }
  }

  onTeamCreate() {
    this.teamCreateCounter += 1;
    if (this.teamCreateCounter >= 1) {
      this.triggerAd("team");
    }
  }

  onCommentSend() {
    this.commentSendCounter += 1;
    if (this.commentSendCounter >= 1) {
      this.triggerAd("comment");
    }
  }
}

export default new AdManager(); // ✔ tek instance dışa aktar

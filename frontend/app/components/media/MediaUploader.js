// components/media/MediaUploader.js
import * as ImagePicker from "expo-image-picker";

const MAX_MEDIA = 10;

export default class MediaUploader {
  /**
   * Media seçme fonksiyonu
   * @param {number} existingCount - Mevcut media sayısı (sıra + mevcut)
   * @returns Array of { type, uri, base64, mime }
   */
  static async pick(existingCount = 0) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos", "livePhotos"],
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return [];

      let selected = result.assets.map((item) => {
        const isVideo = item.type === "video";
        const mime = isVideo
          ? "video/mp4"
          : `image/${item.uri.split(".").pop() || "jpeg"}`;

        return {
          type: isVideo ? "video" : "image",
          uri: item.uri,
          base64: item.base64 || null,
          mime,
        };
      });

      // LIMIT KONTROLÜ
      const total = existingCount + selected.length;
      if (total > MAX_MEDIA) {
        alert(`Max ${MAX_MEDIA} media allowed.`);
        const allowed = MAX_MEDIA - existingCount;
        return selected.slice(0, allowed);
      }

      return selected;
    } catch (err) {
      console.log("MEDIA PICK ERROR:", err);
      return [];
    }
  }
}

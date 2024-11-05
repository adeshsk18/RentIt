import https from "https";

const geocodeBaseURL = "https://geocode.maps.co/search?q=";

function useGeocode(address) {
  return new Promise((resolve, reject) => {
    const url = `${geocodeBaseURL}${encodeURIComponent(address)}&api_key=${process.env.GEOCODE_API_KEY}`;

    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const jsonResponse = JSON.parse(data);
            if (jsonResponse && jsonResponse.length > 0) {
              const { lat, lon } = jsonResponse[0];

              resolve({ lat, lon });
            } else {
              reject("Unknown Location");
            }
          } catch (error) {
            reject(`Error parsing response: ${error.message}`);
          }
        });
      })
      .on("error", (error) => {
        reject(`Error occurred while fetching geocode: ${error.message}`);
      });
  });
}

class NominatimMapGeoCoder {
  constructor(options = {}) {
    this.baseUrl = "https://nominatim.openstreetmap.org/search";

    this.userAgent = options.userAgent || "hr_backend";
    this.lastRequestTime = 0;
    this.minDelay = 1000;
  }

  async _enforceRateLimit() {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - this.lastRequestTime;

    if (timeSinceLastRequest < this.minDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minDelay - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  async getGeocodeUsingGeocodeAPI(searchText) {
    try {
      const coordinates = await useGeocode(searchText);
      return coordinates;
    } catch (err) {
      return null;
    }
  }

  async geocode(searchText) {
    await this._enforceRateLimit();

    const params = new URLSearchParams({
      q: searchText,
      format: "json",
      limit: 1,
      addressdetails: 1,
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: "GET",
      headers: {
        "User-Agent": this.userAgent,
      },
    });

    if (!response.ok) {
      const res = await this.getGeocodeUsingGeocodeAPI(searchText);
      if (!res) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        return res;
      }
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error("Unknown Location");
    }

    const result = data[0];
    return {
      lat: result.lat,
      lon: result.lon,
      //displayName: result.display_name,
      //addressDetails: result.address,
      //boundingBox: result.boundingbox,
      //type: result.type,
      //importance: result.importance,
    };
  }
}

class CachedGeocoder extends NominatimMapGeoCoder {
  constructor(options = {}) {
    super(options);
    this.cache = new Map();
    this.maxSize = options.maxCacheSize || 1000;
    this.cleanupInterval = options.cleanupInterval || 3600000;
    this.startCleanupInterval();
  }

  startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  cleanup() {
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);

      this.cache = new Map(entries.slice(0, this.maxSize));
    }
  }

  async getGeocode(searchText) {
    const cacheKey = searchText.trim().toLowerCase();
    const cachedResult = this.cache.get(cacheKey);

    if (cachedResult) {
      cachedResult.lastAccessed = Date.now();
      return cachedResult.data;
    }

    let coordinates;

    try {
      const result = await super.geocode(searchText);
      coordinates = result;
    } catch (err) {
      coordinates = null;
      //console.log("Geocoder Error:", err);
    }

    this.cache.set(cacheKey, {
      data: coordinates,
      lastAccessed: Date.now(),
    });

    return coordinates;
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

const cachedGeocoder = new CachedGeocoder({
  userAgent: "rentit_backend/1.0",
});

const nullLoc = { lat: "-48.8767", lon: "-123.3933" }; // point nemo

const getGeocordinates = async (address) => {
  const response = await cachedGeocoder.getGeocode(address);
  return [response || nullLoc, response ? true : false];
};

export default getGeocordinates;

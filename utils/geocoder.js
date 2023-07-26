const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "VkNBny03sFlGqtIFjuO7JNm8AAGC1A9O",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

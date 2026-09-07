module.exports = {
  process() {
    return 'module.exports = "";';
  },
  getCacheKey() {
    return 'static-asset-stub';
  },
};

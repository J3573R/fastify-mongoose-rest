module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.4.18',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },
  useSharedDBForAllJestWorkers: false,
};

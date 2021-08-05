module.exports = {
  reactStrictMode: true,
}

module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      } ,
    })

    return config
  },
}

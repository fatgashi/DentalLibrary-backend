module.exports = {
    apps : [{
      name: "Dental",
      script: "./server-side/index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }
module.exports = {
    apps : [{
      name: "Dental",
      script: "./server-side/index.js",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "",
      }
    }]
  }

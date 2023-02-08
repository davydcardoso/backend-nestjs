module.exports = {
  apps: [
    {
      name: 'SMARTPD - V:1.0.0',
      script: 'node dist/main',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL:
          'postgresql://postgres:dv@_7469@localhost:5432/smartpd_test?schema=public',
      },
    },
  ],
};

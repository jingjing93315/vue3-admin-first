/*
  环境配置封装
*/
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/31891d3679c108535021300e0aead2c7/api',
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://www.fastmock.site/mock/31891d3679c108535021300e0aead2c7/api',
  },
  prod: {
    baseApi: '//future.com/api',
    mockApi: 'https://www.fastmock.site/mock/31891d3679c108535021300e0aead2c7/api',
  }
}

export default {
  env,
  mock: false,
  ...EnvConfig[env],
  namespace: 'manage'
}
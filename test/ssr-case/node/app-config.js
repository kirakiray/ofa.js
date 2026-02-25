// Application configuration for ofa.js
export default {
  // Routes configuration
  routes: {
    '/': '/home',
    '/home': '/home',
    '/about': '/about'
  },
  
  // Global data or settings
  data: {
    title: 'ofa.js SSR Demo',
    version: '1.0.0'
  },
  
  // Other configurations
  settings: {
    debug: true,
    ssr: true
  }
};
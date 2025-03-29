import { coreAPI } from './api';

// VIP услуги
export const vipAPI = {
  getVipServices: () => coreAPI.get('/vip/services'),
  submitVipRequest: (requestData) => coreAPI.post('/vip/requests', requestData),
  getUserVipStatus: (userId) => coreAPI.get(`/vip/status/${userId}`),
  updateVipStatus: (userId, statusData) => coreAPI.put(`/vip/status/${userId}`, statusData),
  getVipEvents: () => coreAPI.get('/vip/events'),
  registerForVipEvent: (eventId, registrationData) => coreAPI.post(`/vip/events/${eventId}/register`, registrationData),
};

export default vipAPI; 
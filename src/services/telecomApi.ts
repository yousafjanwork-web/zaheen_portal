import axios from "axios";

const BASE =
"https://subgateway.fitsworld.com.pk/zongcharging/api";

export const sendPin = (msisdn:string, serviceId:string) => {

  return axios.get(`${BASE}/send-pin`, {
    params:{ msisdn, serviceId }
  });

};

export const verifyPin = (msisdn:string, pin:string, serviceId:string) => {

  return axios.get(`${BASE}/verify-pin`, {
    params:{ msisdn, serviceId, pin }
  });

};

export const subscribeUser = (msisdn:string, serviceId:string) => {

  return axios.get(`${BASE}/subscribe`, {
    params:{
      msisdn,
      serviceId,
      subMethod:"WEB",
      transactionId:Date.now()
    }
  });

};

export const checkSubscriberStatus = (msisdn:string, serviceId:string) => {

  return axios.get(`${BASE}/subscriber/status`, {
    params:{ msisdn, serviceId }
  });

};
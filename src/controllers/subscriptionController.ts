import {
 sendPin,
 verifyPin,
 subscribeUser,
 checkSubscriberStatus
} from "@/services/telecomApi";

export const startSubscription = async (
 msisdn:string,
 serviceId:string,
 isAuto:boolean
)=>{

 if(isAuto){

   const res = await subscribeUser(msisdn,serviceId);
   return res.data;

 }

 const res = await sendPin(msisdn,serviceId);
 return res.data;

};

export const confirmPin = async(
 msisdn:string,
 pin:string,
 serviceId:string
)=>{

 const verify = await verifyPin(msisdn,pin,serviceId);

 if(verify.data.status==="SUCCESS"){

   const sub = await subscribeUser(msisdn,serviceId);

   return sub.data;

 }

 return verify.data;

};
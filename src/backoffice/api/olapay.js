import axios from 'axios';
import https from 'https'
import { Api } from '../api/api.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const agent = new https.Agent({  
   rejectUnauthorized: false
 });
 const  headers= {
   "Access-Control-Allow-Origin": "true",
   'Content-type': 'application/json',
} 

export var OlaPay = {

   HttpCommunication :async function(url, data){     
      var xhr = null;
      if(window.XMLHttpRequest)  xhr = new XMLHttpRequest()
      else 
      {
         try{ xhr = new window.ActiveXObject('Microsoft.XMLHttp');  }
         catch(e){ xhr = new window.ActiveXObject('msxml2.xmlhttp'); }
      }

      xhr.open("POST", url, false);
      try {
         xhr.onreadystatechange=function()
         {
            if(xhr.status==200) {
            //   ('Status 200'); 
         }}
        xhr.send(data);
         if (xhr.status != 200) {
         //  (`Error ${xhr.status}: ${xhr.statusText}`);
         } else {      
            return xhr.response;
         }
       } catch(err) {
      //  ("Request failed");
         // err;
       }
  },

    async getDevice(ip, port, ssl){
       try {
        let url = ''
        if(ssl) url = `https://${ip}:${port}/api/device`
        else url = `http://${ip}:${port}/api/device`

        const item = {}
        
       const response =  await axios.post(url, item, {headers: headers},{ httpsAgent: agent })
        if(response){          
            alert(response);
            return response;
        }
       } catch (error) {
           error;           
       }
    }, 

    async saleEmv(ip, port, ssl, data){
        try {
         let url = ''
         if(ssl) url = `https://${ip}:${port}/api/sale/emv `
         else url = `http://${ip}:${port}/api/sale/emv `
         const invoiceSequence = await Api.getInvoiceSequence(null)
         
         const item = {
            'Sale': {
               "Tip": data.tip,               
               "Amount": data.total,    
               "orderID": invoiceSequence.data,
               "CardDataSource": "SWIPE",    
               "Qty": "1",    
               "SubTotal": data.subtotal,    
               "Tax": data.tax,   
               "Print": "yes"
            }
           
         }  
         const response =  await axios.post(url , JSON.stringify(item), {headers: headers}, { httpsAgent: agent })
         if(response.status === 200 && response.data.saleResponse.error === '0'){
         
            const response1 = {
               'ref': response.data.saleResponse.ref
            }
            return response1;
         }
            
        } catch (error) {
            error;
            
        }
     }, 

    async saleManual(ip, port, ssl, data){
      try {
         let url = ''
         if(ssl) url = `https://${ip}:${port}/api/sale/manual`
         else url = `http://${ip}:${port}/api/sale/sale/manual`
         const invoiceSequence = await Api.getInvoiceSequence(null)
         data.orderID = invoiceSequence.data;
      
         const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
        
         if(response.status ===200 && response.data.saleResponse.error ==='0'){
            const response1 = {
               "total": response.data.saleResponse.totalAmount,
               "transId":response.data.saleResponse.transactionID,
               "accountNumber": response.data.saleResponse.maskedCardNumber,
               "expirationCard": response.data.saleResponse.expireDate,
               "accountType": response.data.saleResponse.cardType,
               "method": 'OlaPay',               
               "moto": true,
           }
            return response1;
         }
         return false
       
          
      } catch (error) {
          error;
          return false
          
      }
   }, 

   async status(ip, port, ssl, data){
      try {
       let url = ''
       if(ssl) url = `https://${ip}:${port}/api/status`
       else url = `http://${ip}:${port}/api/sale/status`      
    
      const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
      if(response.status ===200 && response.data.response.Status ==='PASS'){
         const response1 = {
            "total": response.data.response.amount,
            "transId":response.data.response.trans_id,
            "accountNumber": "",
            "expirationCard": "",
            "accountType": response.data.response.card_payment_type,
            "method": 'OlaPay',               
            "moto": true,
        }
         return response1;
      }
      return false
          
      } catch (error) {
          error;
          
      }
   },

   async print(ip, port, ssl, data){
      try {
       let url = ''
       if(ssl) url = `https://${ip}:${port}/api/print`
       else url = `http://${ip}:${port}/api/print`      
    
       await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent });
      
          
      } catch (error) {
          error;
          
      }
   },

   async search(ip, port, ssl, data){
      try {
       let url = ''
       if(ssl) url = `https://${ip}:${port}/api/search`
       else url = `http://${ip}:${port}/api/sale/search`
       
      const transToSearch = data.Search.trans_id;
    
      const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
      if(response.status === 200 && response.data.searchResponse.error === '0'){
         if(transToSearch === response.data.searchResponse.response[0].trans_id){
          
            const response1 = {
               "total": response.data.searchResponse.response[0].amount,
               "transId":response.data.searchResponse.response[0].trans_id,           
               "transType":response.data.searchResponse.response[0].trans_type,           
               "accountType": response.data.searchResponse.response[0].card_payment_type,
               "method": 'OlaPay',
            }
            return response1;
         }
         return false;         
      }
      return false
          
      } catch (error) {
          error;
          
      }
   },

   async authorizeEmv(ip, port, ssl, data){
      try {
       let url = ''
       if(ssl) url = `https://${ip}:${port}/api/authorize/emv`
       else url = `http://${ip}:${port}/api/authorize/emv`
       const invoiceSequence = await Api.getInvoiceSequence(null)
       
       const item = {
         'Authorize': {
            "Tip": data.tip,               
            "Amount": data.total,    
            "orderID": invoiceSequence.data,
            "CardDataSource": "SWIPE",    
            "Qty": "1",    
            "SubTotal": data.subtotal,    
            "Tax": data.tax,   
            "Print": "yes"
         }         
       }  
       const response =  await axios.post(url , JSON.stringify(item), {headers: headers}, { httpsAgent: agent })
      if(response.status === 200 && response.data.authorizeResponse.error === '0'){
      
         const response1 = {
            'ref': response.data.authorizeResponse.ref
         }
         return response1;
      }
          
      } catch (error) {
          error;
          
      }
   }, 

  async authorizeManual(ip, port, ssl, data){
    try {
       let url = ''
       if(ssl) url = `https://${ip}:${port}/api/authorize/manual`
       else url = `http://${ip}:${port}/api/sale/authorize/manual`
       const invoiceSequence = await Api.getInvoiceSequence(null)
       data.orderID = invoiceSequence.data;
    
       const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
       if(response.status ===200 && response.data.authorizeResponse.error ==='0'){
         const response1 = {
            "total": response.data.authorizeResponse.totalAmount,
            "transId":response.data.authorizeResponse.transactionID,
            "accountNumber": response.data.authorizeResponse.maskedCardNumber,
            "expirationCard": response.data.authorizeResponse.expireDate,
            "accountType": response.data.authorizeResponse.cardType,
            "method": 'OlaPay',
            "ref": response.data.authorizeResponse.Ref,
            "moto": true,
        }
         return response1;
      }
      return false
        
    } catch (error) {
        error;
        
    }
 }, 

 async capture(ip, port, ssl, data){
   try {
    let url = ''
    if(ssl) url = `https://${ip}:${port}/api/capture`
    else url = `http://${ip}:${port}/api/sale/capture`      
 
    const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
    if(response.status === 200 && response.data.captureResponse.error === '0'){
      const response1 = response.data.captureResponse.transactionID
      return response1;
    }
   } catch (error) {
       error;       
   }
},

   async goReturn(ip, port, ssl, data){
      try {
      let url = ''
      if(ssl) url = `https://${ip}:${port}/api/return`
      else url = `http://${ip}:${port}/api/sale/return`      
   
      const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
      if(response.status === 200 && response.data.returnResponse.error === '0'){
         const response1 ={
            'transactionID': response.data.returnResponse.transactionID,
            'total': response.data.returnResponse.returnAmount,
         }
         return response1;
      }
            
      } catch (error) {
         error;
      }
         
   },

   async goVoid(ip, port, ssl, data){
      try {
      let url = ''
      if(ssl) url = `https://${ip}:${port}/api/void`
      else url = `http://${ip}:${port}/api/sale/void`      
   
      const response =  await axios.post(url , JSON.stringify(data), {headers: headers}, { httpsAgent: agent })
      if(response.status === 200 && response.data.voidResponse.error === '0'){
         const response1 ={
            'transactionID': response.data.voidResponse.transactionID,
            'total': response.data.voidResponse.voidedAmount,
         }
         return response1;
      }
      return false;
         
      } catch (error) {
         error;
         
   }
},




}
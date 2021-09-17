<template>

  <div id="demo">

     <!-- <div style="margin-right:33%; margin-left:33%">
        <ion-button color="primary" @click="initialize()" style="float: left">Initialize</ion-button>
        <ion-button color="success" @click="doCredit()">DoCredit</ion-button>
        <ion-button color="secondary" @click="showModal()">Show Modal</ion-button>
    </div> -->

    <!-- <div> -->
      <!-- <iframe src="https://sandbox.payfabric.com/Payment/Web/Transaction/Process?key=21062901218440&token=2:4ue4aigcrvke" height="400" width="800" name="demo"> -->
      <!-- <iframe src="https://sandbox.payfabric.com/Payment/Web/Transaction/ResponsiveProcess?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYXlGYWJyaWNfVjMiLCJpYXQiOiIxNjI0OTgxMDc0IiwiZXhwIjoiMTYyNDk4MTk3NCIsImF1ZCI6IlBheW1lbnRQYWdlIiwic3ViIjoiMjEwNjI5MDEyMTg0NDAiLCJpbnN0IjoiMjlhYjdlMDgtMjlmNy00MDNhLWEwZmYtMThmMjZiZjZjZDgxIiwiZGV2aWNlIjoiOTExMjA4NTItODkxZC00NTI2LTljZGMtNGYxYzQ3Mzg2NzA5IiwiZGNuIjoiMiIsInN1cHBvcnRlZFBheW1lbnRNZXRob2RzIjpbeyJ0eXBlIjoiQ3JlZGl0Q2FyZCIsInNyYyI6IlVSTCIsImF0dHJpYnV0ZXMiOm51bGx9XX0.3gM_h53HIGVbtON168OnT1NirCxXmHwodSNHyrhPyJY" height="400" width="800" name="demo">
              <p>Su navegador no es compatible con iframes</p>
      </iframe>
    </div> -->

    <!--<div style="margin-right:33%; margin-left:33%">
        <ion-button color="primary" @click="tokenCreate()" style="float: left">Token Create</ion-button>
        <ion-button color="success" @click="createTransaction()">Create transaction</ion-button>
    </div> -->

    <!-- <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
        <ion-input type="text" name="name"
        @input="name = $event.target.value" 
        v-bind:value="name">
        </ion-input>
    </ion-item> -->

    <!-- CONNECTED WITH a930 DEVICE -->
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>DEMO - CONECTION WITH a930</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>IP</ion-label>
        <ion-input type="text" name="ip"
        @input="ip = $event.target.value" 
        v-bind:value="ip">
        </ion-input>
    </ion-item>

    <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>PORT</ion-label>
        <ion-input type="text" name="port"
        @input="port = $event.target.value" 
        v-bind:value="port">
        </ion-input>
    </ion-item>

    <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>Amount</ion-label>
        <ion-input type="number" name="amount"
        @input="amount = $event.target.value" 
        v-bind:value="amount">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Tax</ion-label>
        <ion-input type="number" name="tax"
        @input="tax = $event.target.value" 
        v-bind:value="tax">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Tip</ion-label>
        <ion-input type="number" name="tip"
        @input="tip = $event.target.value" 
        v-bind:value="tip">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">First Name</ion-label>
        <ion-input type="text" name="firstname"
        @input="firstname = $event.target.value" 
        v-bind:value="firstname">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Last Name</ion-label>
        <ion-input type="text" name="lastname"
        @input="lastname = $event.target.value" 
        v-bind:value="lastname">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Transaction Number</ion-label>
        <ion-input type="number" name="transactionnumber"
        @input="transactionnumber = $event.target.value" 
        v-bind:value="transactionnumber">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Clerk</ion-label>
        <ion-input type="number" name="clerk"
        @input="clerk = $event.target.value" 
        v-bind:value="clerk">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Invoice Number</ion-label>
        <ion-input type="number" name="invoicenumber"
        @input="invoicenumber = $event.target.value" 
        v-bind:value="invoicenumber">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Token</ion-label>
        <ion-input type="text" name="token"
        @input="token = $event.target.value" 
        v-bind:value="token">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Card Number</ion-label>
        <ion-input type="number" name="cardnumber"
        @input="cardnumber = $event.target.value" 
        v-bind:value="cardnumber">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Product Description</ion-label>
        <ion-input type="text" name="productDescription"
          @input="productDescription = $event.target.value" 
          v-bind:value="productDescription">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Card Present</ion-label>
        <ion-input type="text" name="cardpresent"
        @input="cardpresent = $event.target.value" 
        v-bind:value="cardpresent">
        </ion-input>
    </ion-item>
    <ion-item>
        <p>SSL</p>
        <ion-checkbox
            slot="end"
            @ionChange="ssl=$event.target.checked"
            :checked="ssl"
            >
        </ion-checkbox>
    </ion-item>

    <div>
        <ion-button color="primary" @click="sale()" style="float: left">SALE</ion-button>
        <ion-button color="secondary" @click="authorize()" style="float: left">AUTHORIZE</ion-button>
        <ion-button color="light" @click="authIncremental()" style="float: left">AUTHORIZE INC</ion-button>
        <ion-button color="tertiary" @click="capture()" style="float: left">CAPTURE</ion-button>
        <ion-button color="danger" @click="refund()" style="float: left">REFUND</ion-button>
        <ion-button color="success" @click="voide()" style="float: left">VOID</ion-button>
        <ion-button color="success" @click="example()" style="float: left">EXAMPLE</ion-button>
    </div>

    <div style="margin: 1px solid red">
        {{response}}
    </div>

    <!-- <div>
      <iframe :src="url" height="400" width="800" name="demo">
              <p>Su navegador no es compatible con iframes</p>
      </iframe>
    </div> -->

    <!-- <div id="payButton">

      <ion-button color="primary" @click="getUTC()">GetUtc</ion-button>
      <ion-button color="primary" @click="getSignature()">GetSignature</ion-button> -->
  
      <!-- <button api_access_id="b964756e3e0e60700f1bf1f8adc9f21e"
                method="sale"
                version_number="2.0"
                location_id="115161"
                :utc_time="utc_time" 
                hash_method="md5"
                :signature="signature"
                callback="oncallback"
                total_amount="50.00"
                order_number="A1234">
        Pay Now</button> -->

        <!-- <form method='Redirect' action= 'https://swp.paymentsgateway.net/co/default.aspx'><table cellSpacing='0' cellPadding='0' border='0'><tr><td align='right' width='300'></td><td align='left' width='200'><input type='hidden' name='pg_api_login_id' value='hfIU9scKMj'/></td></tr><tr><td align='right' width='300'></td><td align='left' width='200'><input type="submit" value='Pay Now'><br></td></tr></table></form>

    </div> -->

   <!-- <ion-button api_access_id="442f701ee5d25cf1b4ab6592d0b670a5"
  method="sale"
  version_number="2.0"	
  xdata_1="custom field"
  line_item_header="color,size"
  line_item_1="red,size 10"
  save_token="true" 
  location_id="277674"
  utc_time="637599022750760960" 
  hash_method="md5"
  signature="177a3ed9949a7a7b214cba047fba96ff"
  order_number="A030">
Pay Now</ion-button>

<div id="cont">
  <ion-button @click="sendMail()">Send Mail</ion-button>
  <ion-button @click="preview()">Preview</ion-button>
</div> -->

<!-- <div>
    <ion-button @click="sendMess()"></ion-button>
</div> -->

  </div>

</template>

<script>

import { Devices } from '../api/devices.js';
import moment from 'moment-timezone';
import MD5 from "crypto-js/md5";
import { Api } from '../api/api.js';
// import HMACMD5 from "crypto-js/hmac-md5"
// import DevicePayment from './DevicePayment.vue';
// import axios from 'axios';

export default {
    
  name: 'demo',
   
  data () {

      return {
        ip: '127.0.0.1',
        port: '10009',
        ssl: false,

        amount: 0,
        tax: '',
        tip: '',
        firstname: '',
        lastname: '',
        transactionnumber: '',
        clerk: '',
        invoicenumber: '',
        token: '',
        cardnumber: '',
        cardpresent: '',

        ccode: '',
        productDescription: '',

        response: '',

        utc_time: '',
        signature: '',
        url: 'https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=hfIU9scKMj&pg_billto_postal_name_company=&pg_billto_postal_name_first=&pg_billto_postal_name_last=&pg_billto_postal_street_line1=&pg_billto_postal_city=&pg_billto_postal_stateprov=&pg_billto_postal_postalcode=&pg_billto_telecom_phone_number=&pg_billto_online_email=&pg_transaction_type=10&pg_total_amount=59&pg_scheduled_transaction=1&pg_schedule_frequency=20&pg_schedule_continuous=1&pg_schedule_quantity=0&pg_version_number=2.0&pg_utc_time=637593803277390000&pg_transaction_order_number=A001&pg_customer_token=A001&pg_paymethod_token=A001&pg_paymethod_token=true&pg_ts_hash=be80dbc4a2c733ca2975d04707bf0275&pg_ts_hash=be80dbc4a2c733ca2975d04707bf0275&pg_save_token=true'
      }
      
  },
  created: function(){
      window.addEventListener('message',function(event) {
      var objMsg
      objMsg = JSON.parse(event.data);
      // For best security practice, only accept event message from specified 
      //domain.
      if(event.origin !== 'https://sandbox.payfabric.com') return;
      // your code      
      switch(objMsg.Event) {
        case "OnSaveTransactionCompleted":
            alert("Save transaction complete")
            break
        case "OnTransactionCompleted":
            alert("Transaction complete")
            break
        case "OnWalletCreateCompleted":
            alert("Wallet create complete")
            break
        case "OnWalletUpdateCompleted":
            alert("Wallet update complete")
            break
      }
      },false)

  


      this.utc_time = this.getUTC()
      document.getElementById("pay")

      this.loadTemplate()

  },
  
  methods: {
   
    preview(){
        this.$router.push({
            name: 'EMPreview'
        })
    },
    sendMail(){
        let items = {
          "email": 'miguel.augusto1987@gmail.com',
          "mess": this.loadTemplate(),
          "subject": 'test'
        };

        Api.sendEmail(items)
        .then(response => {
           response
        })
        .catch(e => {
            e;
        })
    },
    loadTemplate(){
        let template = '<!DOCTYPE html>' +
        '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<meta name="x-apple-disable-message-reformatting">' +
        '<title></title>' +
        '<style>' +
        'table, td, div, h1, p {' +
        'font-family: Arial, sans-serif;' +
        '}' +
        '@media screen and (max-width: 530px) {' +
        '.unsub {' +
        'display: block;' +
        'padding: 8px;' +
        'margin-top: 14px;' +
        'border-radius: 6px;' +
        'background-color: #555555;' +
        'text-decoration: none !important;' +
        'font-weight: bold;' +
        '}' +
        '.col-lge {' +
        'max-width: 100% !important;' +
        '}' +
        '}' +
        '@media screen and (min-width: 531px) {' +
        '.col-sml {' +
        'max-width: 27% !important;' +
        '}' +
        '.col-lge {' +
        'max-width: 73% !important;' +
        '}' +
        '}' +
        '</style>' +
        '</head>' +
        '<body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">' +
        '<div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">' +
        '<table role="presentation" style="width:100%;border:none;border-spacing:0;">' +
        '<tr>' +
        '<td align="center" style="padding:0;">' +
          '<table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">' +
            '<tr>' +
              '<td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">' +
                '<a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/logo.png" width="165" alt="Logo" style="width:80%;max-width:165px;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;background-color:#ffffff;">' +
                '<h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Welcome to our responsive email!</h1>' +
                '<p style="margin:0;">Welcome to our responsive email Description, <a href="http://www.example.com/" style="color:#e50d70;text-decoration:underline;">Email</a>, Description.</p>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">' +
                '<a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-2.png" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">' +
                '<div class="col-sml" style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:14px;color:#363636;">' +
                  '<img src="https://assets.codepen.io/210284/icon.png" width="115" alt="" style="width:80%;max-width:115px;margin-bottom:20px;">' +
                '</div>' +
                '<div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">' +
                  '<p style="margin-top:0;margin-bottom:12px;">Nullam mollis sapien vel cursus fermentum. Integer porttitor augue id ligula facilisis pharetra. In eu ex et elit ultricies ornare nec ac ex. Mauris sapien massa, placerat non venenatis et, tincidunt eget leo.</p>' +
                  '<p style="margin-top:0;margin-bottom:18px;">Nam non ante risus. Vestibulum vitae eleifend nisl, quis vehicula justo. Integer viverra efficitur pharetra. Nullam eget erat nibh.</p>' +
                  '<p style="margin:0;"><a href="https://example.com/" style="background: #ff3884; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Claim yours now</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>' +
                '</div>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">' +
                '<a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-1.png" width="540" alt="" style="width:100%;height:auto;border:none;text-decoration:none;color:#363636;"></a>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;background-color:#ffffff;">' +
                '<p style="margin:0;">Duis sit amet accumsan nibh, varius tincidunt lectus. Quisque commodo, nulla ac feugiat cursus, arcu orci condimentum tellus, vel placerat libero sapien et libero. Suspendisse auctor vel orci nec finibus.</p>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">' +
                '<p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p>' +
                '<p style="margin:0;font-size:14px;line-height:20px;">&reg; Someone, Somewhere 2021<br><a class="unsub" href="http://www.example.com/" style="color:#cccccc;text-decoration:underline;">Unsubscribe instantly</a></p>' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td>' +
      '</tr>' +
    '</table>' +
  '</div>' +
'</body>' +
'</html>';
        return template;
    },

    //PayButton Methods

    getUTC(){
       
        let d = new Date().getTime();
        d.toLocaleString('en-US', { timeZone: 'America/Chicago' })
      

     
        return 621355968000000000

    },

    getSignature(){
      const data = "442f701ee5d25cf1b4ab6592d0b670a5|sale|2.0||"+this.utc_time+"|A030||";
      const signature = MD5(data, "c477ce46b6fcbad91bb30ebd5f69488f")
      return signature.toString()
    },

    oncallback(e){
      e
    },

    oncallbackRes(res){
     res
    },

    //End PayButton Methods

    example(){
       (moment().format('HHmmss'))
    },

    callback(res){

        
          if (res[4] == '000000')
          {
              this.response = res.data;             
          }
          else if (res[4] == '100001')
          {
              this.response = res.data
          }
          else if (res[4] == '000100')
          {
              this.response = res.data
          }
          else{
              this.response = res.data
          }
            
        },

    async sale(){    

      const data = {
          "transactionType": '01',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,
          // 'commercialInformation': this.commercialInformation(),
          "productDescription": this.productDescription,
          "destinationZipCode": this.ccode       
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      this.response = anw
    },
    async authorize(){
      const data = {
          "transactionType": '03',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      this.response = anw
    },
    async authIncremental(){
      const data = {
          "transactionType": '33',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      this.response = anw
    },
    async capture(){
      const data = {
          "transactionType": '04',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      this.response = anw
    },
    async refund(){
      const data = {
          "transactionType": '02',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      this.response = anw
    },
    async voide(){
      const data = {
          "transactionType": '16',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      this.response = anw
    },

  
  }

}

</script>
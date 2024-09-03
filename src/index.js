import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import data from "./test_data/data.json"
import data2 from "./test_data/data2.json"
import arrayData from "./test_data/array.json"
import qbObjectData from "./test_data/qbObject.json"
import qboLines from "./test_data/qbLines.json"
import object from "./test_data/object.json"
import object2 from "./test_data/object2.json"


function jsonPrep(json){
  console.log("jsonPrep Init...",{json})
  // Attempt to parse the JSON string
  let obj;
  try {
    obj = JSON.parse(json);
    return obj
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return;
  }
}

window.loadApp = (json) => {
  let data
  // Check if json is a string
  if (typeof json == 'string') {
    data = jsonPrep(json)
  } else {
    data = json
  }
  console.log("App Init...")

  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App json={data} />);
};

console.log("version 1.0.3", {
  FUNCTIONS: [
    {
      Name: "loadApp",
      props: [
        {
          path: "dataType: [0] && 'keyToRender'||{} && 'keyToRender'",
          json: {/* theJsonDataToDisplay */},
          settings: {
            hide: ['keys to hide'],
            labels: {'keys to rename':'newLabel'},
            columnOrder: ['keys in desired order'],
            initialSearch: 'search term',
            format: [{key:'keys to format',style:'currency$,decimal2,dateYYYY-MM-DD'}],
          },
          formMap: {
            title: "Your Title Here",
            hide: ['keys to hide'],
            labels: {'keys to rename':'newLabel'},
            format: [{key:'keys to format',style:'currency$,decimal2,dateYYYY-MM-DD'}],
            group: [{keys: ['Keys to Group'], title: 'Subtitle for group'}],
          },
        }
      ]
    }
  ]
});


//ARRAY

//loadApp({path:"[0]fieldData", json:data, settings:{hide:["_","~","f_","E16","OBSI","db"],initialSearch:'',columnOrder:["Name","Email","phone"],format:[{key:"chargeRate",style:"currency"},{key:"fundsAvailable",style:"currency"}],labels: {'chargeRate':'Rate'}}})
//loadApp({path:"[0]customers", json:data2, settings:{columnOrder:["Name","Email"]}})
//loadApp({path:"[0]emails", json:arrayData})

//OBJECT
// loadApp({
//   path:"{}", 
//   json: object2,
//   formMap: {
//     title: "Bob Smith",
//     hide: ['customerId','accountCreationDate','gender','maritalStatus','lastPurchaseDate'],
//     labels: {'addressLine1':'Street', 'addressLine2':'Unit'},
//     format: [
//       {key:'dateOfBirth',style:'dateYYYY-MM-DD'},
//       {key:'lastPurchaseDate',style:'dateYYYY-MM-DD'}
//     ],
//     group: [
//       {keys: ['firstName','lastName','jobTitle','company',], title: 'Information'},
//       //{keys: ['addressLine1','addressLine2','city','state','postalCode','country'], title: 'Address'},
//       //{keys: ['email','phoneNumber','preferredContactMethod'], title: 'Contact'},
//     ],
//   }})

// QBO DATA
// loadApp({
//   path:"[0]Line", 
//   json:qboLines, 
//   settings:{
//     hide:["Id","DetailType","LineNum","SalesItemLineDetail"],
//     omit:["SalesItemLineDetail"],
//     columnOrder:["Description","Qty","Price","Amount"],
//     labels: {
//       'SalesItemLineDetail.Qty':'Qty',
//       'SalesItemLineDetail.UnitPrice':'Price'
//     },
//     format:[{key:"Amount",style:"currency"},{key:"Price",style:"currency"}]
//   }
// })
loadApp({
  path:"{}Line", 
  json:qbObjectData,
  formMap: {
    title: "Bill 202408020",
    hide:["Allow","value","Custom","Exchange","HomeTotalAmt","EmailStatus","GlobalTaxCalculation","Linked","MetaData","PrintStatus","SyncToken","domain","sparse"],
    labels: {
      'BillEmail.Address':'Email',
      'CustomerRef.name':'Customer',
      'TxnTaxDetail.TotalTax':'GST',
      'TxnDate':'Date Issued',
      'TotalAmt':'Total'
    },
    omit: ['CurrencyRef','CustomerRef','TxnTaxDetail','ShipAddr'],
    format: [
      {key:'GST',style:'currency$'},
      {key:'Total',style:'currency$'},
      {key:'Date Issued',style:'dateYYYY-MM-DD'}
    ],
    //group: [{keys: ['Keys to Group'], title: 'Subtitle for group'}],
    Line: {
      settings:{
        hide:["Id","DetailType","LineNum","SalesItemLineDetail"],
        omit:["SalesItemLineDetail"],
        columnOrder:["Description","Qty","Price","Amount"],
        labels: {
          'SalesItemLineDetail.Qty':'Qty',
          'SalesItemLineDetail.UnitPrice':'Price'
        },
        format:[{key:"Amount",style:"currency"},{key:"Price",style:"currency"}]
      }
    }
  }
})
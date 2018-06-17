import gql from 'graphql-tag';

export default gql`
mutation UpdateInvoice($InvoiceID:Int, $InvoiceNumber:String, $ContractID:Int, $StatusID:Int, $DateRaised:Date, $Value: Float) {
  UpdateInvoice(InvoiceID:$InvoiceID, InvoiceNumber:$InvoiceNumber, ContractID:$ContractID, StatusID:$StatusID, DateRaised:$DateRaised, Value: $Value) {
      InvoiceID, 
      InvoiceNumber, 
      ContractID, 
      ContractDescription, 
      StatusID, 
      StatusDescription, 
      Value, 
      DateRaised
    }
  }
`;
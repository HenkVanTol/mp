import gql from 'graphql-tag';

export default gql`
mutation CreateInvoice($InvoiceNumber:String, $ContractID:Int, $StatusID:Int, $DateRaised:Date, $Value: Float) {
  CreateInvoice(InvoiceNumber:$InvoiceNumber, ContractID:$ContractID, StatusID:$StatusID, DateRaised:$DateRaised, Value: $Value) {
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
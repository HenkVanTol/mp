import gql from 'graphql-tag';

export default gql`
    query InvoiceSearch($InvoiceNumber:String, $StatusID:Int)
    {
        InvoiceSearch (InvoiceNumber: $InvoiceNumber, StatusID: $StatusID) {
            InvoiceID, 
            InvoiceNumber, 
            ContractID, 
            ContractDescription, 
            StatusID, 
            StatusDescription, 
            Value, 
            DateRaised,
            InvoiceStatuses {
                InvoiceStatusID,
                Ref
            }
        }
    }
`;
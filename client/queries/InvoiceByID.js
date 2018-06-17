import gql from 'graphql-tag';

export default gql`
    query InvoiceByID($InvoiceID:Int)
    {
        InvoiceByID (InvoiceID: $InvoiceID) {
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
            },
            Contracts {
                ContractID, 
                Ref
            }
        }
    }
`;
import gql from 'graphql-tag';

export default gql`query {
  InvoiceLookups {
    Contracts {
      Ref
      ContractID
    }
    InvoiceStatuses {
      Ref
      InvoiceStatusID
    }
  }
}
`;
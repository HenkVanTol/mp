import gql from 'graphql-tag';

export default gql`query {
    InvoiceStatuses {
      InvoiceStatusID,
      Ref
    }
  }
`;
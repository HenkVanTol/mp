import gql from 'graphql-tag';

export default gql`
mutation updateAssetMaster($id:Int, $name:String, $description:String, $serial:String, 
  $registration:String, $acquisitionDate: Date, $retirementDate: Date, $hierarchyTypeId: Int) {
  updateAssetMaster(id: $id, name:$name, description:$description, serial:$serial, registration:$registration, 
    acquisitionDate: $acquisitionDate, retirementDate: $retirementDate, hierarchyTypeId: $hierarchyTypeId) {
      name, 
      description, 
      serial, 
      registration,
      acquisitionDate, 
      retirementDate,
      hierarchyTypeId
    }
  }
`;
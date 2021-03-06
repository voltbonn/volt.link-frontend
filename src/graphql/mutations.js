import { gql } from '@apollo/client'

export const saveBlock_Mutation = gql`
  mutation saveBlock ($block: InputBlock!) {
    saveBlock (block: $block) {
		  _id
		  type
		  properties
		  content {
        blockId
        block {
          _id
          type
          properties
          content {
            blockId
          }
          parent
          metadata {
            modified
            modified_by
          }
          permissions
          computed {
            roles
            inherited_block_permissions
          }
        }
      }
		  parent
		  metadata {
        modified
        modified_by
      }
      permissions
      computed {
        roles
        inherited_block_permissions
      }
    }
  }
`

export const archiveBlock_Mutation = gql`
  mutation archiveBlock ($_id: ObjectID!) {
    archiveBlock (_id: $_id)
  }
`

export const unarchiveBlock_Mutation = gql`
  mutation unarchiveBlock ($_id: ObjectID!) {
    unarchiveBlock (_id: $_id)
  }
`

export const moveBlock_Mutation = gql`
  mutation moveBlock ($movingBlockId: ObjectID!, $newParentId: ObjectID!, $newIndex: Int!) {
    moveBlock(movingBlockId: $movingBlockId, newParentId: $newParentId, newIndex: $newIndex)
  }
`

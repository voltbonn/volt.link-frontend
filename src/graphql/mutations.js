import { gql } from '@apollo/client'

export const saveBlock_Mutation = gql`
  mutation saveBlock ($block: InputBlock!) {
    saveBlock (block: $block)
  }
`

export const archiveBlock_Mutation = gql`
  mutation archiveBlock ($_id: ObjectID!) {
    archiveBlock (_id: $_id)
  }
`

export const moveBlock_Mutation = gql`
  mutation moveBlock ($movingBlockId: ObjectID!, $newParentId: ObjectID!, $newIndex: Int!) {
    moveBlock(movingBlockId: $movingBlockId, newParentId: $newParentId, newIndex: $newIndex)
  }
`

import { gql } from '@apollo/client'

export const saveBlock_Mutation = gql`
  mutation saveBlock ($block: InputBlock!) {
    saveBlock (block: $block)
  }
`

export const deleteBlock_Mutation = gql`
  mutation deleteBlock ($_id: ObjectID!) {
    deleteBlock (_id: $_id)
  }
`

export const moveBlock_Mutation = gql`
  mutation moveBlock ($movingBlockId: ObjectID!, $newParentId: ObjectID!, $newIndex: Int!) {
    moveBlock(movingBlockId: $movingBlockId, newParentId: $newParentId, newIndex: $newIndex)
  }
`

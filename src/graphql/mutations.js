import { gql } from '@apollo/client'

export const saveBlock_Mutation = gql`
  mutation saveBlock ($block: InputBlock!) {
    saveBlock (block: $block)
  }
`

export const deleteBlock_Mutation = gql`
  mutation deleteBlock ($_id: ID!) {
    deleteBlock (_id: $_id)
  }
`

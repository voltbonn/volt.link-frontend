import { gql } from '@apollo/client'

export const saveBlock_Mutation = gql`
  mutation saveBlock ($block: InputBlock!) {
    saveBlock (block: $block)
  }
`

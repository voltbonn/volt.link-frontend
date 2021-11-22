import { gql } from '@apollo/client'

export const getBlock_Query = gql`
  query getBlock ($_id: ID!) {
    block (_id: $_id) {
		  _id
		  type
		  properties
		  content {
        blockId
      }
		  parent
		  metadata {
        modified
        created
      }
    }
  }
`

export const getBlocks_Query = gql`
  query getBlocks ($ids: [ID], $types: [String]) {
    blocks (ids: $ids, types: $types) {
      _id
      type
      properties
      content {
        blockId
      }
      parent
      metadata {
        modified
        created
      }
    }
  }
`

export const getBlockBySlug_Query = gql`
  query getBlockBySlug ($slug: ID!) {
    blockBySlug (slug: $slug) {
		  _id
		  type
		  properties
		  content {
        blockId
      }
		  parent
		  metadata {
        modified
        created
      }
      permissions {
        email
        role
      }
    }
  }
`

export const getSelf_Query = gql`
  query getSelf {
    self {
		  logged_in
		  user
		  blockId
    }
  }
`

export const getSiblingBlocks_Query = gql`
  query getSiblingBlocks ($_id: ID!) {
    siblingBlocks (_id: $_id) {
      _id
      type
      properties
    }
  }
`

export const getParentBlocks_Query = gql`
  query getParentBlocks ($_id: ID!) {
    parentBlocks (_id: $_id) {
      _id
      type
      properties
      computed
    }
  }
`

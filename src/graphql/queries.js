import { gql } from '@apollo/client'

export const getBlock_Query = gql`
  query getBlock ($_id: ObjectID!) {
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
      permissions {
        email
        role
      }
    }
  }
`

export const getBlocks_Query = gql`
  query getBlocks ($ids: [ObjectID], $types: [String], $archived: Boolean) {
    blocks (ids: $ids, types: $types, archived: $archived) {
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

export const getBlockBySlug_Query = gql`
  query getBlockBySlug ($slug: ObjectID!) {
    block: blockBySlug (slug: $slug) {
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
  query getSiblingBlocks ($_id: ObjectID!, $types: [String]) {
    blocks: siblingBlocks (_id: $_id, types: $types) {
      _id
      type
      properties
    }
  }
`

export const getParentBlocks_Query = gql`
  query getParentBlocks ($_id: ObjectID!) {
    blocks: parentBlocks (_id: $_id) {
      _id
      type
      properties
      computed
    }
  }
`

export const blockMatchesRoles_Query = gql`
  query blockMatchesRoles ($_id: ObjectID!, $roles: [String]) {
    blockMatchesRoles (_id: $_id, roles: $roles)
  }
`

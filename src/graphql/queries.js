import { gql } from '@apollo/client'

export const getBlock_Query = gql`
  query getBlock ($_id: ObjectID!) {
    block (_id: $_id) {
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
      }
    }
  }
`

export const getBlocks_Query = gql`
  query getBlocks ($ids: [ObjectID], $types: [String], $archived: Boolean, $roots: [ObjectID]) {
    blocks (ids: $ids, types: $types, archived: $archived, roots: $roots) {
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
      userroles
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
      computed {
        sort
      }
    }
  }
`

export const blockMatchesRoles_Query = gql`
  query blockMatchesRoles ($_id: ObjectID!, $roles: [String]) {
    blockMatchesRoles (_id: $_id, roles: $roles)
  }
`

export const checkPath_Query = gql`
  query checkPath ($path: String!) {
    checkPath (path: $path) {
      isOkay
      errors
    }
  }
`

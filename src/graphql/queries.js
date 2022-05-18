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

export const getBlocks_Query = gql`
  query getBlocks ($ids: [String], $slugs: [String], $types: [String], $archived: Boolean, $roots: [ObjectID]) {
    blocks (ids: $ids, slugs: $slugs, types: $types, archived: $archived, roots: $roots) {
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
`

export const getBlocksWithContent_Query = gql`
  query getBlocks ($ids: [String], $slugs: [String], $types: [String], $archived: Boolean, $roots: [ObjectID]) {
    blocks (ids: $ids, slugs: $slugs, types: $types, archived: $archived, roots: $roots) {
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

export const getBlockBySlug_Query = gql`
  query getBlockBySlug ($slug: String!) {
    block: blockBySlug (slug: $slug) {
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

export const checkSlug_Query = gql`
  query checkSlug ($slug: String!) {
    checkSlug (slug: $slug) {
      isOkay
      errors
      existsAsSlug
      existsAsId
    }
  }
`

    }
  }
`

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
				    # contentAsPlaintextPerBlock
				    # contentAsMarkdownPerBlock
				    contentAsPlaintext
				    # contentAsMarkdown
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
				# contentAsPlaintextPerBlock
				# contentAsMarkdownPerBlock
				contentAsPlaintext
				# contentAsMarkdown
      }
    }
  }
`

export const getBlocks_Query = gql`
  query getBlocks ($ids: [ObjectID], $slugs: [String], $types: [String], $archived: Boolean, $roots: [ObjectID], $roles: [String]) {
    blocks (ids: $ids, slugs: $slugs, types: $types, archived: $archived, roots: $roots, roles: $roles) {
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
				# contentAsPlaintextPerBlock
				# contentAsMarkdownPerBlock
				contentAsPlaintext
				# contentAsMarkdown
      }
    }
  }
`

export const getBlocksWithContent_Query = gql`
  query getBlocks ($ids: [ObjectID], $slugs: [String], $types: [String], $archived: Boolean, $roots: [ObjectID] $roles: [String]) {
    blocks (ids: $ids, slugs: $slugs, types: $types, archived: $archived, roots: $roots, roles: $roles) {
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
				    # contentAsPlaintextPerBlock
				    # contentAsMarkdownPerBlock
				    contentAsPlaintext
				    # contentAsMarkdown
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
				# contentAsPlaintextPerBlock
				# contentAsMarkdownPerBlock
				contentAsPlaintext
				# contentAsMarkdown
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
				    # contentAsPlaintextPerBlock
				    # contentAsMarkdownPerBlock
				    contentAsPlaintext
				    # contentAsMarkdown
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
				# contentAsPlaintextPerBlock
				# contentAsMarkdownPerBlock
				contentAsPlaintext
				# contentAsMarkdown
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
        # roles
        # inherited_block_permissions
				# contentAsPlaintextPerBlock
				# contentAsMarkdownPerBlock
				contentAsPlaintext
				# contentAsMarkdown
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

export const search_Query = gql`
  query search ($query: String!, $types: [String], $archived: Boolean) {
    blocks: search (query: $query, types: $types, archived: $archived) {
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
				# contentAsPlaintextPerBlock
				# contentAsMarkdownPerBlock
				contentAsPlaintext
				# contentAsMarkdown
      }
    }
  }
`

export const getLastModifiedBlocks_Query = gql`
  query getLastModifiedBlocks ($first: Int, $types: [String], $archived: Boolean) {
    lastModifiedBlocks (first: $first, types: $types, archived: $archived) {
    	_id
      type
      properties
      metadata {
        modified
        modified_by
      }
      permissions
      computed {
        roles
        inherited_block_permissions
				contentAsPlaintext
      }
    }
  }
`

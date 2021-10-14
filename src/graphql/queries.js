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
        lastModified
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
        lastModified
        created
      }
      permissions {
        email
        role
      }
    }
  }
`

export const getBlocksByType_Query = gql`
  query getBlocksByType ($type: String!) {
    blocksByType (type: $type) {
      _id
      type
      properties
      content {
        blockId
      }
      parent
      metadata {
        lastModified
        created
      }
    }
  }
`

export const getBlocksByIds_Query = gql`
  query getBlocksByIds ($ids: [ID]) {
    blocksByIds(ids: $ids) {
      _id
      type
      properties
    	content {
      	blockId
    	}
      parent
      metadata {
        lastModified
        created
      }
    }
  }
`


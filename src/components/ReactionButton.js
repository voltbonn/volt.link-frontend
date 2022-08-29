import React, { useState, useEffect, useCallback } from 'react'

import Twemoji from '../components/Twemoji.js'
import useLoadBlocks from '../hooks/useLoadBlocks.js'
import useSaveBlock from '../hooks/useSaveBlock.js'
import { useArchiveBlocks } from '../hooks/useArchiveBlock.js'

import classes from './ReactionButton.module.css'

const ReactionButton = ({ className = '', style = {}, forBlockId = '' }) => {
  const defaultReactions = ['⭐️'] // , '💜', '👍', '👎', '📌'

  const [userReactions, setUserReactions] = useState([])
  const loadBlocks = useLoadBlocks()
  const saveBlock = useSaveBlock()
  const archiveBlocks = useArchiveBlocks()

  const loadUserReactions = useCallback(async () => {
    const loadedUserReactions = (await loadBlocks({
      types: ['reaction'],
      roles: ['owner'],
      archived: false,
    }))
      .filter(block => block.properties.reactionFor === forBlockId)

    console.log('loadedUserReactions', loadedUserReactions)
    setUserReactions(loadedUserReactions)
  }, [forBlockId, loadBlocks])

  useEffect(() => {
    if (typeof forBlockId === 'string' && forBlockId.length > 0) {
      loadUserReactions()
    }
  }, [forBlockId, loadUserReactions])

  const toggleReaction = useCallback(reaction => {
    const filteredUserReactions = userReactions.filter(userReactionBlock => 
      userReactionBlock?.type === 'reaction' &&
      userReactionBlock?.properties?.icon?.type === 'emoji' &&
      userReactionBlock?.properties?.icon?.emoji === reaction
    )

    if (filteredUserReactions.length > 0) {
      // remove reaction
      archiveBlocks({
        ids: filteredUserReactions.map(userReactionBlock => userReactionBlock._id),
        archive: true,
      })
        .then(() => {
          loadUserReactions()
        })
        .catch(error => {
          console.error('error', error)
        })
    } else {
      // add reaction
      const newBlock = {
        type: 'reaction',
        properties: {
          icon: {
            type: 'emoji',
            emoji: reaction,
          },
          reactionFor: forBlockId,
        }
      }

      saveBlock(newBlock)
        .then((data) => {
          console.log('data', data)
          loadUserReactions()
        }).catch(error => {
          console.error('error', error)
        })
    }
  }, [userReactions, forBlockId, archiveBlocks, saveBlock, loadUserReactions])
  
  return <div key={userReactions} className={className} style={style}>
    {
      defaultReactions
        .map(reaction => {
          const filteredUserReactions = userReactions.filter(userReactionBlock =>
            userReactionBlock?.type === 'reaction' &&
            userReactionBlock?.properties?.icon?.type === 'emoji' &&
            userReactionBlock?.properties?.icon?.emoji === reaction
          )

          return <button
            key={reaction}
            className={`
              ${classes.reactionButton}
              ${filteredUserReactions.length > 0 ? classes.selected : ''}
              ${filteredUserReactions.length > 0 ? 'default' : 'text'}
              hasIcon
            `}
            onClick={() => toggleReaction(reaction)}
          >
            <Twemoji className="icon" emojiClassName={classes.emoji} key={reaction} emoji={reaction} />
          </button>
        })
    }
  </div>
}

export default ReactionButton

import React, { createContext, useState, useContext, useCallback } from 'react'

import classes from './OverflowMenu.module.css'

export const OverflowMenuContext = createContext()

function OverflowMenuProvider(props) {
  const [items, setItems] = useState({})

  const updateMenu = useCallback(itemsToAdd => {
    setItems({
      ...items,
      ...itemsToAdd,
    })
  }, [items])

  const removeMenu = useCallback(itemsToRemove => {
    const newItems = items
    for (const key of itemsToRemove) {
      delete newItems[key]
    }
    setItems(newItems)
  }, [items])

  const todoData = { items, updateMenu, removeMenu }

  return <OverflowMenuContext.Provider value={todoData} {...props} />
}

function useOverflowMenu() {
  return useContext(OverflowMenuContext)
}

function OverflowMenu () {
  const { items } = useOverflowMenu()

  const itemKeys = Object.keys(items || {})

  if (itemKeys.length > 0) {
    return (
      <div className={classes.overflow_menu}>
        {
        itemKeys
          .map((key) => {
            if (items[key].menu) {
              return <div key={key} className={classes.menuGroup}>
                {items[key].menu}
              </div>
            }
            return null
          })
          .filter(Boolean)
        }
      </div>
    )
  }

  return null
}

export {
  OverflowMenuProvider,
  useOverflowMenu,
  OverflowMenu,
}


/*
import React, { createContext, useContext, useCallback, useMemo } from 'react'

const OverflowMenuFunctionsContext = createContext({
  addToMenu: () => {},
  removeFromMenu: () => {},
})
OverflowMenuFunctionsContext.displayName = 'OverflowMenuFunctionsContext'

function OverflowMenuProvider({ children }) {
  const addToMenu = useCallback((itemsToAdd) => {
    window.menuItems = {
      ...window.menuItems,
      ...itemsToAdd,
    }
  }, [])

  const removeFromMenu = useCallback((itemsToRemove) => {
    const newMenu = window.menuItems
    for (const key of Object.keys(itemsToRemove)) {
      delete newMenu[key]
    }

    window.menuItems = newMenu
  }, [])

  const functions = useMemo(() => ({
    addToMenu,
    removeFromMenu,
  }), [addToMenu, removeFromMenu])

  return (
    <OverflowMenuFunctionsContext.Provider value={functions}>
      {children}
    </OverflowMenuFunctionsContext.Provider>
  )
}

function useOverflowMenu () {
  return useContext(OverflowMenuFunctionsContext)
}

function OverflowMenu () {
  const menuItems = window.menuItems
  console.log('rerender OverflowMenu', menuItems)

  return <div className="OverflowMenu">
    {Object.keys(menuItems || {}).map((key) => {
      return <div key={key}>{key}</div>
    })}
  </div>
}

export default OverflowMenu

export {
  OverflowMenuProvider,
  useOverflowMenu,
  OverflowMenu,
}
*/

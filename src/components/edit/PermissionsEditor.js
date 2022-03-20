import React, { useState, useCallback, useEffect } from 'react'

import {
  Modal,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as ViewerIcon,
  Edit as EditorIcon,
} from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'

import { Localized, useLocalization } from '../../fluent/Localized.js'

import useUser from '../../hooks/useUser.js'

import FancyInput from './FancyInput.js'
import EmailInput from './EmailInput.js'

import classes from './PermissionsEditor.module.css'

function addTmpIds(array) {
  return [...array].map(obj => {
    const obj_new = { ...obj }
    obj_new.tmp_id = uuidv4()
    return obj_new
  })
}

function LocalizedRole({ role }) {
  return <Localized id={'role_'+role} />
}

function RolesMenu({
  role,
  trigger,
  changeRole,
  removePermission,
}){
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return <>
    {trigger({
      onClick: handleOpen,
    })}

    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        style: {
          maxWidth: '100%',
        },
      }}
    >
        {
          role === 'editor'
          ? <MenuItem onClick={() => changeRole('viewer')}>
              <ListItemIcon>
                <ViewerIcon />
              </ListItemIcon>
              <ListItemText>
                <LocalizedRole role="viewer" />
              </ListItemText>
            </MenuItem>
          : <MenuItem onClick={() => changeRole('editor')}>
              <ListItemIcon>
                <EditorIcon />
              </ListItemIcon>
              <ListItemText>
                <LocalizedRole role="editor" />
              </ListItemText>
            </MenuItem>
        }

        {
          typeof removePermission === 'function'
          ? <MenuItem onClick={removePermission}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText>
                Remove
              </ListItemText>
            </MenuItem>
          : null
        }

        <Divider style={{opacity: 0.2}} />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText>
            Close
          </ListItemText>
        </MenuItem>
    </Menu>
  </>
}

function sortPermissions(permissions) {
  const owner = permissions
    .filter(p => p.role === 'owner')
    .sort((a, b) => a.email.localeCompare(b.email))

  const special = permissions
    .filter(p => p.email === '@volteuropa.org' || p.email === '@public')
    .sort((a, b) => a.email.localeCompare(b.email))

  const other = permissions
    .filter(p => p.role !== 'owner' && p.email !== '@volteuropa.org' && p.email !== '@public')
    .sort((a, b) => a.email.localeCompare(b.email))

  return [
    ...owner,
    ...special,
    ...other,
  ]
}

function PermissionsEditor({
  defaultPermissions,
  open = false,
  onChange,
  onClose,
}) {
  const { getString } = useLocalization()

  const user_data = useUser()
  let user_email = ''
  if (!!user_data) {
    if (!!user_data.user) {
      if (!!user_data.user.email) {
        user_email = user_data.user.email
      }
    }
  }

  const [inputRepaintKey, setInputRepaintKey] = useState(0)
  const [permissions, setPermissions] = useState([])
  const [newEmails, setNewEmails] = useState([])
  const [newRole, setNewRole] = useState('editor')

  const setNewPermission = useCallback(newPermissions => {
    newPermissions = addTmpIds(newPermissions || [])

    if (user_email !== '') {
      const doesNotHaveOwner = newPermissions.filter(permission => permission.role === 'owner').length === 0
      if (doesNotHaveOwner) {
        newPermissions.unshift({ tmp_id: uuidv4(), email: user_email, role: 'owner' })
      }
    }
    
    setPermissions(newPermissions)
  }, [ user_email, setPermissions ])

  useEffect(() => {
    const blockPermissions = defaultPermissions['/']
    if (Array.isArray(blockPermissions)) {
      setNewPermission(blockPermissions)
    } else {
      setNewPermission([])
    }
  }, [ setNewPermission, defaultPermissions ])

  const removePermission = useCallback(email => {
    let newPermissions = permissions.filter(p => p.email !== email)
    if (email === '@volteuropa.org') {
      newPermissions = newPermissions.filter(p => p.email !== '@public')
    }

    const doesNotHaveOwner = newPermissions.filter(p => p.role === 'owner').length === 0
    if (doesNotHaveOwner) {
      newPermissions = newPermissions.filter(p => p.email !== user_email)
      newPermissions.unshift({ tmp_id: uuidv4(), email: user_email, role: 'owner' })
    }

    setPermissions(newPermissions)
    onChange({ '/': newPermissions })
  }, [permissions, user_email, setPermissions, onChange])

  const changeRole = useCallback((email, newRole) => {
    const newPermissions = permissions.map(permission => {
      if (permission.email === email) {
        return {
          ...permission,
          role: newRole,
        }
      }
      return permission
    })

    setPermissions(newPermissions)
    onChange({ '/': newPermissions })
  }, [permissions, setPermissions, onChange])

  const addPermissions = useCallback((newEmails, newRole) => {
    if (newEmails.includes('@public')) {
      newEmails.push('@volteuropa.org')
    }
    let newPermissions = permissions.filter(permission => !newEmails.includes(permission.email))
    for (const newEmail of newEmails) {
      newPermissions.unshift({ tmp_id: uuidv4(), email: newEmail, role: newRole })
    }

    const doesNotHaveOwner = newPermissions.filter(p => p.role === 'owner').length === 0
    if (doesNotHaveOwner) {
      newPermissions = newPermissions.filter(p => p.email !== user_email)
      newPermissions.unshift({ tmp_id: uuidv4(), email: user_email, role: 'owner' })
    }

    setPermissions(newPermissions)
    onChange({ '/': newPermissions })
  }, [permissions, user_email, setPermissions, onChange])

  const addNewPermissionFromInput = useCallback(() => {
    addPermissions(newEmails, newRole)
    setNewEmails([]) // reset the email-input | don't reset the role-input so it can be reused when entering multiple emails after each other // setNewRole('editor')
    setInputRepaintKey(oldInputRepaintKey => oldInputRepaintKey + 1) // redraw the email-input
  }, [ newEmails, newRole, addPermissions ])

  if (!open) {
    return null
  }

  const doesNotHaveVoltEuropa = permissions.filter(permission => permission.email === '@volteuropa.org').length === 0
  const doesNotHavePublic = permissions.filter(permission => permission.email === '@public').length === 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideBackdrop={true}
    >
      <>
        <div className={classes.backdrop} onClick={onClose}></div>

        <div className={classes.dialog}>
          <h1 style={{ margin: '0 0 var(--basis_x4) 0' }}>Give viewing and editing rights</h1>
          <p>Enter @volteuropa.org addresses to give editing rights.<br/>Groups addresses are not supported.</p>
          <div className={classes.inputWrapper} key={inputRepaintKey}>
            <FancyInput className={classes.input}>
              {({ setError }) => (
                <EmailInput
                  multiple={true}
                  onError={setError}
                  defaultValue=""
                  onChange={setNewEmails}
                  aria-label={getString('path_editor_permissions_edit_label')}
                  placeholder={getString('path_editor_permissions_edit_placeholder')}
                  style={{
                    flexGrow: '1',
                    // margin: '0',
                    margin: 'var(--basis) 0',
                    width: 'calc(100% - var(--basis_x2))',
                  }}
                />
              )}
            </FancyInput>
            <RolesMenu
              role={newRole}
              changeRole={setNewRole}
              trigger={triggerProps => <button className={classes.menuButton} {...triggerProps}><LocalizedRole role={newRole} /> <KeyboardArrowDownIcon/></button>}
            />
          </div>

          {
            newEmails.length > 0 && newEmails[0].length > 0
            ? <>
                <hr />

                <div className={classes.actions}>
                  <div></div>
                  <button onClick={addNewPermissionFromInput} className="green" style={{margin: '0'}}>
                    {
                      newEmails.length > 1
                      ? "Add People"
                      : "Add Person"
                    }
                  </button>
                </div>
              </>
            : <>
                {
                  doesNotHaveVoltEuropa || doesNotHavePublic
                  ? <div style={{ marginTop: 'var(--basis_x2)' }}>
                    Make visible for…
                    {
                      doesNotHaveVoltEuropa
                      ? <button onClick={() => addPermissions(['@volteuropa.org'], 'viewer')}>Volt Europa</button>
                      : null
                    }
                    {
                      doesNotHavePublic
                      ? <button onClick={() => addPermissions(['@public'], 'viewer')}>Public</button>
                      : null
                    }
                  </div>
                  : null
                }

                {
                  permissions.length === 0
                   ? null
                   : <hr style={{ opacity: 0.2 }} />
                }

                {
                  sortPermissions(permissions)
                  .map(p => <div key={p.tmp_id} className={classes.permissionRow}>
                    {
                      p.email === '@public'
                        ? <strong>Public</strong>
                        : (
                          p.email === '@volteuropa.org'
                            ? <strong>Volt Europa</strong>
                            : <span>{p.email}</span>
                        )
                    }

                    {
                      p.role === 'owner'
                      ? <strong className={`type_button ${classes.ownerInfo}`}><LocalizedRole role={p.role} /></strong>
                      : <RolesMenu
                          role={p.role}
                          removePermission={() => removePermission(p.email)}
                          changeRole={(newRole) => changeRole(p.email, newRole)}
                          trigger={triggerProps => <button className={classes.menuButton} {...triggerProps}><LocalizedRole role={p.role} /> <KeyboardArrowDownIcon/></button>}
                        />
                    }
                  </div>)
                }

                <hr style={{ opacity: 0.2 }} />

                <div className={classes.actions}>
                  <div></div>
                  <button onClick={onClose} className="green" style={{margin: '0'}}>
                    <Localized id="dialog_done" />
                  </button>
                </div>
              </>
          }
        </div>
      </>
    </Modal>
  )
}

export default PermissionsEditor

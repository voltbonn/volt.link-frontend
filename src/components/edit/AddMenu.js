
import {
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import {
  InsertDriveFileSharp as PageIcon,
  AutoAwesomeSharp as ActionIcon,
  // LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  // Crop75Sharp as ButtonIcon,
  // TitleSharp as HeadlineIcon,
  // NotesSharp as TextIcon,
  // Remove as DividerIcon,
  // EditSharp as EditIcon,
} from '@mui/icons-material'

import useUser from '../../hooks/useUser.js'
import PopoverMenu from '../PopoverMenu.js'
import { Localized } from '../../fluent/Localized.js'

const blockTypeIcons = {
  page: <PageIcon />,
  person: <PersonIcon />,
  action: <ActionIcon />,
}

const types = [
  'page',
  'action',
]

export default function AddMenu ({ trigger, createBlock }) {
  const { loggedIn } = useUser()

  return <>{
    loggedIn
      ? <PopoverMenu
          trigger={trigger}
        >

        <div style={{ marginTop: '8px' }}></div>

        {
          types
            .map(type => (
              <MenuItem key={type} onClick={() => createBlock({ type })}>
                <ListItemIcon>
                  {blockTypeIcons[type]}
                </ListItemIcon>
                <ListItemText>
                  <Localized id={'create_new_'+type} />
                </ListItemText>
              </MenuItem>
            ))
        }

      </PopoverMenu>
    : null
  }</>
}

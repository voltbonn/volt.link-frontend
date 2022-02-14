
import {
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import {
  InsertDriveFileSharp as PageIcon,
  AutoAwesomeSharp as AutomationIcon,
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
  automation: <AutomationIcon />,
}

const types = [
  'page',
  'automation',
]

function AddMenuContent({ createBlock }) {
  return <>
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
  </>
}

function AddMenu ({ trigger, createBlock }) {
  const { loggedIn } = useUser()

  if (loggedIn) {
    return <PopoverMenu trigger={trigger}>
      <div style={{ marginTop: '8px' }}></div>
      <AddMenuContent createBlock={createBlock} />
    </PopoverMenu>
  }

  return null
}

export {
  AddMenuContent,
  AddMenu as default,
}

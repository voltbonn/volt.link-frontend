
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
  Crop75Sharp as ButtonIcon,
  TitleSharp as HeadlineIcon,
  NotesSharp as TextIcon,
  Remove as DividerIcon,
  CodeSharp as CodeIcon,
  CheckBox as CheckboxIcon,
  // EditSharp as EditIcon,
} from '@mui/icons-material'

import useUser from '../../hooks/useUser.js'
import PopoverMenu from '../PopoverMenu.js'
import { Localized } from '../../fluent/Localized.js'

const blockTypeIcons = {
  button: <ButtonIcon />,
  headline: <HeadlineIcon />,
  headline3: <HeadlineIcon />,
  text: <TextIcon />,
  code: <CodeIcon />,
  divider: <DividerIcon />,
  checkbox: <CheckboxIcon />,
  page: <PageIcon />,
  person: <PersonIcon />,
  automation: <AutomationIcon />,
}

const default_types = [
  'page',
  'automation',
]

function AddMenuContent({ createBlock, types }) {
  if (!types || !Array.isArray(types)) {
    types = default_types
  }

  return <>
    {
      types
        .map(type => (
          <MenuItem className="roundMenuItem" key={type} onClick={() => createBlock({ type })}>
            <ListItemIcon>
              {blockTypeIcons[type]}
            </ListItemIcon>
            <ListItemText>
              <Localized id={'block_menu_type_label_'+type} />
            </ListItemText>
          </MenuItem>
        ))
    }
  </>
}

function AddMenu ({ trigger, createBlock, types }) {
  const { loggedIn } = useUser()

  if (loggedIn) {
    return <PopoverMenu trigger={trigger}>
      <div style={{ marginTop: '8px' }}></div>
      <AddMenuContent createBlock={createBlock} types={types} />
    </PopoverMenu>
  }

  return null
}

export {
  AddMenuContent,
  AddMenu as default,
}

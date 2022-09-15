
import {
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import {
  InsertDriveFileSharp as PageIcon,
  LinkSharp as RedirectIcon,
  PersonSharp as PersonIcon,
  Crop75Sharp as ButtonIcon,
  NotesSharp as TextIcon,
  Remove as DividerIcon,
  CodeSharp as CodeIcon,
  CheckBoxSharp as CheckboxIcon,
  // EditSharp as EditIcon,
  ImageSharp as ImageIcon,
  WebStoriesSharp as PosterIcon, // WebStories book bookmark ContactPage CropPortrait Layers Note PhotoAlbum Photo ViewCarousel
} from '@mui/icons-material'

import useUser from '../../hooks/useUser.js'
import PopoverMenu from '../PopoverMenu.js'
import { Localized } from '../../fluent/Localized.js'

const blockTypeIcons = {
  button: <ButtonIcon />,
  text: <TextIcon />,
  code: <CodeIcon />,
  divider: <DividerIcon />,
  checkbox: <CheckboxIcon />,
  page: <PageIcon />,
  person: <PersonIcon />,
  redirect: <RedirectIcon />,
  image: <ImageIcon />,
  poster: <PosterIcon />,
}

const default_types = [
  'page',
  'redirect'
]

function AddMenuContent({ createBlock, types = default_types, close = null }) {
  if (!types || !Array.isArray(types)) {
    types = default_types
  }

  return <>
    {
      types
        .map(type => (
          <MenuItem className="roundMenuItem" key={type} onClick={() => createBlock({ type, close })}>
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
      {
        ({ close }) => <>
          <div style={{ marginTop: '8px' }}></div>
          <AddMenuContent createBlock={createBlock} types={types} close={close} />
        </>
      }
    </PopoverMenu>
  }

  return null
}

export {
  AddMenuContent,
  AddMenu as default,
}

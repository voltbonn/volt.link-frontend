import { useState, useCallback, useEffect } from 'react'
import classes from './Chooser.module.css'

import { Link, useHistory } from 'react-router-dom'

import { withLocalization } from '../fluent/Localized.js'
import useKeyPress from '../hooks/useKeyPress.js'
import Header from '../components/Header.js'

function Chooser({ getString, rightHeaderActions }) {
  const history = useHistory()
  const [forbidden, setForbidden] = useState({})
  const [value, setValue] = useState('')
  const [alreadyExists, setAlreadyExists] = useState(null)
  const [error, setError] = useState('')

  useKeyPress(['Enter'], () => {
    history.push(`/edit/${value}`)
  })

  const handleCheckIfPathExists = useCallback(event => {
    const newValue = (event.target.value || '').toLowerCase()
    setValue(newValue)

    const forbidden_letters = (forbidden.letters || '').split('')
    const newValue_split = (newValue || '').split('')
    const forbidden_letters_filtered = forbidden_letters.filter(value => !newValue_split.includes(value))

    const forbidden_codes = forbidden.codes || []
    const value_is_a_forbidden_code = forbidden_codes.includes(newValue)

    if (value_is_a_forbidden_code) {
      setAlreadyExists(null)
      setError('This code is not allowed.')
    } else if (forbidden_letters_filtered.length < forbidden_letters.length) {
      setAlreadyExists(null)
      setError('This code contains forbidden characters.')
    } else if (newValue === '') {
      setAlreadyExists(null)
      setError('')
    } else {
      setError('')
      fetch(`https://volt.link/exists/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.exists === true) {
            setAlreadyExists(true)
            setError('')
          } else if (newValue_split.includes('.')) {
            setAlreadyExists(null)
            setError('Codes with a dot are restricted to people. Please contact thomas.rosen@volteuropa.org to use volt.link for your Volt Account.')
          } else {
            setAlreadyExists(false)
            setError('')
          }
        })
        .catch(error => {
          console.error(error)
          setAlreadyExists(false)
        })
    }
  }, [setValue, setAlreadyExists, forbidden.letters, forbidden.codes])

  useEffect(() => {
    fetch(`https://volt.link/forbidden_codes/`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('data', data)
        setForbidden(data)
      })
      .catch(error => {
        console.error(error)
        setForbidden({})
      })
  }, [setForbidden])

  return <div>
    <Header
      title="edit.volt.link"
      rightActions={rightHeaderActions || null}
    />

    <div className={`${classes.chooserInput} ${alreadyExists === null ? classes.hideSubmitButton : ''}`}>
      <p className={classes.domainPrefix}>volt.link/</p>
      <input type="text" placeholder={getString('type_a_path')} onChange={handleCheckIfPathExists}/>
      {
        alreadyExists === null
          ? null
          : <Link to={`/edit/${value}`}>
              <button>
              {alreadyExists ? getString('edit_path_button') : getString('create_path_button')}
              </button>
            </Link>
      }
    </div>
    <br/>
    {
      error !== ''
        ? <>
          <h2>Errors</h2>
          <p>{error}</p>
        </>
        : null
    }

    <h2>Restrictions</h2>
    <ul>
      <li>These letters are not allowed: <code>{forbidden.letters || ''}</code> (And of course: Don't use whitespace!)</li>
      <li>
        These paths are not allowed: {
          (forbidden.codes || [])
          .filter(code => !code.includes('/') && !code.includes('.'))
          .flatMap(code => [<code>{code}</code>, ', '])
          .slice(0, -1)
        }
      </li>
      <li>The dot (<code>.</code>) is used for Volt Accounts. Please contact <a href="mailto:thomas.rosen@volteuropa.org">Thomas Rosen</a> to get your personal link.</li>
    </ul>

    <h2>Best Practices</h2>

    <h3>General</h3>
    <ul>
      <li>Keep it short!</li>
      <li>Use hyphens (<code>-</code>) over underscores (<code>_</code>). (Your favorite search provider will thank you :D)</li>
      <li>It is not important if you use upper or lower case letters.</li>
      <li>Use letters people can type. The less international characters the better.</li>
      <li>
        🇪🇺 Emojis are possible. But like before. Use them sparingly and check if others can type and see them on their device.<br/>
        <a href="https://emojipedia.org/emoji-11.0/" target="_blank" rel="noreferrer">Emoji 11</a> and earlier should be okay.<br/>
        And better don't mix emojis and normals letters.
      </li>
    </ul>

    <h3>City Teams</h3>
    <p>Use the name of your city team without the Volt prefix or a common international name.</p>
    <p>
      Example:<br/>
      Volt Bonn → <code>bonn</code><br />
      Volt Köln → <code>köln</code> or <code>cologne</code>
    </p>
    <p>If two cities have the same name, add your country's <a href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes" target="_blank" rel="noreferrer">two letter shortcode</a> before it (eg: <code>de-bonn</code>).</p>

    <h3>Redirects</h3>
    <p>There are three options of naming redirects:</p>
    <ul>
      <li>random letters or words (<code>123abc</code>),</li>
      <li>words describing the redirect content (<code>de-events</code>) and</li>
      <li>words describing where the redirect content is used (<code>flyer-bonn</code>).</li>
    </ul>
    <p>Use a random text or describe where the redirect is used if you'll change the link in the future.</p>

    <h3>Translation</h3>
    <p>You can provide translations for text for these langues:</p>
    <ul>
      <li>English</li>
      <li>Deutsch</li>
      <li>Español</li>
      <li>Francais</li>
      <li>Italiano</li>
      <li>Nederlands</li>
      <li>Portugues</li>
    </ul>
    <p>Contact <a href="mailto:thomas.rosen@volteuropa.org">Thomas</a> for more languages. We'll add more as needed. (We're aspecially interested in people speaking Arabic.)</p>

    <h3>Legal</h3>
    <p>The default imprint is the one from Volt Europa. You can change it to the correct link of your chapter.</p>

    <h3>Statistics</h3>
    <p>As with the whole volt.link project, the statistics are currently in beta.</p>

  </div>
}

export default withLocalization(Chooser)

/*


    <input
      type="text"
      placeholder="title"
      style={{
        marginRight: '0',
        marginLeft: '0'
      }}
    />
    <textarea
      placeholder="description"
      style={{
        marginRight: '0',
        marginLeft: '0'
      }}
    />
*/

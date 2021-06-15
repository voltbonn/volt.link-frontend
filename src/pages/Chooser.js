import React, { useState, useCallback, useEffect } from 'react'
import classes from './Chooser.module.css'

import { Link, useHistory } from 'react-router-dom'

import { withLocalization, Localized } from '../fluent/Localized.js'
import useKeyPress from '../hooks/useKeyPress.js'
import useUser from '../hooks/useUser.js'
import Header from '../components/Header.js'

function Chooser({ getString, rightHeaderActions }) {
  const [user, ] = useUser()
  const username = user.username || ''
  const [userPageAlreadyExists, setUserPageAlreadyExists] = useState(null)

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
      setError('This path is not allowed.')
    } else if (forbidden_letters_filtered.length < forbidden_letters.length) {
      setAlreadyExists(null)
      setError('This path contains forbidden characters.')
    } else if (newValue.startsWith('volt')) {
      setAlreadyExists(null)
      setError('A path can\'t start with "volt".')
    } else if (newValue === '') {
      setAlreadyExists(null)
      setError('')
    } else {
      setError('')
      fetch(`${window.domains.backend}quickcheck/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.allowed === false) {
            setAlreadyExists(null)
            setError('You are not allowed to edit this code.')
          } else {
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
          }
        })
        .catch(error => {
          console.error(error)
          setAlreadyExists(false)
        })
    }
  }, [setValue, setAlreadyExists, forbidden.letters, forbidden.codes])

  useEffect(() => {
    fetch(`${window.domains.backend}forbidden_codes/`, {
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setForbidden(data)
      })
      .catch(error => {
        console.error(error)
        setForbidden({})
      })
  }, [setForbidden])

  useEffect(() => {
    const newValue = (username || '').toLowerCase()

    if (newValue !== '') {
      fetch(`${window.domains.backend}quickcheck/${newValue}`, {
        mode: 'cors',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.allowed === false) {
            setUserPageAlreadyExists(null)
          } else {
            if (data.exists === true) {
              setUserPageAlreadyExists(true)
            } else {
              setUserPageAlreadyExists(false)
            }
          }
        })
        .catch(error => {
          console.error(error)
          setUserPageAlreadyExists(false)
        })
    } else {
      setUserPageAlreadyExists(null)
    }
  }, [username, setUserPageAlreadyExists])

  return <div>
    <Header
      title="edit.volt.link"
      rightActions={rightHeaderActions || null}
    />

    {
      username !== ''
        ? <>
          <h2><Localized id={userPageAlreadyExists === true ? 'edit_user_page_headline' : 'create_user_page_headline'} /></h2>
          <p><Localized id={userPageAlreadyExists === true ? 'edit_user_page_info' : 'create_user_page_info'} /></p>
          <Link to={`/edit/${username}`}>
            <button style={{ marginLeft: '0', marginRight: '0' }}>
              <Localized
                id={userPageAlreadyExists === true ? 'edit_user_page_button' : 'create_user_page_button'}
                vars={{ username }}
              />
            </button>
          </Link>
        </>
        : null
    }
    <h2><Localized id="chooser_any_link_headline" /></h2>
    <p><Localized id="chooser_any_link_info" /></p>

    <div className={`${classes.chooserInput} ${alreadyExists === null ? classes.hideSubmitButton : ''}`}>
      <p className={classes.domainPrefix}>volt.link/</p>
      <input type="text" placeholder={getString('type_a_path')} onChange={handleCheckIfPathExists}/>
      {
        alreadyExists === null
          ? null
          : <Link to={`/edit/${value}`}>
              <button className="green">
              {alreadyExists ? getString('edit_path_button') : getString('create_path_button')}
              </button>
            </Link>
      }
    </div>
    {
      error !== ''
        ? <>
          <h3 className="red">Errors</h3>
          <p>{error}</p>
        </>
        : null
    }

    <br />
    <hr />

    <h2>Restrictions</h2>
    <ul>
      <li>These letters are not allowed: <code>{forbidden.letters || ''}</code> (And of course: Don't use whitespace!)</li>
      <li>
        These paths are not allowed: {
          (forbidden.codes || [])
          .filter(code => !code.includes('/') && !code.includes('.'))
          .flatMap(code => [<code key={code}>{code}</code>, <React.Fragment key={code+'separator'}>, </React.Fragment>])
          .slice(0, -1)
        }
      </li>
      <li>The dot (<code>.</code>) is used for Volt Accounts.</li>
    </ul>

    <h2>Best Practices</h2>

    <h3>General</h3>
    <ul>
      <li>Keep it short!</li>
      <li>Seperate words with hyphens (<code>-</code>). This makes it readable by humans and parsable by search engines. (Try not to use underscores (<code>_</code>). Your favorite search provider will thank you :D)</li>
      <li>It is not important if you use upper- or lower-case letters.</li>
      <li>Use letters people can type. The less international characters the better.</li>
      <li>
        🇪🇺 Emojis are possible. But like before. Use them sparingly and check if others can type and see them on their device.<br/>
        <a href="https://emojipedia.org/emoji-11.0/" target="_blank" rel="noreferrer">Emoji 11</a> and earlier should be okay.<br/>
        And better don't mix emojis and normals letters.
      </li>
    </ul>

    <h3>City Teams</h3>
    <p>Use the name of your city team without the Volt prefix or a common international name.</p>
    <p>If two cities have the same name, add your country's <a href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes" target="_blank" rel="noreferrer">two letter shortcode</a> before it (eg: <code className="filled">de-bonn</code>).</p>
    <p>Use the full city/state/team name if possible. Not everybody knows the abbreviation. But keep it short.</p>
    <p>Example:</p>
    <ul>
      <li>Volt Bonn → <code className="filled">bonn</code></li>
      <li>Volt Köln → <code className="filled">köln</code> or <code className="filled">cologne</code></li>
    </ul>

    <h3>Personal Pages</h3>
    <p>The link of your personal page should match your Volt Europa account.</p>
    <p>We want to look professional, so please don't use your socialmedia handle.</p>
    <p>We are a lot of people in Volt. People with the same first or lastname exist. To prevent name collisions, use your Volt Account username. (The part before the @ sign.)</p>
    <p>Examples for "Thomas Rosen":</p>
    <ul>
      <li>Do → <code className="filled">thomas.rosen</code></li>
      <li>Don't → <code className="filled">thomas_rosen_official_123</code>, <code className="filled">thomas</code> or <code className="filled">rosen</code></li>
    </ul>

    <h3>Redirects</h3>
    <p>There are three options of naming redirects:</p>
    <ul>
      <li>random letters or words (<code className="filled">123abc</code>),</li>
      <li>words describing the redirect content (<code className="filled">de-events</code>) and</li>
      <li>words describing where the redirect content is used (<code className="filled">flyer-bonn</code>).</li>
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
    <p>Contact <a href="mailto:thomas.rosen@volteuropa.org">Thomas</a> for more languages. We'll add more as needed. {/*(We're aspecially interested in people speaking Arabic.)*/}</p>

    <h3>Legal</h3>
    <p>The default imprint is the one from Volt Europa. You can change it to the correct link of your chapter.</p>

    <h3>Statistics</h3>
    <p>As with the whole volt.link project, the statistics are currently in beta.</p>

    <h3>Deletion</h3>
    <p>Links can't be deleted as nobody likes to scan a QR-Code, just to receive an <a href="https://volt.link/error">error page</a>.</p>
    <p>But links can of course be reused. Contact <a href="mailto:thomas.rosen@volteuropa.org">Thomas</a> if you need get access to a link.</p>
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

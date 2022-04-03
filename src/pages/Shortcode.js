import React, { useState, useCallback } from 'react'
import classes from './Shortcode.module.css'

import { useNavigate } from 'react-router-dom'

import { withLocalization, Localized } from '../fluent/Localized.js'
import useKeyPress from '../hooks/useKeyPress.js'
import Header from '../components/Header.js'
import UrlInput from '../components/edit/UrlInput.js'
import FancyInput from '../components/edit/FancyInput.js'

function Redirect({ getString, rightHeaderActions }) {
  const navigate = useNavigate()
  const [redirectLink, setRedirectLink] = useState('')
  const [isSubmittable, setIsSubmittable] = useState(false)
  const [error, setError] = useState('')

  useKeyPress(['Enter'], () => {
    if (isSubmittable) {
      generateRedirectLink()
    }
  })

  const handleRedirectLink = useCallback(value => {
    setRedirectLink(value)

    if (value === '') {
      setIsSubmittable(false)
    } else {
      setIsSubmittable(true)
    }
  }, [setRedirectLink, setIsSubmittable])

  const generateRedirectLink = useCallback(() => {
    if (isSubmittable) {
      const data = {
        use_as: 'redirect',
        redirect: redirectLink,
      }

      fetch(`${window.domains.backend}set_redirect`, {
        mode: 'cors',
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      })
        .then(r => r.json())
        .then(async data => {
          if (typeof data.error === 'string') {
            console.error(data.error)
            setError(data.error)
          } else if (typeof data.code === 'string') {
            navigate(`/${data.code}/edit`)
          } else {
            setError('Undefined Error. Please contact thomas.rosen@volteuropa.org')
          }
        })
        .catch(async error => {
          console.error(error)
          setError(error)
        })
    }
  }, [isSubmittable, redirectLink, navigate])

  return <div>
    <Header
      title={<Localized id="create_shortcode_headline" />}
      rightActions={rightHeaderActions || null}
    />

    <p><Localized id="create_shortcode_info" /></p>

    <div className={`${classes.input} ${isSubmittable === true ? '' : classes.hideSubmitButton }`}>
      <FancyInput
        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
      >
        {({ setError }) => (
          <UrlInput
            onError={setError}
            placeholder={getString('create_shortcode_url_placeholder')}
            onChange={handleRedirectLink}
          />
        )}
      </FancyInput>
      {
        isSubmittable === true
          ? <button className="green" onClick={generateRedirectLink}>
              <Localized id="create_shortcode_url_submit" />
            </button>
          : null
      }
    </div>

    {
      error !== ''
        ? <>
          <h3 className="red"><Localized id="headline_errors" /></h3>
          <p>{error}</p>
        </>
        : null
    }
  </div>
}

export default withLocalization(Redirect)

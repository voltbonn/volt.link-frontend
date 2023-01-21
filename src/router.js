import React from 'react' // , { Suspense }

import {
  createBrowserRouter,
} from 'react-router-dom'

import App from './pages/App.js'
import List from './pages/List.js'
// const Articles = React.lazy(() => import('./pages/articles.js'));
// const Article = React.lazy(() => import('./pages/article.js'));

// function Loading() {
//   return null
//   // return <div>Loading...</div>
// }

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <List />,
      },
      // {
      //   path: 'contact',
      //   element: <Suspense fallback={<Loading />}><Contact /></Suspense>,
      // },
      // {
      //   path: 'articles/:slug',
      //   element: <Suspense fallback={<Loading />}><Article /></Suspense>,
      // },
      {
        path: '*',
        element: <List />,
      },
    ]
  },
]);

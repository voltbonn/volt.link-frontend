import React from 'react' // , { Suspense }

import {
  createBrowserRouter,
  // useRouteError,
} from 'react-router-dom'

import App from './components/App.js'
import Overview from './components/Overview.js'
// const New = React.lazy(() => import('./components/New.js'));
// const Articles = React.lazy(() => import('./components/articles.js'));
// const Article = React.lazy(() => import('./components/article.js'));

// function Loading() {
//   // return null
//   return <div>Loading...</div>
// }
// function ErrorBoundary() {
//   let error = useRouteError();
//   console.error(error);
//   // Uncaught ReferenceError: path is not defined
//   return <div>Error!<br /><code>{String(error)}</code></div>;
// }

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Overview />,
      },
      // {
      //   path: 'new',
      //   element: <Suspense fallback={<Loading />}><New /></Suspense>,
      // },
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
        element: <Overview />,
      },
    ]
  },
]);

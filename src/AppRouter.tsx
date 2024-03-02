import React from 'react'
import Homescreen from './Screens/HomeScreen/HomeScreen';
import App from './App';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HistoryScreen from './Screens/HistoryScreen/HistoryScreen';

function AppRouter() {
  const router = createBrowserRouter(createRoutesFromElements(
        <Route path='/' element={<App />}>
          <Route index={true} path='/' element={<Homescreen />}></Route>
          <Route index={true} path='/history' element={<HistoryScreen />}></Route>
        </Route>
      ));

  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter
import React from "react";
import ReactDOM from "react-dom/client";
import ErrorPage from "./routes/errorr-page";
import EditContact, {
  action as editAction
} from './routes/edit'
import Contact, {
    loader as contactLoader,
    action as contactAction,
} from "./routes/contact";
import {action as destroyAction} from "./routes/destroy";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, { 
    loader as rootLoader,
    action as rootAction } from "./routes/root";
import Index from"./routes/index";

//I start to webpage with CreateBrowserRouter
//I put all my components in this section.
const router = createBrowserRouter(
  createRoutesFromElements(
    //I use route component for every page.
    //I conctact my Root page.
    <Route
      path= "/"
      element= {<Root/>}
      /*I can load my contact on the root component with this code.*/
      loader= {rootLoader}
      action= {rootAction}
      errorElement= {<ErrorPage/>}
    >
      {/*I put my other pages as a children of the Root page.*/}
      <Route errorElement= {<ErrorPage/>}>
        {/**I set the default page instead of blank page. */}
        <Route index element= {<Index/>} />
        {/*I imported my Contact component.
        I want to see my contact component render inside of the Root component.
        I also, import Outlet component in the Root component for this.*/}
        <Route
          path= "contacts/:contactId"
          element= {<Contact />}
          //**I configure the contact with thiscode 
          loader= {contactLoader}
          action= {contactAction}
        />
        {/*I put my EditContact page. I can edit my contact by using this page.*/}
        <Route
          path= "contacts/:contactId/edit"
          element= {<EditContact/>}
          loader= {contactLoader}
          action= {editAction}
        />
        {/*I can delete my contact with these codes.*/}
        <Route
          path= "contacts/:contactId/destroy"
          action= {destroyAction}
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



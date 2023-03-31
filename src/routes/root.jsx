import { useEffect } from "react";
import { Outlet, 
        NavLink,
        useLoaderData,
        Form,
        redirect,
        useNavigation,
        useSubmit, } from "react-router-dom";
import {getContacts, createContact} from "../contacts";


{/*I export loader with this function. So, I can load my contact by using this function on the index component. */}
export async function loader({request}){
    const url = new URL(request.url);
    //I can filter my result by using URLSearchParams
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    //return q from my loader
    return {contacts, q}
}
 {/*I can create my contact with this function. 
  I also, export this function for using in my index component. */}
export async function action(){
    const contact = await createContact();
    //I redirected new contacts to the edit page.
    return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
    //I can access the data and render data on my component.
    const {contacts, q} = useLoaderData(); 
    const navigation = useNavigation();

    //The submit function will serialize and submit any form you pass to it.
    const submit = useSubmit();

    // I define the search spinner.
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    //I synchronize input value with the URL Search Params
    useEffect(()=> {
        document.getElementById("q").value= q;
    }, [q]);
    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            {/*I use Form because  <Form> prevents the browser from sending the request to the server and sends it to your route action instead.
            React Router uses this as a hint to automatically revalidate the data on the page after the action finishes. 
            That means all of your useLoaderData hooks update and the UI stays in sync with your data automatically! */}
            <Form id="search-form" role="search">
              <input
                id="q"
                //I added the search spinner.
                className={searching ? "loading": ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                //I set the default value as my query so 
                //if I refresh my page, the input field will show the query.
                defaultValue={q}
                onChange={(e)=>{
                    const isFirstSearch = q == null;
                    submit(e.currentTarget.form, {
                      //We only want to replace search results, 
                      //not the page before we started searching, 
                      //so we do a quick check if this is the first search 
                      //or not and then decide to replace.
                        replace: !isFirstSearch,
                    })
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {/*I can access and render the data thanks to this code.*/}
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/**I can active the link while editing or seeing knowledge about a contact.
                   * Link cannot take isActive, because of that NavLink must use for this aim.
                   */}
                  <NavLink to={`contacts/${contact.id}`} className={({isActive, isPending})=> 
                  isActive 
                    ? "active"
                    : isPending
                    ? "pending"
                    : ""
                }>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          </nav>
        </div>
        <div 
            id="detail"
            className={
                navigation.state === "loading" ? "loading" : ""
            }>
              {/*I want to render my contact as a child of the root. 
              Because of that I used this component.*/}
            <Outlet/>
        </div>
      </>
    );
  }
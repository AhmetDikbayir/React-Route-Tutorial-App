import { 
  Form, 
  useLoaderData,
  Fetcher,
  useFetcher, } from "react-router-dom";
import {getContact, updateContact} from '../contacts';

//I get the contact with loader from contacts.
export async function loader({params}){
    const contact =  await getContact(params.contactId);
    //I throw a 404 response in the loader.
    if(!contact){
      throw new Response("", {
        status:404,
        statusText: "We cannot find what you want..."
      });
    }
    return {contact};
}
export async function action ({request, params}){
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
    {/**I loaded the contactrs with useLoaderData function. */}
    const { contact } = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          {/*Delete button here. */}
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!window.confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
            >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  //useFetcher allows us to communicate with loaders and 
  //actions without causing a navigation
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if(fetcher.formData){
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    //I use fetcher here.
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
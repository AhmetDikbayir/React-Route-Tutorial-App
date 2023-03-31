import { Form, 
    useLoaderData,
    redirect,
    useNavigate, } from "react-router-dom";
import {updateContact} from "../contacts"

//I can update my contact with this action function.
export async function action({request, params}) {
    const formData = await request.formData();
    const firstName = formData.get("first");
    const lastName = formData.get("last");
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    //Loader and action functions are return a response.
    //The redirect helper just makes it easier to return
    //a response that tells the app to change locations. 
    return redirect(`/contacts/${params.contactId}`);
}
export default function EditContact() {
  const { contact } = useLoaderData();
  //I used useNavigate function to active the cancel button.
  //Thanks to this function we can write where we want to go. 
  //It is not only for cancel.
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button 
            type="button"
            //navigate(-1) is equivalent to hitting the back button.
            onClick={()=>{navigate(-1)}}>Cancel</button>
      </p>
    </Form>
  );
}
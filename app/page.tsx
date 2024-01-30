"use client";

import { useFormState } from "react-dom";
import { sendEmail } from "./actions/send-email";
import SubmitButton from "./submit-button";

const initialState = {
  sent: false,
  errors: {},
};

function ErrorMessage({ message }: { message: string }) {
  return <span className="text-red-600 text-sm">{message}</span>;
}

export default function Home() {
  const [state, sendAction] = useFormState(sendEmail, initialState);
  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-4xl font-medium">Contact</h1>
      <form className="flex flex-col gap-3 w-2/5 mt-10" action={sendAction}>
        <input type="text" name="name" placeholder="Name" required />
        {state.errors?.name && <ErrorMessage message={state.errors.name[0]} />}
        <input type="text" name="email" placeholder="Email" required />
        {state.errors?.email && (
          <ErrorMessage message={state.errors.email[0]} />
        )}
        <textarea
          name="message"
          id="message"
          rows={3}
          placeholder="Message"
          required
        ></textarea>
        {state.errors?.message && (
          <ErrorMessage message={state.errors.message[0]} />
        )}
        <SubmitButton />
        {state.sent && <span className="text-green-600">Message sent!</span>}
      </form>
    </main>
  );
}

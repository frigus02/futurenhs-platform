import React from "react";
import { GetServerSideProps } from "next";
import { getRecoveryFields } from "../../lib/auth";
import { sendEvent } from "../../lib/events";
import { RequestMethodConfig } from "@oryd/kratos-client";
import { redirect } from "../../utils/pages/redirect";

type RecoveryProps = {
  request: string;
  messages: string[] | null;
  formConfig: RequestMethodConfig;
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: RecoveryProps }> => {
  const request = context.query.request;

  if (!request || Array.isArray(request)) {
    return redirect(
      context,
      "/.ory/kratos/public/self-service/browser/flows/recovery"
    );
  }

  const recovery = await getRecoveryFields(request);
  const formConfig = recovery.methods.link.config!;
  const messages = recovery.messages?.map((msg) => msg.text ?? "") ?? null;

  // TODO: This is just an example event. We need to figure out the schema for custom events and change this to events we really need.
  await sendEvent({
    subject: "frontend",
    eventType: "frontend.recovery.attempt",
    data: { messages },
    dataVersion: "1",
  });

  return {
    props: {
      request,
      messages,
      formConfig,
    },
  };
};

const Recovery = ({ request, messages, formConfig }: RecoveryProps) => {
  return (
    <>
      {messages?.map((text, i) => {
        return <div key={i}>{text}</div>;
      })}
      {request ? (
        <form action={formConfig.action} method={formConfig.method}>
          {formConfig.fields.map(({ name, type, required, value }, i) => (
            <div key={i}>
              {type !== "hidden" ? <label htmlFor={name}>{name}</label> : null}
              <input
                id={name}
                name={name}
                type={type}
                required={required}
                defaultValue={(value as unknown) as string}
              />
            </div>
          ))}
          <div>
            <input type="submit" value="Submit!" />
          </div>
        </form>
      ) : (
        <div>Nothing</div>
      )}
    </>
  );
};

export default Recovery;

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";

import { CallProvider } from "../components/call-provider";

interface Props {
  meetingId: string;
};

export const CallView = ({
  meetingId
}: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="会议已结束"
          description="你无法再加入该会议"
        />
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={data.name} />
};

import Link from "next/link"
import { VideoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

interface Props {
  meetingId: string;
}

export const UpcomingState = ({
  meetingId,
}: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="尚未开始"
        description="当你开始会议后，摘要将显示在这里"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            开始会议
          </Link>
        </Button>
      </div>
    </div>
  )
}

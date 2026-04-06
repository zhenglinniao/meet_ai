import { EmptyState } from "@/components/empty-state"

export const ProcessingState = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/processing.svg"
        title="会议已完成"
        description="会议已结束，摘要将很快生成"
      />
    </div>
  )
}

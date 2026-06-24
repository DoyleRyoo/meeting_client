import { Plus, Save, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getActionItemsMock,
  getFullSummaryMock,
  getShortSummaryMock,
  type ActionItem,
  type FullSummarySection,
  updateMeetingSummariesMock,
  useApp,
} from "../components/context/context";
import { getNowStrings } from "../utils/dateTime";

type SummaryTab = "short" | "full" | "action";
type EditableSummaryItem = {
  id: string;
  value: string
};
type EditableFullSummarySection = {
  id: string;
  contextTitle: string;
  context: EditableSummaryItem[]
};

const createId = () => String(Date.now()) + "-" + Math.random().toString(36).slice(2);
const createEmptySection = (): EditableFullSummarySection => ({
  id: createId(),
  contextTitle: "",
  context: [{
    id: createId(),
    value: ""
  }]
});
const toEditableSections = (sections: FullSummarySection[]): EditableFullSummarySection[] => sections.length ? sections.map(
  (section) => ({
    id: createId(),
    contextTitle: section.contextTitle,
    context: section.context.length ? section.context.map(
      (value) => ({
        id: createId(),
        value
      })
    ) : [{ id: createId(), value: "" }]
  })
) : [createEmptySection()];
const toFullSummaryPayload = (
  sections: EditableFullSummarySection[]
): FullSummarySection[] => sections.map(
  (section) => ({ 
    contextTitle: section.contextTitle.trim() || "제목 없음",
    context: section.context.map(
      (item) => item.value.trim()).filter(Boolean)
  })
).filter(
  (section) => section.context.length > 0 || section.contextTitle !== "제목 없음"
);

export function SummaryPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { projects } = useApp();
  const project = projects.find(
    (currentProject) => currentProject.id === pid
  );
  const meetingId = project?.meetings.at(-1)?.id ?? pid ?? "";
  const { dateString } = getNowStrings();
  const meetingTitle = project ? dateString.replace(/\./g, "").slice(2) + " " + (project.meetings.length + 1) + "차 회의" : dateString.replace(/\./g, "").slice(2) + " 1차 회의";
  const [shortSummary, setShortSummary] = useState(
    () => getShortSummaryMock(meetingId).shortSummary
  );
  const [sections, setSections] = useState(() => toEditableSections(
    getFullSummaryMock(meetingId)
  ));
  const [actionItems, setActionItems] = useState<ActionItem[]>(
    () => getActionItemsMock(meetingId)
  );
  const [activeTab, setActiveTab] = useState<SummaryTab>("short");
  const updateSection = (
    sectionId: string,
    update: (section: EditableFullSummarySection) => EditableFullSummarySection
  ) => setSections(
    (current) => current.map(
      (section) => section.id === sectionId ? update(section) : section
    )
  );
  const removeSection = (sectionId: string) => setSections(
    (current) => {
      const next = current.filter(
        (section) => section.id !== sectionId
      ); 
      
      return next.length ? next : [createEmptySection()];
    }
  );
  const removeItem = (sectionId: string, itemId: string) => updateSection(
    sectionId, (section) => {
      const next = section.context.filter(
        (item) => item.id !== itemId
      ); 
      
      return {
        ...section, context: next.length ? next : [{
          id: createId(),
          value: ""
        }]
      };
    }
  );
  const save = () => updateMeetingSummariesMock(
    meetingId,
    shortSummary.trim(),
    toFullSummaryPayload(sections),
    actionItems
  );
  const updateAction = (id: string | undefined, patch: Partial<ActionItem>) => setActionItems(
      (items) => items.map(
        (item) => item.actionItemId === id ? { ...item, ...patch } : item
    )
  );
  const addActionItem = () => setActionItems((items) => [
    ...items,
    {
      actionItemId: createId(),
      meetingId,
      assigneeName: "",
      assigneeEmail: "",
      task: "",
      startDate: "",
      dueDate: "",
      priority: "MEDIUM",
      status: "미착수",
    },
  ]);

  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="relative flex items-center justify-center border-b border-border px-10 py-5">
      <h1 className="text-[18px] font-semibold">{meetingTitle}</h1>
      <div className="absolute right-10 flex gap-2">
        <button 
          onClick={save}
          className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-white"
        >
          <Save size={14} />
          저장
        </button>

        <button 
          onClick={() => navigate(`/projects/${pid}/record/uploading`)} 
          className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground/70"
        >
          <Upload size={14} />
          회의 업로드
        </button>
      </div>
    </div>
    <div className="border-b border-border px-10">
      <div className="mx-auto flex w-full max-w-[900px] gap-1">
        {([['short', '한 줄 요약'], ['full', '전체 요약'], ['action', '할 일 요약']] as const).map(
          ([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 
                "border-b-2 border-foreground text-foreground" : 
                "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>
    </div>
    <div className="flex flex-1 justify-center overflow-y-auto px-10 py-8">
      <div className="w-full max-w-[900px] space-y-8">
      {activeTab === "short" && (
        <section className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-base font-semibold">
            한 줄 요약
          </h2>

          <textarea 
            value={shortSummary}
            maxLength={200}
            onChange={(event) => setShortSummary(event.target.value)}
            rows={3}
            className="mt-3 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {shortSummary.length} / 200
          </p>
        </section>
      )}

      {activeTab === "full" && (
        <section className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              전체 요약
            </h2>
            <button
              type="button"
              onClick={() => setSections((current) => [...current, createEmptySection()])}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={14} />
              섹션 추가
            </button>
          </div>

          <div className="mt-4 space-y-5">{sections.map((section) => 
            <div key={section.id} className="rounded-lg border border-border p-4">
              <div className="flex gap-2">
                <input
                  value={section.contextTitle}
                  onChange={(event) => updateSection(section.id, (current) => ({ ...current, contextTitle: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !section.contextTitle && section.context.every((item) => !item.value.trim())) {
                      event.preventDefault();
                      removeSection(section.id);
                    }
                  }}
                  placeholder="섹션 제목"
                  className="h-9 flex-1 rounded-md border border-border px-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="rounded-md p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-3 space-y-2">{section.context.map(
                (item) => 
                  <div key={item.id} className="flex gap-2">
                    <textarea
                      value={item.value}
                      onChange={(event) => updateSection(section.id, (current) => ({
                        ...current,
                        context: current.context.map((currentItem) => currentItem.id === item.id ? {
                          ...currentItem,
                          value: event.target.value
                        } : currentItem)
                      }))}
                      onKeyDown={(event) => {
                        if (event.key === "Backspace" && !item.value) {
                          event.preventDefault();
                          removeItem(section.id, item.id);
                        }
                      }}
                      rows={2}
                      className="flex-1 resize-none rounded-md border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(section.id, item.id)}
                      className="rounded-md p-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => updateSection(
                  section.id, (current) => ({
                    ...current,
                    context: [
                      ...current.context,
                      { id: createId(), value: "" }
                    ]
                  })
                )}
                className="mt-3 flex items-center gap-1 text-sm text-primary"
              >
                <Plus size={14} />
                항목 추가
              </button>
            </div>)}
          </div>
        </section>
      )}

      {activeTab === "action" && (
        <section className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              할 일 요약
            </h2>
            <button
              type="button"
              onClick={addActionItem}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th>담당자</th>
                  <th>이메일</th>
                  <th>업무</th>
                  <th>시작일</th>
                  <th>마감일</th>
                  <th>우선순위</th>
                  <th>상태</th>
                </tr>
              </thead>

              <tbody>{actionItems.map((item) => 
                <tr key={item.actionItemId} className="border-b border-border/70">
                  <td className="py-2">
                    <input
                      value={item.assigneeName}
                      onChange={(event) => updateAction(item.actionItemId, { assigneeName: event.target.value })}
                      className="w-20 bg-transparent outline-none"
                    />
                  </td>
                  <td>
                    <input
                      value={item.assigneeEmail}
                      onChange={(event) => updateAction(item.actionItemId, { assigneeEmail: event.target.value })}
                      className="w-36 bg-transparent outline-none"
                    />
                  </td>
                  <td>
                    <input
                      value={item.task}
                      onChange={(event) => updateAction(item.actionItemId, { task: event.target.value })}
                      className="w-40 bg-transparent outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(event) => updateAction(item.actionItemId, { startDate: event.target.value })}
                      className="bg-transparent outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={item.dueDate}
                      onChange={(event) => updateAction(item.actionItemId, { dueDate: event.target.value })}
                      className="bg-transparent outline-none"
                    />
                  </td>
                  <td>
                    <select
                      value={item.priority}
                      onChange={(event) => updateAction(item.actionItemId, { priority: event.target.value as ActionItem["priority"] })}
                      className="bg-transparent outline-none"
                    >
                      <option value="HIGH">높음</option>
                      <option value="MEDIUM">중간</option>
                      <option value="LOW">낮음</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(event) => updateAction(item.actionItemId, { status: event.target.value as ActionItem["status"] })}
                      className="bg-transparent outline-none"
                    >
                      <option>미착수</option>
                      <option>진행중</option>
                      <option>완료</option>
                    </select>
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div></div>
  </div>;
}

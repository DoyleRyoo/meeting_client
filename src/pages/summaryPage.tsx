import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  FULL_SUMMARY,
  PRIORITY_COLOR,
  useApp,
} from "../components/context/context";
import { getNowStrings } from "../utils/dateTime";
import { SummarySection } from "../components/summary/summarySection";

export function SummaryPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { projects, tasks, setTasks, summaryTab, setSummaryTab } = useApp();

  const project = projects.find((currentProject) => currentProject.id === pid);
  const { dateString } = getNowStrings();
  const meetingTitle = project
    ? `${dateString.replace(/\./g, "").slice(2)} ${project.meetings.length + 1}차 회의`
    : `${dateString.replace(/\./g, "").slice(2)} 1차 회의`;

  const [coreItems, setCoreItems] = useState<string[]>([...FULL_SUMMARY.핵심]);
  const [discussionItems, setDiscussionItems] = useState<string[]>([
    ...FULL_SUMMARY.논의,
  ]);
  const [importantItems, setImportantItems] = useState<string[]>([
    ...FULL_SUMMARY.사항,
  ]);

  const handleUpload = () => {
    navigate(`/projects/${pid}/record/uploading`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex items-center justify-center border-b border-border px-10 py-5">
        <h1 className="text-[18px] font-semibold">{meetingTitle}</h1>
        <div className="absolute right-10">
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-foreground/80 active:scale-95"
          >
            <Upload size={14} />
            회의 업로드
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border px-10 pb-0 pt-5">
        {(["full", "tasks"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSummaryTab(tab)}
            className={`rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
              summaryTab === tab
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {tab === "full" ? "전체 요약" : "할 일 요약"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-8">
        {summaryTab === "full" ? (
          <div className="max-w-2xl space-y-8">
            <SummarySection title="회의 핵심 내용" dot="#F59E0B">
              <ul className="space-y-2">
                {coreItems.map((text, index) => (
                  <li key={index} className="flex gap-2.5">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <textarea
                      value={text}
                      onChange={(event) =>
                        setCoreItems(
                          coreItems.map((value, itemIndex) =>
                            itemIndex === index ? event.target.value : value,
                          ),
                        )
                      }
                      rows={2}
                      className="flex-1 resize-none border-b border-transparent bg-transparent py-0.5 text-[15px] font-light leading-relaxed text-foreground/80 outline-none transition-colors hover:border-border focus:border-primary"
                    />
                  </li>
                ))}
              </ul>
            </SummarySection>

            <SummarySection title="주요 논의 내용" dot="#3B82F6">
              <ul className="space-y-2">
                {discussionItems.map((text, index) => (
                  <li key={index} className="flex gap-2.5">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <textarea
                      value={text}
                      onChange={(event) =>
                        setDiscussionItems(
                          discussionItems.map((value, itemIndex) =>
                            itemIndex === index ? event.target.value : value,
                          ),
                        )
                      }
                      rows={2}
                      className="flex-1 resize-none border-b border-transparent bg-transparent py-0.5 text-[15px] font-light leading-relaxed text-foreground/80 outline-none transition-colors hover:border-border focus:border-primary"
                    />
                  </li>
                ))}
              </ul>
            </SummarySection>

            <SummarySection title="주요 사항" dot="#10B981">
              <ul className="space-y-2">
                {importantItems.map((text, index) => (
                  <li key={index} className="flex gap-2.5">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <textarea
                      value={text}
                      onChange={(event) =>
                        setImportantItems(
                          importantItems.map((value, itemIndex) =>
                            itemIndex === index ? event.target.value : value,
                          ),
                        )
                      }
                      rows={2}
                      className="flex-1 resize-none border-b border-transparent bg-transparent py-0.5 text-[15px] font-light leading-relaxed text-foreground/80 outline-none transition-colors hover:border-border focus:border-primary"
                    />
                  </li>
                ))}
              </ul>
            </SummarySection>
          </div>
        ) : (
          <div className="max-w-2xl space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-white px-4 py-3.5 transition-shadow hover:shadow-sm"
              >
                <button
                  onClick={() =>
                    setTasks(
                      tasks.map((currentTask) =>
                        currentTask.id === task.id
                          ? { ...currentTask, done: !currentTask.done }
                          : currentTask,
                      ),
                    )
                  }
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    task.done
                      ? "border-foreground bg-foreground"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  {task.done && (
                    <Check size={11} className="text-white" strokeWidth={3} />
                  )}
                </button>
                <p
                  className={`flex-1 text-[15px] font-light ${
                    task.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.text}
                </p>
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: task.assignee.color }}
                  >
                    {task.assignee.initials[0]}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {task.assignee.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

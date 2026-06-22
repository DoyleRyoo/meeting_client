import { ChevronRight, Folder } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../components/context/context";

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { projects } = useApp();

  const selectedProject = projects.find((project) => project.id === pid);

  if (!selectedProject) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          프로젝트를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex items-center justify-center border-b border-border px-10 py-6">
        <h1 className="text-[22px] font-semibold">{selectedProject.name}</h1>
        <div className="absolute right-10">
          <button
            onClick={() => navigate(`/projects/${pid}/update`)}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted"
          >
            프로젝트 설정
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-6">
        <div className="max-w-xl space-y-2">
          {[...selectedProject.meetings].reverse().map((meeting) => (
            <button
              key={meeting.id}
              className="group flex w-full items-center gap-3.5 rounded-xl border border-border bg-white px-4 py-4 transition-all hover:shadow-sm"
            >
              <Folder
                size={18}
                className="shrink-0 text-amber-400"
                fill="#FCD34D"
              />
              <div className="flex-1 text-left">
                <p className="text-[15px] font-semibold">
                  {meeting.date.replace(/\./g, "")} {meeting.title}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground transition-colors group-hover:text-foreground"
              />
            </button>
          ))}
          {selectedProject.meetings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-sm font-light">아직 회의가 없습니다.</p>
              <p className="mt-1 text-sm font-light">
                아래 버튼으로 첫 번째 회의를 시작해보세요.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center border-t border-border pb-10 pt-4">
        <button
          onClick={() => navigate(`/projects/${pid}/record`)}
          className="flex items-center gap-2 rounded-full bg-destructive px-7 py-3 text-sm font-semibold text-white shadow shadow-destructive/25 transition-all hover:bg-destructive/90 active:scale-95"
        >
          + 회의 시작하기
        </button>
      </div>
    </div>
  );
}

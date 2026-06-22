import { ChevronDown, Folder, Plus } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useApp } from "../components/context/context";

export function RootPageLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { projects } = useApp();

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-background"
      style={{
        fontFamily: "'Pretendard', system-ui, -apple-system, sans-serif",
      }}
    >
      <aside className="flex h-full w-[240px] shrink-0 select-none flex-col border-r border-border bg-white">
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-white">
              진
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">진상현</p>
              <p className="truncate text-xs text-muted-foreground">
                test@gmail.com
              </p>
            </div>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-1 pt-4">
          <button className="flex items-center gap-1 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground">
            Projects
            <ChevronDown size={13} />
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
          {projects.map((project) => {
            const active =
              pathname === `/projects/${project.id}` ||
              pathname === `/projects/${project.id}/update`;

            return (
              <button
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                  active
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Folder
                  size={15}
                  className={active ? "text-amber-500" : "text-amber-400"}
                  fill={active ? "#F59E0B" : "#FCD34D"}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {project.name}
                  </p>
                  {project.meetings.length > 0 && (
                    <p className="truncate text-xs text-muted-foreground">
                      {project.meetings[project.meetings.length - 1].title}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

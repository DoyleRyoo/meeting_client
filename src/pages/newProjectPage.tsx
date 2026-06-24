import { useNavigate } from "react-router";
import {
  PARTICIPANTS,
  type Project,
  useApp,
} from "../components/context/context";
import { ProjectForm } from "../components/project/projectForm";
import { useAuthStore } from "../stores/authStore";

export function NewProjectPage() {
  const navigate = useNavigate();
  const { setProjects } = useApp();
  const oauthUser = useAuthStore((state) => state.oauthUser);

  return (
    <ProjectForm
      headerTitle="새로운 프로젝트"
      initial={{
        title: "New Project",
        description: "",
        participants: [PARTICIPANTS[0], PARTICIPANTS[1]],
        notionUrl: "",
      }}
      submitLabel="회의 시작하기"
      cancelLabel="취소"
      onCancel={() => navigate("/")}
      onSubmit={({ title, description, participants, notionUrl }) => {
        // 실제 백엔드와 연결에 사용되는 코드입니다.
        // 백엔드 프로젝트 생성 API 연동 완료 후 주석을 해제하여 사용합니다.
        // export const createProject = async (payload: CreateProjectRequest) => {
        //   const response = await axios.post("/projects/create", payload);
        //   return response.data;
        // };

        // 테스트 코드입니다. 추후 삭제되어야합니다.
        // ===== 테스트 프로젝트 생성 로직 시작 =====
        const projectId = `mock-project-${Date.now()}`;
        const timestamp = new Date().toISOString();
        const newProject: Project = {
          id: projectId,
          projectId,
          companyId: oauthUser?.companyId ?? "mock-company",
          title: title || "새 프로젝트",
          projectDescription: description,
          projectStatus: "ACTIVE",
          projectCreatedAt: timestamp,
          projectUpdatedAt: timestamp,
          participants,
          projectParticipants: participants.map((participant, index) => ({
            ...participant,
            projectMemberId: `mock-project-member-${projectId}-${participant.id}`,
            projectId,
            userId: index === 0 ? oauthUser?.email ?? participant.id : participant.id,
            projectMemberRole: index === 0 ? "OWNER" : "MEMBER",
            projectMemberCreatedAt: timestamp,
            projectMemberUpdatedAt: timestamp,
            projectMemberStatus: "ACTIVE",
            projectMemberGrade: "MEMBER",
          })),
          notionUrl,
          meetings: [],
        };

        setProjects((previousProjects) => [...previousProjects, newProject]);
        // ===== 테스트 프로젝트 생성 로직 끝 =====
        navigate(`/projects/${newProject.id}/record`);
      }}
    />
  );
}

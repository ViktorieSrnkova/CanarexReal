import React from "react";
import ActionCard from "../../components/dashboard/ActionCard";
import { Typography } from "antd";
import StatCard from "../../components/dashboard/StatCard";
import { getDashboard } from "../../api/dashboard";
import LoadingPage from "../system/LoadingPage";
import type { DashboardResponse } from "../../types/api";

const { Title } = Typography;

const createDashboardSections = (stats: DashboardResponse) => [
  {
    title: "Inzeráty",
    actions: [
      { path: "/listings", purpose: "Spravovat inzeráty" },
      { path: "/listings/create", purpose: "Vytvořit nový inzerát" },
    ],
    stats: {
      created: stats.listings.latestCreated,
      visibility: stats.listings.visible,
      index: stats.listings.lastIndex,
      total: stats.listings.total,
      context: "inzerát",
    },
  },
  {
    title: "Aktuality",
    actions: [
      { path: "/news", purpose: "Spravovat aktuality" },
      { path: "/news/create", purpose: "Vytvořit nový článek" },
    ],
    stats: {
      created: stats.news.latestCreated,
      visibility: stats.news.visible,
      total: stats.news.total,
      context: "aktualita",
    },
  },
  {
    title: "Formuláře",
    actions: [{ path: "/forms", purpose: "Spravovat formuláře" }],
    stats: {
      created: "2024-06-01T12:00:00Z",
      amountNew: stats.forms.new,
      amountUnprocessed: stats.forms.unprocessed,
      context: "kontakt",
      name: stats.forms.name,
      surname: stats.forms.surname,
    },
  },
];
function DisplaySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <Title level={3}>{title}</Title>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}
const DashboardPage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [stats, setStats] = React.useState<DashboardResponse | null>(null);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1110);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboard();
        console.log("visibility:", data.news.visible, typeof data.news.visible);
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    load();
  }, []);

  if (!stats) return <LoadingPage />;
  return (
    <div className="dashboard-page">
      {createDashboardSections(stats).map((section) => (
        <DisplaySection key={section.title} title={section.title}>
          <div
            style={
              isMobile
                ? {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "stretch",
                  }
                : {
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 520px) 1fr",
                    gap: 8,
                    width: "100%",
                    alignItems: "stretch",
                  }
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                maxWidth: 520,
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {section.actions.map((action) => (
                <div key={action.path}>
                  <ActionCard {...action} />
                </div>
              ))}
            </div>

            {section.stats && (
              <div
                style={{
                  flex: isMobile ? "0 0 300px" : "1 1 auto",
                  width: isMobile ? 300 : "100%",
                  minWidth: 300,
                }}
              >
                <StatCard {...section.stats} />
              </div>
            )}
          </div>
        </DisplaySection>
      ))}
    </div>
  );
};
export default DashboardPage;
